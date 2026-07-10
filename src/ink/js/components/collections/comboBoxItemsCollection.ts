/**
 * A collection of combo box items.
 *
 * Version Added:
 *     0.10
 */

import {
    type Class,
    BaseCollection,
    spina,
} from '@beanbag/spina';

import { ComboBoxItem } from '../models/comboBoxItemModel';


/**
 * A collection of combo box items.
 *
 * This can hold and track any number of combo box items. It's used both
 * for the items suggested by a combo box and for the items selected in it.
 *
 * Version Added:
 *     0.10
 */
@spina
export class ComboBoxItemsCollection<
    TComboBoxItem extends ComboBoxItem = ComboBoxItem,
> extends BaseCollection<TComboBoxItem> {
    static model: Class<ComboBoxItem> = ComboBoxItem;
}
