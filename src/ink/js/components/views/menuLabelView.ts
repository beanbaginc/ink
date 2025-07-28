/**
 * A component for a menu label.
 *
 * Version Added:
 *     0.5
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
} from '../../core';
import {
    type BaseMenuHandleViewOptions,
    BaseMenuHandleView,
} from './baseMenuHandleView';


/**
 * Options for MenuLabelView.
 *
 * Version Added:
 *     0.5
 */
export interface MenuLabelViewOptions extends BaseMenuHandleViewOptions {
    /**
     * Whether the menu label should be disabled.
     */
    disabled?: boolean;

    /**
     * The icon class to use for the drop-down icon.
     *
     * If empty or ``null``, the drop-down icon won't be shown.
     */
    dropDownIconName?: string;

    /**
     * The text shown on the label.
     */
    text?: string;
}


/**
 * Component for showing a label that opens a drop-down menu.
 *
 * Menu Labels contain label text, a drop-down handle icon, and an optional
 * icon. When hovering over the label or invoking it via a click or
 * Space/Enter/arrow key, a specified menu will appear.
 *
 * Version Added:
 *     0.5
 */
@inkComponent('Ink.MenuLabel')
@spina
export class MenuLabelView<
    TModel extends BaseModel = BaseModel,
    TOptions extends MenuLabelViewOptions = MenuLabelViewOptions,
> extends BaseMenuHandleView<
    TModel,
    HTMLSpanElement,
    TOptions
> {
    static tagName = 'span';
    static className = 'ink-c-menu-label';

    /**********************
     * Instance variables *
     **********************/

    /** The element managing the icon. */
    #iconEl: HTMLSpanElement | null = null;

    /** The name of the icon shown. */
    #iconName: string | null = null;

    /** The inner element containing the label and icon information. */
    #innerEl: HTMLSpanElement | null = null;

    /** The element managing the label text. */
    #textEl: HTMLSpanElement | null = null;

    /**
     * Return whether the menu label is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the button is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return this.el.getAttribute('aria-disabled') === 'true';
    }

    /**
     * Set whether the menu label is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the button should be disabled. ``false``
     *         if it should not.
     */
    set disabled(newDisabled: boolean) {
        if (newDisabled) {
            this.el.setAttribute('aria-disabled', 'true');
        } else {
            this.el.removeAttribute('aria-disabled');
        }
    }

    /**
     * Return the name of the icon shown alongside the label.
     *
     * Returns:
     *     string:
     *     The name of the icon shown.
     */
    get iconName(): string | null {
        return this.#iconName;
    }

    /**
     * Set the name of the icon to show on the dropdown handle button.
     *
     * Args:
     *     newIconName (string):
     *         The name of the icon to show.
     *
     *         This can be set to ``null`` to hide an icon.
     */
    set iconName(newIconName: string | null) {
        if (!newIconName) {
            newIconName = null;
        }

        if (newIconName === this.#iconName) {
            return;
        }

        let iconEl = this.#iconEl;

        if (iconEl === null) {
            if (newIconName) {
                iconEl = paint<HTMLSpanElement>`
                    <span class="ink-c-menu-label__icon ${newIconName}"
                          aria-hidden="true"/>
                `;
                this.#iconEl = iconEl;

                renderInto(this.#innerEl, iconEl, {prepend: true});
            }
        } else {
            if (newIconName) {
                iconEl.className = `ink-c-menu-label__icon ${newIconName}`;
            } else {
                iconEl.remove();
                this.#iconEl = null;
            }
        }

        this.#iconName = newIconName;
    }

    /**
     * Return the text shown on the label.
     *
     * Returns:
     *     string:
     *     The text shown on the label.
     */
    get text(): string | null {
        return this.#textEl.textContent || '';
    }

    /**
     * Set the text to show on the label.
     *
     * Args:
     *     newLabel (string):
     *         The text to show.
     */
    set text(newLabel: string | null) {
        this.#textEl.textContent = newLabel || '';
    }

    /**
     * Whether the menu can be opened.
     *
     * Menus can be opened if the button is not disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the menu is allowed to be opened. ``false`` if it is
     *     not.
     */
    canOpenMenu(): boolean {
        return !this.disabled;
    }

    /**
     * Handle initially rendering the label.
     *
     * This will set up the label, based on any provided options, and then
     * render the menu.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;

        el.setAttribute('role', 'menuitem');
        el.setAttribute('tabindex', '0');

        const text = options.text || '';

        const innerEl = craft<HTMLSpanElement>`
            <span class="ink-c-menu-label__inner"/>
        `;

        const textEl = craft<HTMLSpanElement>`
            <span class="ink-c-menu-label__text"/>
        `;
        innerEl.appendChild(textEl);

        const dropDownIconName = options.dropDownIconName;

        if (dropDownIconName !== null && dropDownIconName !== '') {
            const className = 'ink-c-menu-label__dropdown-icon ' +
                              (options.dropDownIconName || 'ink-i-dropdown');

            innerEl.appendChild(craft<HTMLSpanElement>`
                <span class="${className}"/>
            `);
        }

        this.#textEl = textEl;
        this.#innerEl = innerEl;

        el.appendChild(innerEl);

        /* Build the internal menu and listen for events. */
        renderInto(el, this.buildMenu({
            controllerEl: el,
            menuAriaLabel: options.menuAriaLabel || `Menu for ${text}`,
            menuClassName: 'ink-c-menu-label__menu',
            menuID: `ink-menu-label__menu__${this.cid}`,
            openOnHover: true,
        }));

        Object.assign(this, _.pick(
            options,
            'disabled',
            'iconName',
            'text'));
    }
}
