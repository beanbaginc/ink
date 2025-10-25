/**
 * A component for color-based form fields.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';

import {
    inkComponent,
} from '../../core';

import {
    InputFormFieldViewOptions,
    InputFormFieldView,
} from './inputFormFieldView';


/**
 * Options for the color form field.
 *
 * Version Added:
 *     1.0
 */
export interface ColorFormFieldViewOptions extends InputFormFieldViewOptions {
    /**
     * The hex-based RGB color code to use as the value.
     *
     * This must be in the form of ``#RRGGBB``.
     */
    color?: string;
}


/**
 * A component for showing a color selection form field.
 *
 * Version Added:
 *     1.0
 */
@inkComponent('Ink.ColorFormField')
@spina
export class ColorFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends ColorFormFieldViewOptions = ColorFormFieldViewOptions,
> extends InputFormFieldView<
    TModel,
    TOptions
> {
    get color(): string | null {
        return this.rawValue;
    }

    set color(newColor: string | null) {
        this.rawValue = newColor;
    }

    /**
     * Initialize the form field.
     *
     * Args:
     *     options (ColorFormFieldViewOptions, optional):
     *         Options for the field.
     */
    initialize(options?: TOptions) {
        super.initialize({
            ...options,
            inputAttrs: {
                ...options.inputAttrs,
                value: options?.color,
            },
            inputType: 'color',
        });
    }
}
