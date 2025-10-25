/**
 * A component for text-based form fields.
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


export interface TextFormFieldViewOptions extends InputFormFieldViewOptions {
    /* The placeholder text to use. */
    placeholder?: string;

    /** The current value of the field. */
    value?: string;
}


@inkComponent('Ink.TextFormField')
@spina
export class TextFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends TextFormFieldViewOptions = TextFormFieldViewOptions,
> extends InputFormFieldView<
    TModel,
    TOptions
> {
    initialize(options: TOptions) {
        super.initialize({
            ...options,
            inputAttrs: {
                ...options.inputAttrs,
                placeholder: options.placeholder || '',
                value: options.value || '',
            },
            inputType: 'text',
        });
    }
}
