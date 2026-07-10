/**
 * A component for a text input field.
 *
 * Version Added:
 *     0.10
 */

import {
    type BaseModel,
    spina,
} from '@beanbag/spina';
import _ from 'underscore';

import {
    inkComponent,
    paint,
    renderInto,
    setProps,
} from '../../core';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';


/**
 * The type of input shown in a text field.
 *
 * These are the text-like input types supported by the component. Other
 * input types (such as ``checkbox`` or ``file``) have their own native
 * chrome, and won't render correctly within a text field.
 *
 * Version Added:
 *     0.10
 */
export type TextFieldType = (
    'email' |
    'password' |
    'search' |
    'tel' |
    'text' |
    'url'
);


/**
 * Options for TextFieldView.
 *
 * Version Added:
 *     0.10
 */
export interface TextFieldViewOptions extends BaseComponentViewOptions {
    /**
     * An ARIA label describing the purpose of the field.
     *
     * This should be provided when there's no visible label for the field.
     * Placeholder text is not a substitute, as it's not consistently
     * announced and disappears once the user starts typing.
     */
    ariaLabel?: string;

    /**
     * The ID of an element that labels this field.
     *
     * If provided, this takes precedence over ``ariaLabel``.
     */
    ariaLabelledBy?: string;

    /**
     * Arbitrary attributes to set on the input element.
     *
     * This should not be used for anything covered by a dedicated option
     * (``disabled``, ``name``, ``placeholder``, ``type``, or ``value``).
     * Those options also manage state on the wrapping element, which
     * setting the attribute directly would bypass.
     */
    attrs?: Partial<HTMLInputElement>;

    /**
     * Whether the field should have focus set automatically.
     *
     * This only takes effect when the field is rendered as part of the
     * initial page load. Fields crafted after that must call
     * :js:func:`TextFieldView.focus` instead.
     */
    autofocus?: boolean;

    /**
     * Whether the field should be disabled.
     */
    disabled?: boolean;

    /**
     * Optional name of an icon to display in front of the input.
     *
     * This is useful for search boxes, using ``ink-i-search``.
     */
    iconName?: string;

    /**
     * The form field name for the input.
     */
    name?: string;

    /**
     * Placeholder text to show when the field is empty.
     */
    placeholder?: string;

    /**
     * The type of the input.
     *
     * This defaults to ``text``.
     */
    type?: TextFieldType;

    /**
     * The initial value of the field.
     *
     * This also becomes the field's default value, which is what the field
     * will be restored to when resetting a containing form.
     */
    value?: string;
}


/**
 * Component for showing a text input field.
 *
 * This provides a standard, themed text input, with an optional leading
 * icon (useful for search boxes). The field chrome is drawn by the
 * component's element, wrapping a native ``<input>``
 * (:js:attr:`inputEl`), so consumers can listen to standard DOM events
 * (such as ``input`` and ``change``).
 *
 * Field state can be modified at runtime.
 *
 * Version Added:
 *     0.10
 */
@inkComponent('Ink.TextField')
@spina
export class TextFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends TextFieldViewOptions = TextFieldViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLSpanElement,
    TOptions
> {
    static tagName = 'span';
    static className = 'ink-c-text-field';

    /**********************
     * Instance variables *
     **********************/

    /** The inner input element for the field. */
    inputEl: HTMLInputElement = null;

    /**
     * Return whether the field is set to have focus automatically.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the field is set to auto-focus. ``false`` if it is not.
     */
    get autofocus(): boolean {
        return this.inputEl.autofocus;
    }

    /**
     * Set whether the field is set to have focus automatically.
     *
     * This only takes effect during initial page load. To focus a field
     * after that, call :js:func:`TextFieldView.focus`.
     *
     * Args:
     *     newAutoFocus (boolean):
     *         ``true`` if the field should be set to auto-focus. ``false``
     *         if it should not.
     */
    set autofocus(newAutoFocus: boolean) {
        this.inputEl.autofocus = newAutoFocus;
    }

    /**
     * Return whether the field is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the field is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return this.inputEl.disabled;
    }

    /**
     * Set whether the field is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the field should be disabled. ``false`` if it
     *         should not.
     */
    set disabled(newDisabled: boolean) {
        this.inputEl.disabled = newDisabled;
        this.el.classList.toggle('-is-disabled', newDisabled);
    }

    /**
     * Return the placeholder text shown when the field is empty.
     *
     * Returns:
     *     string:
     *     The placeholder text, or ``null`` if not set.
     */
    get placeholder(): string | null {
        return this.inputEl.getAttribute('placeholder') || null;
    }

    /**
     * Set the placeholder text to show when the field is empty.
     *
     * Args:
     *     newPlaceholder (string):
     *         The placeholder text.
     *
     *         This can be set to ``null`` to remove the placeholder.
     */
    set placeholder(newPlaceholder: string | null) {
        if (newPlaceholder) {
            this.inputEl.setAttribute('placeholder', newPlaceholder);
        } else {
            this.inputEl.removeAttribute('placeholder');
        }
    }

    /**
     * Return the current value of the field.
     *
     * Returns:
     *     string:
     *     The current value.
     */
    get value(): string {
        return this.inputEl.value;
    }

    /**
     * Set the current value of the field.
     *
     * This does not change the field's default value, so resetting a
     * containing form will discard this.
     *
     * Args:
     *     newValue (string):
     *         The new value.
     */
    set value(newValue: string) {
        this.inputEl.value = newValue;
    }

    /**
     * Focus the field's input.
     */
    focus() {
        this.inputEl.focus();
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will set up the field's icon and input based on any provided
     * options.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const options = this.initialComponentState.options;
        const iconName = options.iconName;

        const inputEl = paint<HTMLInputElement>`
            <input class="ink-c-text-field__input"
                   type="${options.type || 'text'}"/>
        `;
        this.inputEl = inputEl;

        if (options.ariaLabelledBy) {
            inputEl.setAttribute('aria-labelledby', options.ariaLabelledBy);
        } else if (options.ariaLabel) {
            inputEl.setAttribute('aria-label', options.ariaLabel);
        }

        if (options.name) {
            inputEl.name = options.name;
        }

        /*
         * Set the value as an attribute, and not just as a property. This
         * makes it the field's default value, so that resetting a containing
         * form restores it instead of blanking the field.
         */
        if (options.value) {
            inputEl.setAttribute('value', options.value);
        }

        if (options.attrs) {
            setProps(inputEl, options.attrs);
        }

        renderInto(el, paint`
            ${iconName && paint`
                <span class="ink-c-text-field__icon ${iconName}"
                      aria-hidden="true"></span>
            `}
            ${inputEl}
        `);

        /*
         * The field's chrome is drawn by the component's element, so clicking
         * anywhere on it (the padding or the icon) should focus the input,
         * the same as clicking a native field.
         */
        el.addEventListener('mousedown', (e: MouseEvent) => {
            if (e.target !== inputEl && !this.disabled) {
                e.preventDefault();
                inputEl.focus();
            }
        });

        /*
         * Set properties from any initial options. This will update the
         * field to reflect the state.
         */
        Object.assign(this, _.pick(
            options,
            'autofocus',
            'disabled',
            'placeholder',
            'value'));
    }
}
