/**
 * A component for input-based form fields.
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
    paint,
} from '../../core';

import {
    BaseFormFieldViewOptions,
    BaseFormFieldView,
} from './baseFormFieldView';


export interface InputFormFieldViewOptions extends BaseFormFieldViewOptions {
    /** Attributes to set for the input element. */
    inputAttrs?: Record<string, string>;

    /**
     * The type of ``<input>`` element.
     *
     * This defaults to "text".
     */
    inputType?: string;
}


@inkComponent('Ink.InputFormField')
@spina
export class InputFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends InputFormFieldViewOptions = InputFormFieldViewOptions,
> extends BaseFormFieldView<
    TModel,
    TOptions
> {
    inputEl: HTMLInputElement;

    get rawValue(): string | null {
        return this.inputEl.value;
    }

    set rawValue(newValue: string | null) {
        this.inputEl.value = newValue;
    }

    protected renderInput(): HTMLElement | HTMLElement[] | null {
        const options = this.initialComponentState.options;

        this.inputEl = paint<HTMLInputElement>`
            <input type="${options.inputType || 'text'}"
                   id="${this.inputID}"
                   ...${options.inputAttrs}/>
        `;

        return this.inputEl;
    }

    protected onDisabledChanged(newDisabled: boolean) {
        if (newDisabled) {
            this.inputEl.setAttribute('disabled', 'disabled');
        } else {
            this.inputEl.removeAttribute('disabled');
        }
    }

    protected onRequiredChanged(newRequired: boolean) {
        if (newRequired) {
            this.inputEl.setAttribute('required', 'required');
        } else {
            this.inputEl.removeAttribute('required');
        }
    }
}
