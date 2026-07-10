/**
 * Unit tests for TextFieldView.
 *
 * Version Added:
 *     0.10
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    TextFieldView,
    craft,
    paint,
} from '../../../index';


suite('components/views/TextFieldView', () => {
    describe('Render', () => {
        it('Default', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text">' +
                '</span>'
            );
        });

        it('With iconName', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField iconName="ink-i-search"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<span class="ink-c-text-field__icon ink-i-search"' +
                ' aria-hidden="true"></span>' +
                '<input class="ink-c-text-field__input" type="text">' +
                '</span>'
            );
        });

        it('With iconName and type', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField iconName="ink-i-search" type="search"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<span class="ink-c-text-field__icon ink-i-search"' +
                ' aria-hidden="true"></span>' +
                '<input class="ink-c-text-field__input" type="search">' +
                '</span>'
            );
        });

        it('With type', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField type="search"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="search">' +
                '</span>'
            );
        });

        it('With ariaLabel', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField ariaLabel="Search reviews"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' aria-label="Search reviews">' +
                '</span>'
            );
        });

        it('With ariaLabelledBy', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField ariaLabelledBy="my-label"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' aria-labelledby="my-label">' +
                '</span>'
            );
        });

        it('With ariaLabelledBy and ariaLabel', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField ariaLabel="Search reviews"
                               ariaLabelledBy="my-label"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' aria-labelledby="my-label">' +
                '</span>'
            );
        });

        it('With name', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField name="my-field"/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' name="my-field">' +
                '</span>'
            );
        });

        it('With placeholder', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField placeholder="Type here..."/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' placeholder="Type here...">' +
                '</span>'
            );
        });

        it('With value', () => {
            const textField = craft<TextFieldView>`
                <Ink.TextField value="My value"/>
            `;

            expect(textField.el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' value="My value">' +
                '</span>'
            );
            expect(textField.inputEl.value).toBe('My value');
            expect(textField.inputEl.defaultValue).toBe('My value');

            textField.remove();
        });

        it('With disabled', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField disabled/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field -is-disabled">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' disabled="">' +
                '</span>'
            );
        });

        it('With attrs', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.TextField attrs=${{
                    maxLength: 10,
                }}/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-text-field">' +
                '<input class="ink-c-text-field__input" type="text"' +
                ' maxlength="10">' +
                '</span>'
            );
        });
    });

    describe('Properties', () => {
        let textField: TextFieldView;

        beforeEach(() => {
            textField = craft<TextFieldView>`
                <Ink.TextField/>
            `;
        });

        afterEach(() => {
            textField.remove();
            textField = null;
        });

        describe('autofocus', () => {
            it('Set to true', () => {
                textField.autofocus = true;

                expect(textField.autofocus).toBeTrue();
                expect(textField.inputEl.autofocus).toBeTrue();
            });

            it('Set to false', () => {
                textField.autofocus = true;
                textField.autofocus = false;

                expect(textField.autofocus).toBeFalse();
                expect(textField.inputEl.autofocus).toBeFalse();
            });
        });

        describe('disabled', () => {
            it('Set to true', () => {
                textField.disabled = true;

                expect(textField.disabled).toBeTrue();
                expect(textField.inputEl.disabled).toBeTrue();
                expect(textField.el.classList.contains('-is-disabled'))
                    .toBeTrue();
            });

            it('Set to false', () => {
                textField.disabled = true;
                textField.disabled = false;

                expect(textField.disabled).toBeFalse();
                expect(textField.inputEl.disabled).toBeFalse();
                expect(textField.el.classList.contains('-is-disabled'))
                    .toBeFalse();
            });
        });

        describe('placeholder', () => {
            it('Set to text', () => {
                textField.placeholder = 'My placeholder';

                expect(textField.placeholder).toBe('My placeholder');
                expect(textField.inputEl.getAttribute('placeholder'))
                    .toBe('My placeholder');
            });

            it('Set to null', () => {
                textField.placeholder = 'My placeholder';
                textField.placeholder = null;

                expect(textField.placeholder).toBeNull();
                expect(textField.inputEl.hasAttribute('placeholder'))
                    .toBeFalse();
            });
        });

        describe('value', () => {
            it('Set', () => {
                textField.value = 'New value';

                expect(textField.value).toBe('New value');
                expect(textField.inputEl.value).toBe('New value');
            });
        });
    });

    describe('Methods', () => {
        it('focus', () => {
            const textField = craft<TextFieldView>`
                <Ink.TextField/>
            `;
            document.body.appendChild(textField.el);

            textField.focus();

            expect(document.activeElement).toBe(textField.inputEl);

            textField.remove();
        });
    });

    describe('Events', () => {
        let textField: TextFieldView;

        beforeEach(() => {
            textField = craft<TextFieldView>`
                <Ink.TextField iconName="ink-i-search"/>
            `;
            document.body.appendChild(textField.el);
        });

        afterEach(() => {
            textField.remove();
            textField = null;
        });

        it('input events from the input', () => {
            const handler = jasmine.createSpy('handler');
            textField.el.addEventListener('input', handler);

            textField.inputEl.dispatchEvent(new window.Event('input', {
                bubbles: true,
            }));

            expect(handler).toHaveBeenCalled();
        });

        it('change events from the input', () => {
            const handler = jasmine.createSpy('handler');
            textField.el.addEventListener('change', handler);

            textField.inputEl.dispatchEvent(new window.Event('change', {
                bubbles: true,
            }));

            expect(handler).toHaveBeenCalled();
        });

        it('mousedown on the chrome focuses the input', () => {
            const iconEl = textField.el.querySelector<HTMLSpanElement>(
                '.ink-c-text-field__icon');

            iconEl.dispatchEvent(new window.MouseEvent('mousedown', {
                bubbles: true,
            }));

            expect(document.activeElement).toBe(textField.inputEl);
        });

        it('mousedown on the chrome when disabled', () => {
            const iconEl = textField.el.querySelector<HTMLSpanElement>(
                '.ink-c-text-field__icon');

            textField.disabled = true;

            iconEl.dispatchEvent(new window.MouseEvent('mousedown', {
                bubbles: true,
            }));

            expect(document.activeElement).not.toBe(textField.inputEl);
        });
    });
});
