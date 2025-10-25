/**
 * Base class for a component for a form field.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';
import _ from 'underscore';

import { paint } from '../../core';
import {
    BaseComponentView,
    BaseComponentViewOptions,
} from './baseComponentView';


export interface BaseFormFieldViewOptions extends BaseComponentViewOptions {
    label: string;

    errors?: string[];
    helpHTML?: string;

    disabled?: boolean;
    required?: boolean;
}


@spina
export class BaseFormFieldView<
    TModel extends BaseModel = BaseModel,
    TOptions extends BaseFormFieldViewOptions = BaseFormFieldViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLDivElement,
    TOptions
> {
    static className = 'ink-c-form-field';

    /**********************
     * Instance variables *
     **********************/

    inputID: string = null;

    protected hasInputFirst = false;

    protected errorsEl: HTMLDivElement = null;
    protected helpEl: HTMLDivElement = null;
    protected inputContainerEl: HTMLDivElement = null;
    protected labelEl: HTMLLabelElement = null;

    #errors: string[] | null = null;

    get disabled(): boolean {
        return this.el.getAttribute('aria-disabled') === 'true';
    }

    set disabled(newDisabled: boolean) {
        if (newDisabled) {
            this.el.setAttribute('aria-disabled', 'true');
        } else {
            this.el.removeAttribute('aria-disabled');
        }

        this.onDisabledChanged(newDisabled);
    }

    get errors(): string[] | null {
        return this.#errors;
    }

    set errors(newErrors: string[] | null) {
        const el = this.el;
        let errorsEl: HTMLDivElement = this.errorsEl;

        /* Build a new errors child, if there are errors to report. */
        if (newErrors && newErrors.length > 0) {
            if (errorsEl === null) {
                const errorID = this.makePartID('errors');

                errorsEl = paint`
                    <div class="ink-c-form-field__errors" id="${errorID}"/>
                `;

                /*
                 * This will append to the end of there's no help text element.
                 * */
                el.insertBefore(errorsEl, this.helpEl);
                this.errorsEl = errorsEl;

                el.setAttribute('aria-errormessage', errorID);
                el.setAttribute('aria-invalid', 'true');
            } else {
                /* Clear any existing errors. */
                errorsEl.innerHTML = '';
            }

            if (newErrors.length === 1) {
                errorsEl.append(newErrors[0]);
            } else {
                errorsEl.append(paint<HTMLUListElement>`
                    <ul>
                     ${newErrors.map(error => paint`<li>${error}</li>`)}
                    </ul>
                `);
            }
        } else {
            /* Remove any existing state. */
            el.removeAttribute('aria-errormessage');
            el.removeAttribute('aria-invalid');
            errorsEl?.remove();
            this.errorsEl = null;
        }

        this.#errors = newErrors;
    }

    get helpHTML(): string | null {
        return this.helpEl?.innerHTML || null;
    }

    set helpHTML(newHTML: string | null) {
        let helpEl = this.helpEl;

        if (newHTML) {
            if (helpEl === null) {
                helpEl = paint<HTMLDivElement>`
                    <div class="ink-c-form-field__help"/>
                `;
                this.el.appendChild(helpEl);
            }

            helpEl.innerHTML = newHTML;
        } else {
            helpEl?.remove();
            this.helpEl = null;
        }
    }

    get label(): string {
        return this.labelEl.textContent;
    }

    set label(newLabel: string) {
        this.labelEl.textContent = newLabel;
    }

    get required(): boolean {
        return this.el.getAttribute('aria-required') === 'true';
    }

    set required(newRequired: boolean) {
        if (newRequired) {
            this.el.setAttribute('aria-required', 'true');
        } else {
            this.el.removeAttribute('aria-required');
        }

        this.onRequiredChanged(newRequired);
    }

    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;

        const inputID = this.makePartID('input');
        this.inputID = inputID;

        const labelEl = paint<HTMLLabelElement>`
            <label class="ink-c-form-field__label"
                   for="${inputID}"></label>
        `;
        let inputContainerEl: HTMLDivElement;


        if (this.hasInputFirst) {
            el.classList.add('-has-input-first');

            /*
             * This intentionally does not have the ink-c-form-field__label
             * class, because for layout purposes it needs to always be
             * attached to the input.
             */
            inputContainerEl = paint<HTMLDivElement>`
                <div class="ink-c-form-field__input">
                 ${this.renderInput()}
                 ${labelEl}
                </div>
            `;

            el.append(inputContainerEl);
        } else {
            inputContainerEl = paint<HTMLDivElement>`
                <div class="ink-c-form-field__input">
                 ${this.renderInput()}
                </div>
            `;

            el.append(labelEl, inputContainerEl);
        }

        this.inputContainerEl = inputContainerEl;
        this.labelEl = labelEl;

        Object.assign(this, _.pick(
            options,
            'disabled',
            'required',
            'errors',
            'helpHTML',
            'label',
        ));
    }

    protected renderInput(): HTMLElement | HTMLElement[] | null {
        return null;
    }

    protected makePartID(partName: string): string {
        const baseID = this.id || `ink-c-form-field__${this.cid}`;

        return `${baseID}__${partName}`;
    }

    protected onDisabledChanged(newDisabled: boolean) {
        /* Left for subclasses to override functionality. */
    }

    protected onRequiredChanged(newRequired: boolean) {
        /* Left for subclasses to override functionality. */
    }
}
