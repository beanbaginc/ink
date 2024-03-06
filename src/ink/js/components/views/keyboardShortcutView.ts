/**
 * A component for showing an available keyboard shortcut.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';

import {
    paint,
    inkComponent,
    renderInto,
} from '../../core';
import {
    KeyboardShortcutRegistry,
    RegisterKeyboardShortcutOptions,
    RegisteredKeyboardShortcut,
} from '../../foundation';
import {
    BaseComponentView,
    BaseComponentViewOptions,
} from './baseComponentView';


/**
 * A mapping from consumer-provided key labels to symbols.
 *
 * This will map certain key labels (such as Control or Tab) to familiar
 * symbols or strings, depending on the platform.
 *
 * Version Added:
 *     1.0
 */
const SYMBOL_MAP =
    window.navigator.platform === 'MacIntel'
    ? {
        'Alt': '⌥',
        'AltGraph': '⌥',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'ArrowUp': '↑',
        'Backspace': '⌫',
        'CapsLock': '⇪',
        'Control': '⌃',
        'Delete': '⌫',
        'Escape': 'Esc',
        'Meta': '⌘',
        'Return': '↩︎',
        'Shift': '⇧',
        'Tab': '⇥',
    }
    : {
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'ArrowUp': '↑',
        'Escape': 'Esc',
    };


/**
 * A mapping of consumer-provided key labels to standard labels.
 *
 * Mapped labels are used both for symbol lookup and for inclusion in
 * ``aria-keyshortcuts``.
 *
 * Version Added:
 *     1.0
 */
const KEY_ALIAS_MAP = {
    'Cmd': 'Meta',
    'Down': 'ArrowDown',
    'Left': 'ArrowLeft',
    'Option': 'AltGraph',
    'Right': 'ArrowRight',
    'Up': 'ArrowUp',
};


/**
 * A mapping of normalized key modifier labels to flags.
 *
 * Version Added:
 *     1.0
 */
const KEY_EVENT_MODIFIER_MAP = {
    'Alt': 'altKey',
    'AltGraph': 'altKey',
    'Cmd': 'metaKey',
    'Control': 'ctrlKey',
    'Meta': 'metaKey',
    'Shift': 'shiftKey',
};


/**
 * Options for KeyboardShortcutView.
 *
 * Version Added:
 *     1.0
 */
export interface KeyboardShortcutViewOptions extends BaseComponentViewOptions {
    /**
     * The keys to show.
     *
     * These may be normalized for display.
     *
     * Combinations of keys should be separated solely with a ``-``.
     */
    keys: string;

    /**
     * An element to attach ARIA information to after render.
     *
     * If this is not available at the time of construction, the consumer can
     * call :js:func:`KeyboardShortcutView.attachTo` instead.
     */
    attachTo?: HTMLElement;

    /**
     * The action to trigger on the specified parent element when invoked.
     *
     * If set, ``registry`` must also be set. This will then be registered
     * on that registry. If not set, then this components will only display
     * the shortcut, but won't register it.
     *
     * If set to "click", it will send a click event to the parent element.
     *
     * If set to a callback, the callback will be invoked directly.
     */
    onInvoke?: 'click' | (() => void);

    /**
     * An explicit keyboard shortcut registry used to register for invocation.
     *
     * This must be provided in order to register a shortcut.
     */
    registry?: KeyboardShortcutRegistry;

    /**
     * Whether symbols can be shown for keyboard shortcuts.
     *
     * This is enabled by default, and is customizable primarily for
     * testing purposes.
     */
    showSymbols?: boolean;
}


/**
 * Component for showing and registering a keyboard shortcut.
 *
 * This displays a visual indicator for a keyboard shortcut, attempting to
 * display the keys in a form that makes sense on the target platform. It
 * also takes care of registering ARIA information on the keyboard shortcuts
 * and an event handler for the shortcut to invoke an action (if ``onInvoke``
 * and ``registry`` are provided).
 *
 * Version Added:
 *     1.0
 */
@inkComponent('Ink.KeyboardShortcut')
@spina
export class KeyboardShortcutView<
    TModel extends BaseModel = BaseModel,
    TOptions extends KeyboardShortcutViewOptions = KeyboardShortcutViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLSpanElement,
    TOptions
