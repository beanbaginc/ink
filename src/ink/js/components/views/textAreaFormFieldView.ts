/**
 * A component for textarea-based form fields.
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


export interface TextAreaFormFieldViewOptions
    extends BaseFormFieldViewOptions {
    /** Content to set in the text area. */
    content?: string;

    /** Attributes to set for the textarea element. */
    textAreaAttrs?: Record<string, string>;
}


@inkComponent('Ink.TextAreaFormField')
@spina
export class TextAreaFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends TextAreaFormFieldViewOptions =
        TextAreaFormFieldViewOptions,
> extends BaseFormFieldView<
    TModel,
    TOptions
> {
    textAreaEl: HTMLTextAreaElement;

    protected renderInput(): HTMLElement | HTMLElement[] | null {
        const options = this.initialComponentState.options;

        this.textAreaEl = paint<HTMLTextAreaElement>`
            <textarea id="${this.inputID}"
                      ...${options.textAreaAttrs}>
             ${options.content}
            </textarea>
        `;

        return this.textAreaEl;
    }

    protected onDisabledChanged(newDisabled: boolean) {
        if (newDisabled) {
            this.textAreaEl.setAttribute('disabled', 'disabled');
        } else {
            this.textAreaEl.removeAttribute('disabled');
        }
    }

    protected onRequiredChanged(newRequired: boolean) {
        if (newRequired) {
            this.textAreaEl.setAttribute('required', 'required');
        } else {
            this.textAreaEl.removeAttribute('required');
        }
    }
}
