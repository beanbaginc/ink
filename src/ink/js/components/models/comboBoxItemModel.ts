/**
 * Model for representing combo box items.
 *
 * Version Added:
 *     0.10
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';


/**
 * Model attributes for ComboBoxItem.
 *
 * Version Added:
 *     0.10
 */
export interface ComboBoxItemAttrs {
    /**
     * Opaque data associated with the item.
     *
     * This is not used by the combo box itself. Consumers can use it to
     * associate any payload (such as an API result) with an item.
     */
    data?: unknown;

    /**
     * An optional description shown alongside the label.
     */
    description?: string | null;

    /**
     * Whether the item is disabled.
     *
     * Disabled items are shown but can't be selected.
     */
    disabled?: boolean;

    /**
     * The unique ID for the item.
     *
     * This is used as the item's value when serializing selections.
     */
    id?: number | string | null;

    /**
     * The label shown for the item.
     */
    label?: string | null;
}


/**
 * An item that can be suggested or selected in a combo box.
 *
 * Items always contain a label, and may optionally contain a description
 * and an opaque data payload from the consumer.
 *
 * Version Added:
 *     0.10
 */
@spina
export class ComboBoxItem<
    TAttrs extends ComboBoxItemAttrs = ComboBoxItemAttrs,
> extends BaseModel<TAttrs> {
    static defaults: ComboBoxItemAttrs = {
        data: null,
        description: null,
        disabled: false,
        id: null,
        label: null,
    };
}
