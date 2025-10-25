/**
 * A component for radio-button form fields.
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


export interface RadioFormFieldViewOptions extends BaseFormFieldViewOptions {
    choices: Record<string, string>;
}


@inkComponent('Ink.RadioFormField')
@spina
export class RadioFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends RadioFormFieldViewOptions = RadioFormFieldViewOptions,
> extends BaseFormFieldView<
    TModel,
    TOptions
> {
    inputEls: HTMLInputElement[];

    get rawValue(): string | null {
        for (const inputEl of this.inputEls) {
            if (inputEl.checked) {
                return inputEl.value;
            }
        }

        return null;
    }

    set rawValue(newValue: string | null) {
        for (const inputEl of this.inputEls) {
            inputEl.checked = (inputEl.value === newValue);
        }
    }

    protected renderInput(): HTMLElement | HTMLElement[] | null {
        const options = this.initialComponentState.options;
        const inputID = this.inputID;

        const divEls = [];
        const inputEls = [];
        let i = 0;

        for (const [value, label] of Object.entries(options.choices)) {
            const inputEl = paint`
                <input type="radio"
                       id="${inputID}-${i}"
                       name="${inputID}"
                       value="${value}"
                       />
            `;

            inputEls.push(inputEl);
            divEls.push(paint`
                <div>
                 ${inputEl}
                 <label for="${inputID}-${i}">${label}</label>
                </div>
            `);

            i++;
        }

        // FIXME: for some reason, the for= attribute on the label tag is
        // getting lost.

        this.inputEls = inputEls;

        return divEls;
    }

    protected onDisabledChanged(newDisabled: boolean) {
        for (const inputEl of this.inputEls) {
            if (newDisabled) {
                inputEl.setAttribute('disabled', 'disabled');
            } else {
                inputEl.removeAttribute('disabled');
            }
        }
    }

    protected onRequiredChanged(newRequired: boolean) {
        for (const inputEl of this.inputEls) {
            if (newRequired) {
                inputEl.setAttribute('required', 'required');
            } else {
                inputEl.removeAttribute('required');
            }
        }
    }
}