> {
    static tagName = 'span';
    static className = 'ink-c-keyboard-shortcut';

    /**********************
     * Instance variables *
     **********************/

    /**
     * The computed value for an ``aria-keyshortcuts`` attributes.
     */
    #ariaKeyShortcuts: string = null;

    /**
     * A reference to information on a keyboard shortcut registration.
     */
    #registeredInfoRef: WeakRef<RegisteredKeyboardShortcut> = null;

    /**
     * A reference to a keyboard shortcut registry used for registration.
     */
    #registryRef: WeakRef<KeyboardShortcutRegistry> = null;

    /**
     * Initialize the component.
     *
     * This will validate the options. It may throw an error if there are
     * necessary options missing.
     *
     * Args:
     *     options (object):
     *         The options for the component.
     */
    initialize(options: TOptions) {
        super.initialize(options);

        /* Validate and normalize settings. */
        if (!options || !options.keys) {
            throw Error(
                'Ink.KeyboardShortcut is missing a value for option "keys".'
            );
        }

        const onInvoke = options.onInvoke;

        if (!!onInvoke !== !!options.registry) {
            throw Error(
                'Ink.KeyboardShortcut onInvoke and registry must both be ' +
                'set in order to register a shortcut.'
            );
        }

        if (onInvoke) {
            if (onInvoke === 'click') {
                options.onInvoke = () => this.el.click();
            } else if (typeof onInvoke !== 'function') {
                throw Error(
                    'Ink.KeyboardShortcut onInvoke must be "click" or a ' +
                    'function.'
                );
            }
        }
    }

    /**
     * Attach information for this keyboard shortcut to a parent element.
     *
     * This should be called for interactive elements registering keyboard
     * shortcuts in order to set the proper accessibility information on
     * parent elements.
     *
     * Args:
     *     el (HTMLElement):
     *         The interactive element to attach this to.
     */
    attachTo(el: HTMLElement) {
        el.setAttribute('aria-keyshortcuts', this.#ariaKeyShortcuts);
        this.el.setAttribute('aria-hidden', 'true');
    }

    /**
     * Handle the removal of the component.
     *
     * This will unregister any registered keyboard shortcut.
     */
    protected onRemove() {
        const registeredInfo = this.#registeredInfoRef?.deref();

        if (registeredInfo) {
            const modifiers = registeredInfo.modifiers;

            this.#registryRef
                ?.deref()
                ?.unregisterShortcut({
                    altKey: modifiers.altKey,
                    ctrlKey: modifiers.ctrlKey,
                    key: registeredInfo.key,
                    metaKey: modifiers.metaKey,
                    shiftKey: modifiers.shiftKey,
                });
        }

        this.#registryRef = null;
        this.#registeredInfoRef = null;
    }

    /**
     * Handle the initial render of the component.
     *
     * This will render the keyboard shortcut in a form suitable for the
     * local operating system, and attach ARIA information.
     *
     * It will also take care of registering the shortcut with a registry,
     * if needed.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const options = this.initialComponentState.options;
        const rawKeys = options.keys;
        const keys = rawKeys.split('-');
        const ariaKeys: string[] = [];
        const registerOptions: Partial<RegisterKeyboardShortcutOptions> = {};
        const symbolMap = (options.showSymbols !== false
                           ? SYMBOL_MAP
                           : {});

        el.title = rawKeys;
        el.setAttribute('aria-label', rawKeys);

        for (const key of keys) {
            const normKey = KEY_ALIAS_MAP[key] || key;
            const modifier = KEY_EVENT_MODIFIER_MAP[key];

            ariaKeys.push(normKey);

            if (modifier) {
                registerOptions[modifier] = true;
            } else {
                console.assert(!registerOptions.key,
                               `Too many non-modifier keys in "${rawKeys}"`);
                registerOptions.key = normKey;
            }

            renderInto(el, paint`
                <span class="ink-c-keyboard-shortcut__key"
                      aria-hidden="true">
                 ${symbolMap[normKey] || key}
                </span>
            `);
        }

        this.#ariaKeyShortcuts = ariaKeys.join('+');

        if (options.attachTo) {
            this.attachTo(options.attachTo);
        }

        /* Register the keyboard shortcut, if requested. */
        const onInvoke = options.onInvoke as (() => void);
        const registry = options.registry;

        if (registry && onInvoke) {
            /* Set up the event dispatch handler. */
            const registeredInfo = registry.registerShortcut({
                altKey: registerOptions.altKey,
                ctrlKey: registerOptions.ctrlKey,
                key: registerOptions.key,
                metaKey: registerOptions.metaKey,
                onInvoke: onInvoke,
                shiftKey: registerOptions.shiftKey,
            });

            /* Make sure registration was successful, and didn't conflict. */
            if (registeredInfo) {
                this.#registeredInfoRef = new WeakRef(registeredInfo);
                this.#registryRef = new WeakRef(registry);
            }
        }
    }
}
