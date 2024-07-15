/**
 * A component for a standard button.
 *
 * Version Added:
 *     1.0
 */

import {
    type BaseModel,
    spina,
} from '@beanbag/spina';
import _ from 'underscore';

import {
    craft,
    inkComponent,
    paint,
    renderInto,
    setProps,
} from '../../core';
import {
    type KeyboardShortcutRegistry,
} from '../../foundation';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';
import {
    type KeyboardShortcutView,
} from './keyboardShortcutView';


/**
 * The type of a button.
 *
 * Version Added:
 *     1.0
 */
export enum ButtonType {
    /** A button representing a dangerous or destructive operation. */
    DANGER = 'danger',

    /** A primary or default button. */
    PRIMARY = 'primary',

    /** A button that resets the form. */
    RESET = 'reset',

    /** A standard, non-default button. */
    STANDARD = 'standard',

    /** A button that submits the form. */
    SUBMIT = 'submit',
}


/**
 * Options for ButtonView.
 *
 * Version Added:
 *     1.0
 */
export interface ButtonViewOptions extends BaseComponentViewOptions {
    /**
     * Arbitrary elements to set on the button element.
     */
    attrs?: Partial<HTMLButtonElement>;

    /**
     * Whether the button should have focus set automatically.
     */
    autofocus?: boolean;

    /**
     * Whether the button should show a busy state.
     */
    busy?: boolean;

    /**
     * Whether the button should be disabled.
     */
    disabled?: boolean;

    /**
     * A link to set for the button.
     *
     * This is only valid when specifying ``tagName="a"``.
     */
    href?: string;

    /**
     * Optional name of an icon to display.
     */
    iconName?: string;

    /**
     * A keyboard shortcut used to activate this button.
     *
     * This requires that ``keyboardShortcutRegistry`` is also provided.
     */
    keyboardShortcut?: string;

    /**
     * The keyboard shortcut registry used for shortcut registration.
     */
    keyboardShortcutRegistry?: KeyboardShortcutRegistry;

    /**
     * Handler to invoke when the button is clicked.
     */
    onClick?: () => void;

    /**
     * Whether to show a registered keyboard shortcut.
     */
    showKeyboardShortcut?: boolean;

    /**
     * The type of button.
     *
     * This defaults to :js:attr:`ButtonType.STANDARD`.
     */
    type?: ButtonType;
}


/**
 * Component for showing a standard button.
 *
 * Ink buttons are based on standard HTML buttons, but provide additional
 * information such as icons, keyboard shortcut indicators, and even busy
 * animations. They're built to be accessible, using appropriate ARIA
 * attributes to indicate state.
 *
 * Buttons can take an explicit click handler during construction, which will
 * be used whenever the button is clicked (as long as it's not in a busy
 * state). When set, DOM "click" events will not be used. If an explicit
 * handler is not set, consumers should listen to DOM "click" events.
 *
 * Button state can be modified at runtime.
 *
 * They may also be ``<button>`` elements (default) or ``<a>`` elements.
 *
 * Version Added:
 *     1.0
 */
@inkComponent('Ink.Button')
@spina
export class ButtonView<
    TModel extends BaseModel = BaseModel,
    TOptions extends ButtonViewOptions = ButtonViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLAnchorElement | HTMLButtonElement,
    TOptions
