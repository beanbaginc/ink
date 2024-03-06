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
export class KeyboardShortcutRegistry extends BaseModel {
    /**********************
     * Instance variables *
     **********************/

    /**
     * A mapping of keys representing shortcuts to registration information.
     */
    private _shortcuts: {
        [mapKey: string]: RegisteredKeyboardShortcut;
    } = {};

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

        if (mapKey in shortcuts) {
            const label = this.#buildKeyLabel(key, modifiers);
            console.warn(
                `Keyboard shortcut "${label}" is already registered.`);

            return null;
        }

        const registeredInfo: RegisteredKeyboardShortcut = {
            key: key,
            modifiers: modifiers,
            onInvoke: options.onInvoke,
        };

        shortcuts[mapKey] = registeredInfo;

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

        if (mapKey in shortcuts) {
            delete shortcuts[mapKey];
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

        return this._shortcuts[mapKey] || null;
    }

    /**
     * Return all registered keyboard shortcuts.
     *
     * Returns:
     *     Array of object:
     *     The array of all registered keyboard shortcut information.
     */
    getAllShortcuts(): RegisteredKeyboardShortcut[] {
        return Object.values(this._shortcuts);
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
