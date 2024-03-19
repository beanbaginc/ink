/**
 * A collection for a group of radio menu items
 *
 * Version Added:
 *     1.0
 */

import {
    BaseCollection,
    Class,
    spina,
} from '@beanbag/spina';

import { MenuItem } from '../models/menuItemModel';
import { MenuItemsCollection } from './menuItemsCollection';


/**
 * A collection for a group of radio menu items
 *
 * This will track one or more radio menu items that belong to the same
 * toggle group. It will track the currently-checked item and ensure that
 * at most only one menu item is ever checked at a time.
 *
 * Version Added:
 *     1.0
 */
@spina
export class MenuItemsRadioGroup<
    TMenuItem extends MenuItem = MenuItem,
> extends MenuItemsCollection<TMenuItem> {
    /**********************
     * Instance variables *
     **********************/

    /**
     * The currently-checked menu item.
     *
     * This will be ``null`` if no item is checked.
     */
    checkedMenuItem: TMenuItem | null = null;

    /**
     * Initialize the radio group.
     *
     * This will begin listening to changes to any menu items included in the
     * group, and will set up the state for any menu items provided during
     * construction.
     *
     * Args:
     *     models (TMenuItem[]):
     *         The menu items added during construction.
     *
     *     ...args (any[]):
     *         Additional arguments passed during initialization.
     */
    initialize(
        models: TMenuItem[],
        ...args: any[]
    ) {
        super.initialize(models, ...args);

        this.on('add', this.#onAdd);
        this.on('remove', this.#onRemove);
        this.on('reset', this.#onReset);
        this.on('change:checked', this.#onItemCheckedChanged)

        if (models) {
            models.forEach(this.#onAdd.bind(this));
        }
    }

    /**
     * Handle a change to the checked attribute for a menu item.
     *
     * If the menu item is now checked, then this will uncheck the
     * previously-checked menu item (if any). This item will then be set
     * as the currently-checked item.
     *
     * If the menu item is now unchecked, this will ensure that the checked
     * value is a proper boolean and unset this item as the currently-checked
     * item.
     *
     * Args:
     *     menuItem (TMenuItem):
     *         The menu item that was updated.
     */
    #onItemCheckedChanged(menuItem: TMenuItem) {
        const checked = menuItem.get('checked');

        if (checked) {
            if (this.checkedMenuItem !== null &&
                this.checkedMenuItem !== menuItem) {
                /* Clear the checked states of the previously-checked item. */
                this.checkedMenuItem.set('checked', false);
            }

            this.checkedMenuItem = menuItem;
        } else {
            if (checked !== false) {
                /* Normalize the checked state, but don't trigger an event. */
                menuItem.set('checked', false, {
                    silent: true,
                });
            }

            if (this.checkedMenuItem === menuItem) {
                this.checkedMenuItem = null;
            }
        }
    }

    /**
     * Process new menu items in the radio group.
     *
     * This will ensure that the menu item is set to belong to this radio
     * group and update the group's checked state if it's checked.
     *
     * Args:
     *     menuItem (TMenuItem):
     *         The menu item that was added.
     */
    #onAdd(menuItem: TMenuItem) {
        if (menuItem.get('radioGroup') !== this) {
            menuItem.set('radioGroup', this);
        }

        this.#onItemCheckedChanged(menuItem);
    }

    /**
     * Handle removing a  menu item from the radio group.
     *
     * This will unset the radio group on the item and, if this item was
     * checked, clear the radio group's checked item state.
     *
     * Args:
     *     menuItem (TMenuItem):
     *         The menu item that was removed.
     */
    #onRemove(menuItem: TMenuItem) {
        menuItem.set('radioGroup', null);

        if (menuItem === this.checkedMenuItem) {
            this.checkedMenuItem = null;
        }
    }

    /**
     * Handle resetting items in the radio group.
     *
     * This will clean up state on all removed items, and set up new state on
     * all remaining or newly-added items.
     *
     * Args:
     *     collection (MenuItemsRadioGroup):
     *         This radio group instance.
     *
     *     options (object):
     *         The options passed to the handler. This will contain the list
     *         of previous models.
     */
    #onReset(
        collection: this,
        options: {
            previousModels: TMenuItem[],
        },
    ) {
        options.previousModels.forEach(this.#onRemove.bind(this));

        /* onAdd() won't be called above, since reset() will add silently. */
        this.forEach(this.#onAdd.bind(this));
    }
}