> {
    static tagName = 'button';
    static className = 'ink-c-button';
    static allowComponentChildren = true;

    /**********************
     * Instance variables *
     **********************/

    /**
     * Whether to lock rendering of the button.
     *
     * This is used to manage internal state updates.
     */
    #lockRender: boolean = false;

    /** The name of an icon to show. */
    #iconName: string | null;

    /** A keyboard shortcut used to activate this button. */
    #keyboardShortcut: string | null;

    /** The keyboard shortcut registry used for shortcut registration. */
    #keyboardShortcutRegistry: KeyboardShortcutRegistry | null;

    /** A keyboard shortcut used to activate this button. */
    #keyboardShortcutView: KeyboardShortcutView | null;

    /** The label to show on the button. */
    #label: string = null;

    /**
     * Whether to show a registered keyboard shortcut.
     */
    #showKeyboardShortcut: boolean;

    /**
     * Initialize the button.
     *
     * Args:
     *     options (ButtonViewOptions):
     *         Options for the button.
     */
    initialize(options: TOptions) {
        super.initialize(options);

        this.#iconName = options.iconName || null;
        this.#keyboardShortcut = options.keyboardShortcut || null;
        this.#keyboardShortcutRegistry =
            options.keyboardShortcutRegistry || null;
        this.#showKeyboardShortcut = !!options.showKeyboardShortcut;

        if (!options.type) {
            options.type = ButtonType.STANDARD;
        }
    }

    /**
     * Handle children set in the button.
     *
     * This component takes a single text string as a child, for use as the
     * label.
     *
     * Args:
     *     children (string[]):
     *         The button label.
     *
     * Raises:
     *     Error:
     *         An incompatible child was provided, or the wrong number of
     *         children were provided.
     */
    setComponentChildren(children: string[]) {
        if (children.length > 0) {
            if (children.length !== 1 ||
                typeof (children[0] || '') !== 'string') {
                throw Error(
                    'Ink.Button can only accept a single string child as a ' +
                    'label.'
                );
            }

            this.label = children[0];
        } else {
            this.label = '';
        }
    }

    /**
     * Return whether the button is set to have focus automatically.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the button is set to auto-focus. ``false`` if it is not.
     */
    get autofocus(): boolean {
        return this.el.autofocus;
    }

    /**
     * Set whether the button is set to have focus automatically.
     *
     * Args:
     *     newAutoFocus (boolean):
     *         ``true`` if the button should be set to auto-focus. ``false``
     *         if it should not.
     */
    set autofocus(newAutoFocus: boolean) {
        this.el.autofocus = newAutoFocus;
    }

    /**
     * Return whether the button is in a busy state.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the button is in a busy state. ``false`` if it is not.
     */
    get busy(): boolean {
        return this.el.getAttribute('aria-busy') === 'true';
    }

    /**
     * Set whether the button is in a busy state.
     *
     * Args:
     *     newBusy (boolean):
     *         ``true`` if the button should be in a busy state. ``false``
     *         if it should not.
     */
    set busy(newBusy: boolean) {
        if (newBusy) {
            this.el.setAttribute('aria-busy', 'true');
        } else {
            this.el.removeAttribute('aria-busy');
        }
    }

    /**
     * Return whether the button is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the button is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        const el = this.el;

        if (el instanceof HTMLButtonElement) {
            return el.disabled;
        } else {
            return el.classList.contains('-is-disabled');
        }
    }

    /**
     * Set whether the button is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the button should be disabled. ``false``
     *         if it should not.
     */
    set disabled(newDisabled: boolean) {
        const el = this.el;

        if (el instanceof HTMLButtonElement) {
            el.disabled = newDisabled;
        } else {
            el.classList.toggle('-is-disabled', newDisabled);
        }
    }

    /**
     * Return the link target to navigate to on click.
     *
     * This is only supported for button links (``tagName="a"``).
     *
     * Returns:
     *     string:
     *     The link target.
     */
    get href(): string | null {
        return this.el.getAttribute('href') || null;
    }

    /**
     * Set the link target to navigate to on click.
     *
     * This is only supported for button links (``tagName="a"``).
     *
     * Args:
     *     newHref (string):
     *         The new link target.
     */
    set href(newHref: string) {
        const el = this.el;

        if (el instanceof HTMLAnchorElement) {
            if (newHref) {
                el.setAttribute('href', newHref);
            } else {
                el.removeAttribute('href');
            }
        } else if (newHref) {
            console.warn('href is not valid for button links (tagName="a").');
        }
    }

    /**
     * Return the name of the icon shown on the button.
     *
     * Returns:
     *     string:
     *     The name of the icon shown.
     */
    get iconName(): string | null {
        return this.#iconName;
    }

    /**
     * Set the name of the icon to show on the button.
     *
     * Args:
     *     newIconName (string):
     *         The name of the icon to show.
     *
     *         This can be set to ``null`` to hide an icon.
     */
    set iconName(newIconName: string | null) {
        if (newIconName !== this.#iconName) {
            this.#iconName = newIconName;
            this.#renderInterior();
        }
    }

    /**
     * Return the label shown on the button.
     *
     * Returns:
     *     string:
     *     The label shown on the button.
     */
    get label(): string | null {
        return this.#label || null;
    }

    /**
     * Set the label to show on the button.
     *
     * Args:
     *     newLabel (string):
     *         The label to show.
     */
    set label(newLabel: string) {
        if (newLabel !== this.#label) {
            this.#label = newLabel;
            this.#renderInterior();
        }
    }

    /**
     * Return the type of the button.
     *
     * Returns:
     *     ButtonType:
     *     The current type of the button.
     */
    get type(): ButtonType {
        if (!this.rendered) {
            /*
             * This will only be returned during construction, and is needed
             * when setting the type in order to check for a change.
             */
            return null;
        }

        const el = this.el;

        /*
         * We explicitly access the button type via DOM attribute and not
         * via HTMLButtonElement.type, in order to check an explicitly-set
         * value and not the default value of "type" (which would be "submit").
         */
        if (el instanceof HTMLButtonElement) {
            const buttonType = el.getAttribute('type');

            if (buttonType === 'submit') {
                return ButtonType.SUBMIT;
            } else if (buttonType === 'reset') {
                return ButtonType.RESET;
            }
        }

        if (el.classList.contains('-is-primary')) {
            return ButtonType.PRIMARY;
        } else if (el.classList.contains('-is-danger')) {
            return ButtonType.DANGER;
        } else {
            return ButtonType.STANDARD;
        }
    }

    /**
     * Set the type of the button.
     *
     * Args:
     *     newType (ButtonType):
     *         The type of the button.
     */
    set type(newType: ButtonType) {
        if (this.type !== newType) {
            const el = this.el;
            const classList = el.classList;

            if (el instanceof HTMLButtonElement) {
                if (newType === ButtonType.SUBMIT) {
                    el.type = 'submit';
                } else if (newType === ButtonType.RESET) {
                    el.type = 'reset';
                } else {
                    el.type = 'button';
                }
            } else {
                if (newType === ButtonType.SUBMIT ||
                    newType === ButtonType.RESET) {
                    console.warn(
                        `Button type "${newType}" is not valid for ` +
                        `button links (tagName="a").`
                    );
                    newType = ButtonType.STANDARD;
                }
            }

            classList.toggle('-is-primary', newType === ButtonType.PRIMARY);
            classList.toggle('-is-danger', newType === ButtonType.DANGER);
        }
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will perform a render of the button's icon, label, and any
     * shortcuts, and set up event handlers.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const options = this.initialComponentState.options;
        const onClick = options.onClick;

        if (!(el instanceof HTMLButtonElement)) {
            el.setAttribute('role', 'button');
        }

        /*
         * Setup an event handler for button clicks.
         *
         * Note that if an onClick is not provided, this will still trigger
         * a standard DOM "click" event. If an onClick is provided, we skip
         * that entirely, and prevent any bubbling or default behavior.
         */
        el.addEventListener(
            'click',
            e => {
                const isClickable = !this.busy && !this.disabled;

                if (onClick || !isClickable) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (onClick && isClickable) {
                        onClick();
                    }
                }
            },
            {
                capture: true,
            });

        /* If there's a keyboard shortcut, register it. */
        const keyboardShortcut = this.#keyboardShortcut;
        const keyboardShortcutRegistry = this.#keyboardShortcutRegistry;

        if (keyboardShortcut) {
            this.#keyboardShortcutView = craft<KeyboardShortcutView>`
                <Ink.KeyboardShortcut
                    class="ink-c-button__keyboard-shortcut"
                    attachTo=${el}
                    keys=${keyboardShortcut}
                    onInvoke="click"
                    registry=${keyboardShortcutRegistry}/>
            `;
        }

        if (options.attrs) {
            setProps(el, options.attrs);
        }

        /*
         * Set properties from any initial options. This will update the
         * button to reflect the state.
         *
         * Any re-rendering of the interior contents will be blocked.
         */
        this.#lockRender = true;
        Object.assign(this, _.pick(
            options,
            'autofocus',
            'busy',
            'disabled',
            'href',
            'iconName',
            'label',
            'type'));
        this.#lockRender = false;

        /* We can now perform the render of the button. */
        this.#renderInterior();
    }

    /**
     * Render the interior of the button.
     *
     * This will rebuild the button based on the current state.
     */
    #renderInterior() {
        if (this.#lockRender) {
            return;
        }

        const el = this.el;
        const iconName = this.#iconName;
        const label = this.#label;
        const showKeyboardShortcut = this.#showKeyboardShortcut &&
                                     this.#keyboardShortcutView;

        el.innerHTML = '';

        if (iconName || showKeyboardShortcut) {
            renderInto(
                el,
                paint`
                    ${iconName && paint`
                        <span class="ink-c-button__icon ${iconName}"
                              aria-hidden="true"></span>
                    `}
                    ${label && paint`
                        <label class="ink-c-button__label">${label}</label>
                    `}
                    ${showKeyboardShortcut && this.#keyboardShortcutView}
                `);
        } else if (label) {
            el.append(label);
        }
    }
}
