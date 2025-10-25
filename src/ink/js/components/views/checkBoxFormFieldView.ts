/**
 * A component for checkbox-based form fields.
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


export interface CheckBoxFormFieldViewOptions
    extends InputFormFieldViewOptions {
    /** Whether the checkbox is checked. */
    checked?: boolean;
}


@inkComponent('Ink.CheckBoxFormField')
@spina
export class CheckBoxFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends CheckBoxFormFieldViewOptions =
        CheckBoxFormFieldViewOptions,
> extends InputFormFieldView<
    TModel,
    TOptions
> {
    protected hasInputFirst = true;

    get checked(): boolean {
        return this.inputEl.checked;
    }

    set checked(newChecked: boolean) {
        this.inputEl.checked = newChecked;
    }

    initialize(options: TOptions) {
        super.initialize({
            ...options,
            inputAttrs: {
                ...options.inputAttrs,
                checked: options.checked,
            },
            inputType: 'checkbox',
        });
    }
}
