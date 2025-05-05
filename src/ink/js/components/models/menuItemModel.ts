/**
 * Model for representing menu items.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';

import { KeyboardShortcutRegistry } from '../../foundation';
import { MenuItemsRadioGroup } from '../collections/menuItemsRadioGroup';


/**
 * The type of a menu item.
 *
 * Version Added:
 *     1.0
 */
export enum MenuItemType {
    /** A standard menu item. */
    ITEM = 'item',

    /** A menu item that can be toggled on or off. */
    CHECKBOX_ITEM = 'checkbox-item',

    /** A menu item that can be toggled on or off in a radio group. */
    RADIO_ITEM = 'radio-item',

    /** A separator between menu items. */
    SEPARATOR = 'separator',
}


/**
 * Model attributes for MenuItem.
 *
 * Version Added:
 *     1.0
 */
export interface MenuItemAttrs {
    /**
     * An element to use for the child.
     *
     * If specified, this takes priority over ``label``. This element will
     * be reparented into the label portion of the menu item.
     *
     * This should only be used for advanced purposes, and is generally not
     * recommended.
     */
    childEl?: HTMLElement | null;

    /**
     * The checked state for a menu item.
     *
     * This is only used if :js:attr:`type` is
     * :js:attr:`MenuItemType.CHECKBOX_ITEM` or
     * :js:attr:`MenuItemType.RADIO_ITEM`.
     */
    checked?: boolean | null;

    /**
     * The disabled state a menu item.
     *
     * Version Added:
     *     0.8
     */
    disabled?: boolean | null;

    /**
     * An icon to use for the menu item.
     */
    iconName?: string | null;

    /**
     * A DOM element ID to assign to the menu item.
     */
    id?: string | null;

    /**
     * A shortcut key to show for the menu item.
     */
    keyboardShortcut?: string | null;

    /**
     * The keyboard shortcut registry that will manage this shortcut.
     */
    keyboardShortcutRegistry?: KeyboardShortcutRegistry | null;

    /**
     * An explicit label to use for the menu item.
     */
    label?: string | null;

    /**
     * A function to call when the menu item is clicked.
     */
    onClick?: {
        (
            menuItem?: MenuItem,
            eventObject?: MouseEvent,
        ): void
    } | null;

    /**
     * A radio button group for managing radio items.
     *
     * This is only used if :js:attr:`type` is
     * :js:attr:`MenuItemType.RADIO_ITEM`.
     */
    radioGroup?: MenuItemsRadioGroup | null;

    /**
     * The type of menu item.
     *
     * This defaults to :js:data:`MenuItemType.ITEM`.
     */
    type?: MenuItemType;

    /**
     * A URL to navigate to when clicked.
     *
     * This should not be provided if :js:attr:`onClick` is provided.
     */
    url?: string | null;
}


/**
 * Information on a menu item to display in a menu.
 *
 * Menu items may take the form of a typical menu item (which performs an
 * action when clicked), a toggleable checkbox, a toggleable group of radio
 * items, or a separator.
 *
 * They always contain a label, but may optionally contain an icon and
 * keyboard shortcuts.
 *
 * All item types may include an ``onClick`` handler, for invoking an action
 * when clicked or invoked via keyboard shortcut.
 *
 * For special cases, a custom element may also be provided for the element
 * in the form of ``childEl``.
 *
 * Version Added:
 *     1.0
 */
@spina
export class MenuItem<
    TAttrs extends MenuItemAttrs = MenuItemAttrs,
> extends BaseModel<TAttrs> {
    static defaults: MenuItemAttrs = {
        checked: null,
        childEl: null,
        disabled: false,
        iconName: null,
        id: null,
        keyboardShortcut: null,
        keyboardShortcutRegistry: null,
        label: null,
        onClick: null,
        radioGroup: null,
        type: MenuItemType.ITEM,
        url: null,
    };

    /**
     * Initialize the menu item.
     *
     * This will perform validation on the attributes and set up the
     * menu item.
     *
     * Args:
     *     ...args (any[]):
     *         Arguments to pass to the parent.
     *
     * Raises:
     *     Error:
     *         There were missing or invalid attributes provided for the
     *         menu item type.
     */
    initialize(...args) {
        super.initialize(...args);

        const itemType = this.get('type');

        switch (itemType) {
            case MenuItemType.CHECKBOX_ITEM:
                /*
                 * Checkbox menu item.
                 *
                 * Ensure ``checked`` has a default boolean.
                 */
                if (this.get('checked') === null) {
                    this.set('checked', false);
                }

                break;

            case MenuItemType.RADIO_ITEM:
                /*
                 * Radio menu item.
                 *
                 * Ensure ``checked`` has a default boolean, and add to the
                 * radio group if provide.
                 */
                if (this.get('checked') === null) {
                    this.set('checked', false);
                }

                this.get('radioGroup')?.add(this);
                break;

            case MenuItemType.ITEM: /* Fall-through */
            case MenuItemType.SEPARATOR:
                break;

            default:
                throw Error(`Invalid menu item type: "${itemType}"`);
        }
    }

    /**
     * Invoke the menu item's action.
     *
     * For standard menu items, this will call any ``onClick`` callback
     * provided.
     *
     * For checkbox menu items, the :js:attr:`checked` state will be toggled.
     * An ``onClick`` callback will also be invoked, if provided.
     *
     * For radio menu items, this menu item's :js:attr:`checked`` state will
     * be set, and all others in the radio group will be unset. An ``onClick``
     * callback will also be invoked, if provided and if this item was not
     * already checked.
     *
     * Separators don't perform any kind of action.
     *
     * If the menu item is disabled, nothing will happen.
     *
     * Args:
     *     e (MouseEvent, optional):
     *         The mouse event triggering this action, if any.
     */
    invokeAction(e?: MouseEvent) {
        if (this.get('disabled')) {
            return;
        }

        switch (this.get('type')) {
            case MenuItemType.CHECKBOX_ITEM:
                /*
                 * Checkbox menu item.
                 *
                 * Toggle the checked state before performing an action.
                 */
                this.set('checked', !this.get('checked'));
                break;

            case MenuItemType.ITEM:
                /* Common case. */
                break;

            case MenuItemType.RADIO_ITEM:
                /*
                 * Radio menu item.
                 *
                 * Toggle the state of all items so only this one is
                 * checked.
                 */
                if (!this.get('checked')) {
                    this.set('checked', true);
                }

                break;

            case MenuItemType.SEPARATOR:
                /* Separators don't perform actions. */
                return;

            default:
                break;
        }

        /* Now invoke any provided onClick handler, if allowed above. */
        const onClick = this.get('onClick');

        if (onClick) {
            onClick(this, e);
        }
    }
}
