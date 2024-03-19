/**
 * A collection of menu items.
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


/**
 * A collection of menu items.
 *
 * This can hold and track any number of menu items.
 *
 * Version Added:
 *     1.0
 */
@spina
export class MenuItemsCollection<
    TMenuItem extends MenuItem = MenuItem,
> extends BaseCollection<TMenuItem> {
    static model: Class<MenuItem> = MenuItem;
}
