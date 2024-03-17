/**
 * A registry for keyboard shortcuts.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';


/**
 * Keyboard modifier flags.
 *
 * This is intentionally built as a subset of the attributes found in
 * :js:class:`KeyboardEvent`.
 *
 * Version Added:
 *     1.0
 */
export interface KeyboardModifiers {
    /** Whether the Alt key is pressed. */
    altKey?: boolean;

    /** Whether the Control key is pressed. */
    ctrlKey?: boolean;

    /** Whether the Meta/Command key is pressed. */
    metaKey?: boolean;

    /** Whether the Shift key is pressed. */
    shiftKey?: boolean;
}


/**
 * Information on a registered keyboard shortcut.
 *
 * Version Added:
 *     1.0
 */
export interface RegisteredKeyboardShortcut {
    /**
     * The function to invoke when the keyboard shortcut is pressed.
     */
    onInvoke: () => void;

    /**
     * The key name that was registered.
     *
     * This must map to a valid :js:class:`KeyboardEvent` key value.
     */
    key: string;

    /**
     * Any keyboard modifiers that must be pressed along with the key.
     */
    modifiers?: KeyboardModifiers;

    /**
     * An object/element this shortcut is bound to, for registration purposes.
     *
     * If this object disappears, then the keyboard shortcut will be
     * unregistered.
     */
    boundObj?: WeakRef<WeakKey>;

    /**
     * A display category for listing the key.
     */
    category?: string;

    /**
     * A short summary of what the key invokes.
     *
     * If blank, the key shouldn't be shown in any lists.
     */
    summary?: string;
}


/**
 * Options for registering a keyboard shortcut.
 *
 * Version Added:
 *     1.0
 */
export interface RegisterKeyboardShortcutOptions extends KeyboardModifiers {
    /**
     * The key name to register.
     *
     * This must map to a valid :js:class:`KeyboardEvent` key value.
     */
    key: string;

    /**
     * The function to invoke when the keyboard shortcut is pressed.
     */
    onInvoke: () => void;

    /**
     * An object/element this shortcut is bound to, for registration purposes.
     *
     * If this object disappears, then the keyboard shortcut will be
     * unregistered.
     */
    boundObj?: WeakKey;

    /**
     * A display category for listing the key.
     */
    category?: string;

    /**
     * A short summary of what the key invokes.
     *
     * Leave blank to avoid showing this key.
     */
    summary?: string;
}


/**
 * Options for unregistering a keyboard shortcut.
 */
export interface UnregisterKeyboardShortcutOptions extends KeyboardModifiers {
    /**
     * The key name to unregister.
     */
    key: string;
}


/**
 * A registry for managing keyboard shortcuts.
 *
 * This allows consumers to register keyboard shortcuts that should activate
 * a method when pressed. These may include :js:class:`KeyboardEvent` key
 * names along with standard Control/Shift/Meta/Alt modifiers.
 *
 * This class is responsible for handling the registration. It should be
 * passed as a model to :js:class:`KeyboardShortcutRegistryView`, which can be
 * bound to the element that should handle these shortcuts.
 *
 * Version Added:
 *     1.0
 */
@spina
export class KeyboardShortcutRegistry extends BaseModel implements Iterable<
    RegisteredKeyboardShortcut
