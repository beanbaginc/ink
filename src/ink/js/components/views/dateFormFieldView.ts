/**
 * A component for date form fields.
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


export interface DateFormFieldViewOptions extends InputFormFieldViewOptions {
    /* The placeholder text to use. */
    placeholder?: string;

    /**
     * The current value of the field.
     *
     * This must be in the form of 'yyyy-mm-dd'.
     */
    value?: string;

    /**
     * The earliest date that may be selected.
     *
     * This must be in the form of 'yyyy-mm-dd'.
     */
    min?: string;

    /**
     * The latest date that may be selected.
     *
     * This must be in the form of 'yyyy-mm-dd'.
     */
    max?: string;
}


@inkComponent('Ink.DateFormField')
@spina
export class DateFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends DateFormFieldViewOptions = DateFormFieldViewOptions,
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
            inputType: 'date',
        });
    }
}
