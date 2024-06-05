/**
 * A component for a menu button.
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
} from '../../core';
import {
    type ButtonType,
    type ButtonView,
} from './buttonView';
import {
    type BaseMenuHandleViewOptions,
    BaseMenuHandleView,
} from './baseMenuHandleView';


/**
 * Options for MenuButtonView.
 *
 * Version Added:
 *     1.0
 */
export interface MenuButtonViewOptions extends BaseMenuHandleViewOptions {
    /**
     * Whether the menu button should show a busy state.
     */
    busy?: boolean;

    /**
     * Whether the menu button should be disabled.
     */
    disabled?: boolean;

    /**
     * Whether there should be an action button.
     *
     * If true, there will be an additional button separate from the
     * drop-down button.
     */
    hasActionButton?: boolean;

    /**
     * The label shown on the button.
     */
    label?: string;

    /**
     * The icon class to use for the drop-down icon.
     */
    menuIconName?: string;

    /**
     * An ARIA label to apply to the dropdown handle button.
     */
    dropdownButtonAriaLabel?: string;

    /**
     * The handler for click events on the action button.
     *
     * This won't do anything if ``hasActionButton`` isn't ``true``.
     */
    onActionButtonClick?: () => void;

    /**
     * The type of buttons.
     *
     * This defaults to :js:attr:`ButtonType.STANDARD`.
     */
    type?: ButtonType;
}


/**
 * Component for showing a button that opens a drop-down menu.
 *
 * Menu Buttons contain a label and a drop-down handle. When hovering over
 * the button or invoking it via a click or Space/Enter/arrow key, a specified
 * menu will appear.
 *
 * A Menu Button may contain a separate action button, which is distinct from
 * the drop-down menu handle button. This allows for a primary action that is
 * separate from a menu of actions or options.
 *
 * Just like a Button, a Menu Button may have a type, which communicates its
 * intent via a color hint.
 *
 * Version Added:
 *     1.0
 */
@inkComponent('Ink.MenuButton')
@spina
export class MenuButtonView<
    TModel extends BaseModel = BaseModel,
    TOptions extends MenuButtonViewOptions = MenuButtonViewOptions,
> extends BaseMenuHandleView<
    TModel,
    HTMLDivElement,
    TOptions
> {
    static className = 'ink-c-menu-button';

    /**********************
     * Instance variables *
     **********************/

    /** The action button, if one is configured. */
    actionButtonView: ButtonView | null = null;

    /** The action button, if one is configured. */
    actionButtonEl: HTMLButtonElement | null = null;

    /** The drop-down button. */
    dropdownButtonView: ButtonView | null = null;

    /**
     * Return whether the menu button is in a busy state.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the menu button is in a busy state. ``false`` if it
     *     is not.
     */
    get busy(): boolean {
        return this.el.getAttribute('aria-busy') === 'true';
    }

    /**
     * Set whether the menu button is in a busy state.
     *
     * Args:
     *     newBusy (boolean):
     *         ``true`` if the menu button should be in a busy state. ``false``
     *         if it should not.
     */
    set busy(newBusy: boolean) {
        if (newBusy) {
            this.el.setAttribute('aria-busy', 'true');
        } else {
            this.el.removeAttribute('aria-busy');
        }

        if (this.actionButtonView !== null) {
            this.actionButtonView.busy = newBusy;

            if (!this.disabled) {
                this.dropdownButtonView.disabled = newBusy;
            }
        } else {
            this.dropdownButtonView.busy = newBusy;
        }
    }

    /**
     * Return whether the menu button is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the button is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return (this.actionButtonView || this.dropdownButtonView).disabled;
    }

    /**
     * Set whether the menu button is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the button should be disabled. ``false``
     *         if it should not.
     */
    set disabled(newDisabled: boolean) {
        this.dropdownButtonView.disabled = newDisabled;

        if (this.actionButtonView !== null) {
            this.actionButtonView.disabled = newDisabled;
        }
    }

    /**
     * Return the name of the icon shown on the dropdown handle button.
     *
     * Returns:
     *     string:
     *     The name of the icon shown.
     */
    get iconName(): string | null {
        return this.dropdownButtonView.iconName;
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
        this.dropdownButtonView.iconName = newIconName;
    }

    /**
     * Return the label shown on the button.
     *
     * Returns:
     *     string:
     *     The label shown on the button.
     */
    get label(): string | null {
        return (this.actionButtonView || this.dropdownButtonView).label;
    }

    /**
     * Set the label to show on the button.
     *
     * Args:
     *     newLabel (string):
     *         The label to show.
     */
    set label(newLabel: string | null) {
        (this.actionButtonView || this.dropdownButtonView).label = newLabel;
    }

    /**
     * Return the type of the menu button.
     *
     * Returns:
     *     ButtonType:
     *     The current type of the menu button.
     */
    get type(): ButtonType {
        return this.dropdownButtonView.type;
    }

    /**
     * Set the type of the button.
     *
     * Args:
     *     newType (ButtonType):
     *         The type of the button.
     */
    set type(newType: ButtonType) {
        this.dropdownButtonView.type = newType;

        if (this.actionButtonView !== null) {
            this.actionButtonView.type = newType;
        }
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
     * Handle initially rendering the button.
     *
     * This will set up the button, based on any provided options, and
     * then render the menu.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;

        el.setAttribute('role', 'group');

        const buttonLabel = options.label || '';
        const cid = this.cid;

        /*
         * Build the internal buttons.
         *
         * If there's an action button, we'll build that and put it and
         * the dropdown handle button into a group.
         *
         * If there's no action button, we'll just use the handle button
         * as the only button, and place the label there.
         */
        const dropdownButtonProps: Record<string, unknown> = {
            'aria-label': options.dropdownButtonAriaLabel || 'Open menu',
            'class': 'ink-c-menu-button__dropdown-button',
            'iconName': options.menuIconName || 'ink-i-dropdown',
            'id': `ink-menu-button__dropdown__${cid}`,
        };

        const dropdownButton = craft<ButtonView>`
            <Ink.Button ...${dropdownButtonProps}/>
        `;

        if (options.hasActionButton) {
            const actionButton = craft<ButtonView>`
                <Ink.Button class="ink-c-menu-button__action-button"
                            onClick=${options.onActionButtonClick}>
                 ${buttonLabel}
                </Ink.Button>
            `;
            this.actionButtonView = actionButton;

            renderInto(el, paint`
                <Ink.ButtonGroup class="ink-c-menu-button__buttons">
                 ${actionButton}
                 ${dropdownButton}
                </Ink.ButtonGroup>
            `);
        } else {
            dropdownButton.label = buttonLabel;

            renderInto(el, dropdownButton);
        }

        this.dropdownButtonView = dropdownButton;

        /* Build the internal menu and listen for events. */
        renderInto(el, this.buildMenu({
            controllerEl: dropdownButton.el,
            menuAriaLabel: options.menuAriaLabel || `Menu for ${buttonLabel}`,
            menuClassName: 'ink-c-menu-button__menu',
            menuID: `ink-menu-button__menu__${cid}`,
            openOnHover: true,
        }));

        Object.assign(this, _.pick(
            options,
            'busy',
            'disabled',
            'label',
            'type'));
    }

    /**
     * Handle removing the element.
     *
     * This will explicitly remove the menu as well.
     */
    protected onRemove() {
        this.dropdownButtonView.remove();

        super.onRemove();
    }
}