> {
    /**********************
     * Instance variables *
     **********************/

    /**
     * A mapping of keys representing shortcuts to registration information.
     */
    private _shortcuts: Map<string, RegisteredKeyboardShortcut> = new Map();

    /**
     * A registry for tracking when bound objects are finalized.
     *
     * This is used to attempt to proactively unregister shortcuts that are
     * no longer needed.
     */
    #finalizationRegistry: FinalizationRegistry<string>;

    /**
     * Initialize the registry.
     *
     * This will set up state to begin tracking and expiring keyboard
     * shortcuts.
     */
    initialize() {
        super.initialize();

        /*
         * Optimistically listen for when keyboard shortcuts bound to an
         * element are garbage-collected. We can then unregister them.
         */
        this.#finalizationRegistry = new FinalizationRegistry<string>(
            (mapKey: string) => {
                const shortcuts = this._shortcuts;

                if (shortcuts.has(mapKey)) {
                    shortcuts.delete(mapKey);
                }
            });
    }

    /**
     * Register a keyboard shortcut.
     *
     * The provided handler will be invoked by the associated registry view
     * any time this shortcut is pressed.
     *
     * Only one shortcut can be registered for any given combination of a key
     * and modifiers.
     *
     * Args:
     *     options (object):
     *         The options for registering this shortcut.
     *
     * Returns:
     *     object:
     *     Information on the registered shortcut.
     *
     *     If there was a conflict, this will be ``null``.
     */
    registerShortcut(
        options: RegisterKeyboardShortcutOptions,
    ): RegisteredKeyboardShortcut | null {
        const shortcuts = this._shortcuts;
        const key = options.key;
        const modifiers: KeyboardModifiers = {
            altKey: !!options.altKey,
            ctrlKey: !!options.ctrlKey,
            metaKey: !!options.metaKey,
            shiftKey: !!options.shiftKey,
        };
        const mapKey = this.#buildMapKey(key, modifiers);
        const existingInfo = shortcuts.get(mapKey);

        /*
         * If the old shortcut is bound to an element that no longer
         * exists, we can replace it. Ideally FinalizationRegistry would
         * have told us, but it may not have had a chance yet.
         */
        if (existingInfo && !this._isExpired(existingInfo)) {
            const label = this.#buildKeyLabel(key, modifiers);
            console.warn(
                `Keyboard shortcut "${label}" is already registered.`);

            return null;
        }

        const boundObj = options.boundObj;
        const registeredInfo: RegisteredKeyboardShortcut = {
            boundObj: boundObj ? new WeakRef(boundObj) : null,
            key: key,
            modifiers: modifiers,
            onInvoke: options.onInvoke,
        };

        shortcuts.set(mapKey, registeredInfo);

        if (boundObj) {
            this.#finalizationRegistry.register(boundObj, mapKey);
        }

        return registeredInfo;
    }

    /**
     * Unregister a keyboard shortcut.
     *
     * Args:
     *     options (object):
     *         The options for registering this shortcut.
     */
    unregisterShortcut(options: UnregisterKeyboardShortcutOptions) {
        const shortcuts = this._shortcuts;
        const key = options.key;
        const modifiers: KeyboardModifiers = options;
        const mapKey = this.#buildMapKey(key, modifiers);

        if (shortcuts.has(mapKey)) {
            shortcuts.delete(mapKey);
        } else {
            const label = this.#buildKeyLabel(key, modifiers);
            console.warn(`Keyboard shortcut "${label}" is not registered.`);
        }
    }

    /**
     * Return a registered keyboard shortcut.
     *
     * Args:
     *     key (string):
     *         The registered key.
     *
     *     modifiers (object):
     *         The registered modifier flags.
     *
     * Returns:
     *     object:
     *     Information on the keyboard shortcut.
     *
     *     This will be ``null`` if the shortcut could not be found.
     */
    getShortcut(
        key: string,
        modifiers: KeyboardModifiers = {},
    ): RegisteredKeyboardShortcut | null {
        const mapKey = this.#buildMapKey(key, modifiers);
        let registeredShortcut = this._shortcuts.get(mapKey) || null;

        if (registeredShortcut && this._isExpired(registeredShortcut)) {
            this._shortcuts.delete(mapKey);
            registeredShortcut = null;
        }

        return registeredShortcut;
    }

    /**
     * Return whether a registered keyboard shortcut is expired.
     *
     * Args:
     *     registeredShortcut (object):
     *         The registered keyboard shortcut to check.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the shortcut has expired. ``false`` if it is still
     *     valid.
     */
    private _isExpired(
        registeredShortcut: RegisteredKeyboardShortcut,
    ): boolean {
        const boundObj = registeredShortcut.boundObj;

        return boundObj !== null && boundObj.deref() === null;
    }

    /**
     * Iterate over all registered keyboard shortcuts.
     *
     * Returns:
     *     Iterator:
     *     An iterator of registered keyboard shortcuts.
     */
    [Symbol.iterator](): Iterator<RegisteredKeyboardShortcut> {
        const valuesIter = this._shortcuts.values();

        return {
            next: (): IteratorResult<RegisteredKeyboardShortcut> => {
                /*
                 * We need to ensure we only return shortcuts that are still
                 * valid. Ideally FinalizationRegistry would have told us, but
                 * it may not have had a chance yet.
                 *
                 * So the approach is to loop until we're either done or get a
                 * non-expired value, which we'll then return to the user.
                 */
                let value;

                while (value === undefined) {
                    const result = valuesIter.next();

                    if (result.done) {
                        return {
                            done: true,
                            value: undefined,
                        };
                    } else {
                        value = result.value;

                        if (this._isExpired(value)) {
                            /* We'll skip this and try again. */
                            value = undefined;
                        }
                    }
                }

                return {
                    done: false,
                    value: value,
                };
            },
        };
    }

    /**
     * Return a label describing a key and modifiers.
     *
     * This is currently only used internally for error reporting.
     *
     * Args:
     *     key (string):
     *         The key to show.
     *
     *     modifiers (object):
     *         The modifiers to show.
     *
     * Returns:
     *     string:
     *     A label describing the keys.
     */
    #buildKeyLabel(
        key: string,
        modifiers: KeyboardModifiers,
    ): string {
        const parts: string[] = [];

        if (modifiers.altKey) {
            parts.push('Alt');
        }

        if (modifiers.shiftKey) {
            parts.push('Shift');
        }

        if (modifiers.ctrlKey) {
            parts.push('Control');
        }

        if (modifiers.metaKey) {
            parts.push('Meta');
        }

        parts.push(key);

        return parts.join('-');
    }

    /**
     * Return a map key for shortcut registration and lookup.
     *
     * Args:
     *     key (string):
     *         The shortcut key.
     *
     *     modifiers (object):
     *         The shortcut modifiers.
     *
     * Returns:
     *     string:
     *     A map key used for registration and lookup.
     */
    #buildMapKey(
        key: string,
        modifiers: KeyboardModifiers,
    ): string {
        let flags = 0;

        if (modifiers.altKey) {
            flags |= 0x01;
        }

        if (modifiers.ctrlKey) {
            flags |= 0x02;
        }

        if (modifiers.metaKey) {
            flags |= 0x04;
        }

        if (modifiers.shiftKey) {
            flags |= 0x08;
        }

        return `${key.toLowerCase()}-${flags}`;
    }
}
