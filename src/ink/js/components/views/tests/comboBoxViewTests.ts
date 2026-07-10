/**
 * Unit tests for ComboBoxView.
 *
 * Version Added:
 *     0.10
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    type ComboBoxItem,
    type ComboBoxItemAttrs,
    ComboBoxItemsCollection,
    ComboBoxView,
    craft,
} from '../../../index';
import { sendKeys } from '../../../testing';


/**
 * Simulate typing text into a combo box's field.
 *
 * Args:
 *     comboBox (ComboBoxView):
 *         The combo box.
 *
 *     text (string):
 *         The new text for the field.
 */
function typeText(
    comboBox: ComboBoxView,
    text: string,
) {
    const fieldEl = comboBox.textField.inputEl;

    fieldEl.value = text;
    fieldEl.dispatchEvent(new window.Event('input', {
        bubbles: true,
    }));
}


suite('components/views/ComboBoxView', () => {
    let comboBox: ComboBoxView = null;

    function buildStaticComboBox(): ComboBoxView {
        const view = craft<ComboBoxView>`
            <Ink.ComboBox id="my-combo" name="fruit">
             <Ink.ComboBox.Item id="apple" label="Apple"/>
             <Ink.ComboBox.Item id="banana" label="Banana"
                                description="A yellow fruit"/>
             <Ink.ComboBox.Item id="grape" label="Grape"/>
            </Ink.ComboBox>
        `;
        document.body.appendChild(view.el);

        return view;
    }

    afterEach(() => {
        comboBox.remove();
        comboBox = null;
    });

    describe('Render', () => {
        it('Default', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo"/>
            `;

            const el = comboBox.el;

            expect(el.classList.contains('ink-c-combo-box')).toBeTrue();

            expect(comboBox.textField.el.classList
                   .contains('ink-c-combo-box__field'))
                .toBeTrue();

            const fieldEl = comboBox.textField.inputEl;
            expect(fieldEl.getAttribute('role')).toBe('combobox');
            expect(fieldEl.getAttribute('autocomplete')).toBe('off');
            expect(fieldEl.getAttribute('aria-autocomplete')).toBe('list');
            expect(fieldEl.getAttribute('aria-controls'))
                .toBe('my-combo__listbox');
            expect(fieldEl.getAttribute('aria-expanded')).toBe('false');

            const listBoxEl = el.querySelector('.ink-c-combo-box__options');
            expect(listBoxEl.id).toBe('my-combo__listbox');
            expect(listBoxEl.getAttribute('role')).toBe('listbox');

            expect(el.querySelector('input[type="hidden"]')).toBeNull();
        });

        it('With ariaLabel', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox ariaLabel="Fruits"/>
            `;

            expect(comboBox.textField.inputEl.getAttribute('aria-label'))
                .toBe('Fruits');
        });

        it('With ariaLabelledBy', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox ariaLabelledBy="my-label"/>
            `;

            expect(comboBox.textField.inputEl.getAttribute('aria-labelledby'))
                .toBe('my-label');
        });

        it('With ariaLabelledBy and ariaLabel', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox ariaLabel="Fruits"
                              ariaLabelledBy="my-label"/>
            `;

            const inputEl = comboBox.textField.inputEl;
            expect(inputEl.getAttribute('aria-labelledby')).toBe('my-label');
            expect(inputEl.hasAttribute('aria-label')).toBeFalse();
        });

        it('With name', () => {
            comboBox = buildStaticComboBox();

            const hiddenInputEl =
                comboBox.el.querySelector<HTMLInputElement>(
                    'input[type="hidden"]');
            expect(hiddenInputEl.name).toBe('fruit');
            expect(hiddenInputEl.value).toBe('');
        });

        it('With placeholder', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox placeholder="Find a fruit..."/>
            `;

            expect(comboBox.textField.inputEl.getAttribute('placeholder'))
                .toBe('Find a fruit...');
        });

        it('With disabled', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox disabled/>
            `;

            expect(comboBox.disabled).toBeTrue();
            expect(comboBox.textField.inputEl.disabled).toBeTrue();
            expect(comboBox.el.classList.contains('-is-disabled'))
                .toBeTrue();
        });

        it('With iconName', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox iconName="ink-i-search"/>
            `;

            const iconEl = comboBox.textField.el.querySelector(
                '.ink-c-text-field__icon');
            expect(iconEl).not.toBeNull();
            expect(iconEl.classList.contains('ink-i-search')).toBeTrue();
        });

        it('With joined', () => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox joined/>
            `;

            expect(comboBox.el.classList.contains('-is-joined')).toBeTrue();
        });
    });

    describe('Static items', () => {
        beforeEach(() => {
            comboBox = buildStaticComboBox();
        });

        it('Typing opens and filters', () => {
            typeText(comboBox, 'ap');

            expect(comboBox.isOpen).toBeTrue();
            expect(comboBox.el.classList.contains('-is-open')).toBeTrue();
            expect(comboBox.textField.inputEl.getAttribute('aria-expanded'))
                .toBe('true');

            const optionEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__option');
            expect(optionEls.length).toBe(2);
            expect(optionEls[0].textContent.trim()).toBe('Apple');
            expect(optionEls[1].textContent).toContain('Grape');
        });

        it('Options render labels and descriptions', () => {
            typeText(comboBox, 'banana');

            const optionEl =
                comboBox.el.querySelector('.ink-c-combo-box__option');

            expect(optionEl.id).toBe('my-combo__option-0');
            expect(optionEl.getAttribute('role')).toBe('option');
            expect(optionEl
                   .querySelector('.ink-c-combo-box__option-label')
                   .textContent)
                .toBe('Banana');
            expect(optionEl
                   .querySelector('.ink-c-combo-box__option-description')
                   .textContent)
                .toBe('A yellow fruit');
        });

        it('Typing below minLength closes', () => {
            typeText(comboBox, 'ap');
            expect(comboBox.isOpen).toBeTrue();

            typeText(comboBox, '');
            expect(comboBox.isOpen).toBeFalse();
        });

        it('No matches shows status', () => {
            typeText(comboBox, 'xyzzy');

            expect(comboBox.isOpen).toBeTrue();
            expect(comboBox.el
                   .querySelectorAll('.ink-c-combo-box__option').length)
                .toBe(0);

            const statusEl =
                comboBox.el.querySelector<HTMLElement>(
                    '.ink-c-combo-box__status');
            expect(statusEl.hidden).toBeFalse();
            expect(statusEl.textContent).toBe('No results found.');
        });

        describe('Keyboard navigation', () => {
            it('ArrowDown opens when closed', () => {
                sendKeys(comboBox.textField.inputEl, ['ArrowDown']);

                expect(comboBox.isOpen).toBeTrue();
                expect(comboBox.el
                       .querySelectorAll('.ink-c-combo-box__option').length)
                    .toBe(3);
            });

            it('ArrowDown moves the highlight with wrapping', () => {
                const fieldEl = comboBox.textField.inputEl;

                sendKeys(fieldEl, ['ArrowDown']);

                const optionEls =
                    comboBox.el.querySelectorAll('.ink-c-combo-box__option');

                sendKeys(fieldEl, ['ArrowDown']);
                expect(optionEls[0].getAttribute('aria-selected'))
                    .toBe('true');
                expect(fieldEl.getAttribute('aria-activedescendant'))
                    .toBe('my-combo__option-0');

                sendKeys(fieldEl, ['ArrowDown', 'ArrowDown']);
                expect(optionEls[0].hasAttribute('aria-selected'))
                    .toBeFalse();
                expect(optionEls[2].getAttribute('aria-selected'))
                    .toBe('true');
                expect(fieldEl.getAttribute('aria-activedescendant'))
                    .toBe('my-combo__option-2');

                /* This should wrap back to the first option. */
                sendKeys(fieldEl, ['ArrowDown']);
                expect(optionEls[0].getAttribute('aria-selected'))
                    .toBe('true');
            });

            it('ArrowUp moves the highlight with wrapping', () => {
                const fieldEl = comboBox.textField.inputEl;

                sendKeys(fieldEl, ['ArrowDown']);

                const optionEls =
                    comboBox.el.querySelectorAll('.ink-c-combo-box__option');

                /* This should wrap to the last option. */
                sendKeys(fieldEl, ['ArrowUp']);
                expect(optionEls[2].getAttribute('aria-selected'))
                    .toBe('true');

                sendKeys(fieldEl, ['ArrowUp']);
                expect(optionEls[1].getAttribute('aria-selected'))
                    .toBe('true');
            });

            it('PageUp and PageDown highlight first and last', () => {
                const fieldEl = comboBox.textField.inputEl;

                sendKeys(fieldEl, ['ArrowDown']);

                const optionEls =
                    comboBox.el.querySelectorAll('.ink-c-combo-box__option');

                sendKeys(fieldEl, ['PageDown']);
                expect(optionEls[2].getAttribute('aria-selected'))
                    .toBe('true');

                sendKeys(fieldEl, ['PageUp']);
                expect(optionEls[0].getAttribute('aria-selected'))
                    .toBe('true');
            });

            it('Enter accepts the highlighted item', () => {
                const fieldEl = comboBox.textField.inputEl;
                const onItemSelected = jasmine.createSpy('onItemSelected');
                const onChange = jasmine.createSpy('onChange');

                comboBox.on('itemSelected', onItemSelected);
                comboBox.on('change', onChange);

                sendKeys(fieldEl, ['ArrowDown', 'ArrowDown', 'ArrowDown']);
                sendKeys(fieldEl, ['Enter']);

                expect(comboBox.isOpen).toBeFalse();
                expect(comboBox.textField.value).toBe('Banana');
                expect(comboBox.value.get('id')).toBe('banana');
                expect(comboBox.el
                       .querySelector<HTMLInputElement>(
                           'input[type="hidden"]')
                       .value)
                    .toBe('banana');

                expect(onItemSelected).toHaveBeenCalledWith(comboBox.value);
                expect(onChange).toHaveBeenCalled();
            });

            it('Tab accepts the highlighted item and keeps focus', () => {
                const fieldEl = comboBox.textField.inputEl;

                sendKeys(fieldEl, ['ArrowDown', 'ArrowDown']);

                const evt = new window.KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Tab',
                });
                fieldEl.dispatchEvent(evt);

                /* Focus should stay in the field. */
                expect(evt.defaultPrevented).toBeTrue();

                expect(comboBox.isOpen).toBeFalse();
                expect(comboBox.textField.value).toBe('Apple');
                expect(comboBox.value.get('id')).toBe('apple');
            });

            it('Tab without a highlight moves focus on', () => {
                const fieldEl = comboBox.textField.inputEl;

                typeText(comboBox, 'ap');
                expect(comboBox.isOpen).toBeTrue();

                const evt = new window.KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: 'Tab',
                });
                fieldEl.dispatchEvent(evt);

                expect(evt.defaultPrevented).toBeFalse();
                expect(comboBox.isOpen).toBeFalse();
                expect(comboBox.value).toBeNull();
            });

            it('Comma is not handled in single mode', () => {
                const fieldEl = comboBox.textField.inputEl;

                typeText(comboBox, 'app');
                sendKeys(fieldEl, ['ArrowDown']);

                const evt = new window.KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,
                    key: ',',
                });
                fieldEl.dispatchEvent(evt);

                expect(evt.defaultPrevented).toBeFalse();
                expect(comboBox.value).toBeNull();
                expect(comboBox.isOpen).toBeTrue();
            });

            it('Escape closes, then clears', () => {
                const fieldEl = comboBox.textField.inputEl;

                typeText(comboBox, 'ap');
                expect(comboBox.isOpen).toBeTrue();

                sendKeys(fieldEl, ['Escape']);
                expect(comboBox.isOpen).toBeFalse();
                expect(comboBox.textField.value).toBe('ap');

                sendKeys(fieldEl, ['Escape']);
                expect(comboBox.textField.value).toBe('');
            });

            it('Escape clearing the field clears the selection', () => {
                const fieldEl = comboBox.textField.inputEl;

                typeText(comboBox, 'apple');
                sendKeys(fieldEl, ['ArrowDown', 'Enter']);
                expect(comboBox.value.get('id')).toBe('apple');

                /* The pop-up is closed, so this clears the field. */
                sendKeys(fieldEl, ['Escape']);

                expect(comboBox.textField.value).toBe('');
                expect(comboBox.value).toBeNull();
                expect(comboBox.el
                       .querySelector<HTMLInputElement>(
                           'input[type="hidden"]')
                       .value)
                    .toBe('');
            });
        });

        describe('Selection staleness', () => {
            beforeEach(() => {
                typeText(comboBox, 'apple');
                sendKeys(comboBox.textField.inputEl, ['ArrowDown', 'Enter']);

                expect(comboBox.value.get('id')).toBe('apple');
            });

            it('Typing over a selection clears it', () => {
                const onItemRemoved = jasmine.createSpy('onItemRemoved');
                const onChange = jasmine.createSpy('onChange');

                comboBox.on('itemRemoved', onItemRemoved);
                comboBox.on('change', onChange);

                typeText(comboBox, 'gr');

                expect(comboBox.value).toBeNull();
                expect(comboBox.el
                       .querySelector<HTMLInputElement>(
                           'input[type="hidden"]')
                       .value)
                    .toBe('');
                expect(onItemRemoved).toHaveBeenCalled();
                expect(onChange).toHaveBeenCalled();
            });

            it('Clearing the field clears the selection', () => {
                typeText(comboBox, '');

                expect(comboBox.value).toBeNull();
                expect(comboBox.el
                       .querySelector<HTMLInputElement>(
                           'input[type="hidden"]')
                       .value)
                    .toBe('');
            });

            it('Retyping the same label keeps the selection', () => {
                const onChange = jasmine.createSpy('onChange');
                comboBox.on('change', onChange);

                /*
                 * The text still matches the accepted item, so there's
                 * nothing stale to clear.
                 */
                typeText(comboBox, 'Apple');

                expect(comboBox.value.get('id')).toBe('apple');
                expect(comboBox.el
                       .querySelector<HTMLInputElement>(
                           'input[type="hidden"]')
                       .value)
                    .toBe('apple');
                expect(onChange).not.toHaveBeenCalled();
            });
        });

        /*
         * NOTE: The event we use in the view is 'mouseenter', but Backbone
         *       uses jQuery, which emulates 'mouseenter' using 'mouseover'
         *       under the hood. So that's what we dispatch here.
         */
        describe('Mouse interaction', () => {
            it('Clicking an option accepts it', () => {
                typeText(comboBox, 'a');

                const optionEls =
                    comboBox.el.querySelectorAll('.ink-c-combo-box__option');

                optionEls[1].dispatchEvent(new window.MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));

                expect(comboBox.isOpen).toBeFalse();
                expect(comboBox.textField.value).toBe('Banana');
                expect(comboBox.value.get('id')).toBe('banana');
            });

            it('Hovering an option highlights it', () => {
                typeText(comboBox, 'a');

                const optionEls =
                    comboBox.el.querySelectorAll('.ink-c-combo-box__option');

                optionEls[1].dispatchEvent(new window.MouseEvent('mouseover', {
                    bubbles: true,
                    cancelable: true,
                }));

                expect(optionEls[1].getAttribute('aria-selected'))
                    .toBe('true');
                expect(comboBox.textField.inputEl
                       .getAttribute('aria-activedescendant'))
                    .toBe('my-combo__option-1');
            });

            it('Clicking the document closes the pop-up', () => {
                typeText(comboBox, 'a');
                expect(comboBox.isOpen).toBeTrue();

                document.body.dispatchEvent(new window.MouseEvent('click', {
                    bubbles: true,
                }));

                expect(comboBox.isOpen).toBeFalse();
            });
        });

        it('Focus moving outside closes the pop-up', () => {
            const otherEl = document.createElement('input');
            document.body.appendChild(otherEl);

            try {
                comboBox.textField.inputEl.focus();
                typeText(comboBox, 'a');
                expect(comboBox.isOpen).toBeTrue();

                otherEl.focus();

                expect(comboBox.isOpen).toBeFalse();
            } finally {
                otherEl.remove();
            }
        });
    });

    describe('Disabled items', () => {
        beforeEach(() => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo">
                 <Ink.ComboBox.Item id="apple" label="Apple" disabled/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(comboBox.el);
        });

        it('Render with aria-disabled', () => {
            typeText(comboBox, 'a');

            expect(comboBox.el
                   .querySelector('.ink-c-combo-box__option')
                   .getAttribute('aria-disabled'))
                .toBe('true');
        });

        it('Enter does not accept', () => {
            const fieldEl = comboBox.textField.inputEl;

            sendKeys(fieldEl, ['ArrowDown', 'ArrowDown']);
            sendKeys(fieldEl, ['Enter']);

            expect(comboBox.value).toBeNull();
            expect(comboBox.textField.value).toBe('');
        });
    });

    describe('With selectFirst', () => {
        beforeEach(() => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo" selectFirst>
                 <Ink.ComboBox.Item id="apple" label="Apple"/>
                 <Ink.ComboBox.Item id="grape" label="Grape"/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(comboBox.el);
        });

        it('First option is highlighted automatically', () => {
            typeText(comboBox, 'a');

            expect(comboBox.el
                   .querySelector('.ink-c-combo-box__option')
                   .getAttribute('aria-selected'))
                .toBe('true');
            expect(comboBox.textField.inputEl
                   .getAttribute('aria-activedescendant'))
                .toBe('my-combo__option-0');
        });

        it('Tab completes to the first result', () => {
            typeText(comboBox, 'gr');

            const evt = new window.KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: 'Tab',
            });
            comboBox.textField.inputEl.dispatchEvent(evt);

            /* Focus should stay in the field. */
            expect(evt.defaultPrevented).toBeTrue();

            expect(comboBox.isOpen).toBeFalse();
            expect(comboBox.textField.value).toBe('Grape');
            expect(comboBox.value.get('id')).toBe('grape');
        });
    });

    describe('With hintText', () => {
        beforeEach(() => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo"
                              hintText="Press Tab to auto-complete.">
                 <Ink.ComboBox.Item id="apple" label="Apple"/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(comboBox.el);
        });

        it('Shown when there are results', () => {
            typeText(comboBox, 'a');

            const hintEl = comboBox.el.querySelector<HTMLElement>(
                '.ink-c-combo-box__hint');
            expect(hintEl.hidden).toBeFalse();
            expect(hintEl.textContent).toBe('Press Tab to auto-complete.');
        });

        it('Hidden when there are no results', () => {
            typeText(comboBox, 'xyzzy');

            expect(comboBox.el
                   .querySelector<HTMLElement>('.ink-c-combo-box__hint')
                   .hidden)
                .toBeTrue();
        });
    });

    describe('With renderItem', () => {
        it('Options render custom content', () => {
            function renderItem(item: ComboBoxItem): HTMLElement {
                const el = document.createElement('strong');
                el.textContent = item.get('label');

                return el;
            }

            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo"
                              renderItem=${renderItem}>
                 <Ink.ComboBox.Item id="apple" label="Apple"/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(comboBox.el);

            typeText(comboBox, 'a');

            const optionEl =
                comboBox.el.querySelector('.ink-c-combo-box__option');

            expect(optionEl.innerHTML).toBe('<strong>Apple</strong>');
        });
    });

    describe('Asynchronous items', () => {
        let loadResolvers: ((items: ComboBoxItemAttrs[]) => void)[];
        let loadRejecters: ((err: Error) => void)[];
        let loadQueries: string[];

        function load(query: string): Promise<ComboBoxItemAttrs[]> {
            loadQueries.push(query);

            return new Promise((resolve, reject) => {
                loadResolvers.push(resolve);
                loadRejecters.push(reject);
            });
        }

        function buildAsyncComboBox(
            options: Record<string, unknown> = {},
        ): ComboBoxView {
            const view = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo"
                              load=${load}
                              ...${options}/>
            `;
            document.body.appendChild(view.el);

            return view;
        }

        beforeEach(() => {
            loadResolvers = [];
            loadRejecters = [];
            loadQueries = [];

            jasmine.clock().install();
            jasmine.clock().mockDate();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it('Typing debounces the load', () => {
            comboBox = buildAsyncComboBox();

            typeText(comboBox, 'a');
            typeText(comboBox, 'ap');

            expect(loadQueries).toEqual([]);

            jasmine.clock().tick(251);

            expect(loadQueries).toEqual(['ap']);
        });

        it('Keyboard navigation cancels a scheduled load', () => {
            comboBox = buildAsyncComboBox();

            typeText(comboBox, 'ap');

            /*
             * This runs the query immediately. The query the keystroke
             * scheduled should be dropped rather than repeating it once
             * the debounce delay elapses.
             */
            sendKeys(comboBox.textField.inputEl, ['ArrowDown']);
            expect(loadQueries).toEqual(['ap']);

            jasmine.clock().tick(251);

            expect(loadQueries).toEqual(['ap']);
        });

        it('Loading state is shown', () => {
            comboBox = buildAsyncComboBox();

            typeText(comboBox, 'ap');
            jasmine.clock().tick(251);

            expect(comboBox.isOpen).toBeTrue();
            expect(comboBox.el.classList.contains('-is-loading')).toBeTrue();

            const statusEl =
                comboBox.el.querySelector<HTMLElement>(
                    '.ink-c-combo-box__status');
            expect(statusEl.hidden).toBeFalse();
            expect(statusEl.textContent).toBe('Loading...');
        });

        it('Results are shown when loaded', async () => {
            comboBox = buildAsyncComboBox();

            typeText(comboBox, 'ap');
            jasmine.clock().tick(251);

            loadResolvers[0]([
                {
                    id: 'apple',
                    label: 'Apple',
                },
                {
                    id: 'apricot',
                    label: 'Apricot',
                },
            ]);

            await Promise.resolve();
            await Promise.resolve();

            expect(comboBox.el.classList.contains('-is-loading')).toBeFalse();

            const optionEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__option');
            expect(optionEls.length).toBe(2);
            expect(optionEls[0].textContent).toContain('Apple');
            expect(optionEls[1].textContent).toContain('Apricot');

            expect(comboBox.el
                   .querySelector<HTMLElement>('.ink-c-combo-box__status')
                   .hidden)
                .toBeTrue();
        });

        it('Stale results are discarded', async () => {
            comboBox = buildAsyncComboBox({
                debounceMS: 0,
            });

            typeText(comboBox, 'a');
            jasmine.clock().tick(1);

            typeText(comboBox, 'ab');
            jasmine.clock().tick(1);

            expect(loadQueries).toEqual(['a', 'ab']);

            /* Resolve the latest query first. */
            loadResolvers[1]([
                {
                    id: 'new',
                    label: 'New result',
                },
            ]);

            await Promise.resolve();
            await Promise.resolve();

            /* Now resolve the stale query. It should be ignored. */
            loadResolvers[0]([
                {
                    id: 'stale',
                    label: 'Stale result',
                },
            ]);

            await Promise.resolve();
            await Promise.resolve();

            const optionEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__option');
            expect(optionEls.length).toBe(1);
            expect(optionEls[0].textContent).toContain('New result');
        });

        it('Errors are shown', async () => {
            comboBox = buildAsyncComboBox();

            typeText(comboBox, 'ap');
            jasmine.clock().tick(251);

            loadRejecters[0](new Error('Something went wrong.'));

            await Promise.resolve();
            await Promise.resolve();

            expect(comboBox.el.classList.contains('-is-loading')).toBeFalse();

            const statusEl =
                comboBox.el.querySelector<HTMLElement>(
                    '.ink-c-combo-box__status');
            expect(statusEl.hidden).toBeFalse();
            expect(statusEl.textContent).toBe('Something went wrong.');
        });

        it('Rejections without a message fall back to errorText', async () => {
            comboBox = buildAsyncComboBox();

            typeText(comboBox, 'ap');
            jasmine.clock().tick(251);

            /* Not everything rejects with an Error. */
            loadRejecters[0](undefined);

            await Promise.resolve();
            await Promise.resolve();

            expect(comboBox.el.classList.contains('-is-loading')).toBeFalse();
            expect(comboBox.el
                   .querySelector('.ink-c-combo-box__status')
                   .textContent)
                .toBe('Failed to load matching items.');
        });

        it('Typing below minLength cancels a scheduled load', () => {
            comboBox = buildAsyncComboBox({
                minLength: 2,
            });

            typeText(comboBox, 'ap');
            typeText(comboBox, 'a');

            jasmine.clock().tick(251);

            expect(loadQueries).toEqual([]);
            expect(comboBox.isOpen).toBeFalse();
        });

        describe('With custom status text', () => {
            it('loadingText is shown while loading', () => {
                comboBox = buildAsyncComboBox({
                    loadingText: 'Searching…',
                });

                typeText(comboBox, 'ap');
                jasmine.clock().tick(251);

                expect(comboBox.el
                       .querySelector('.ink-c-combo-box__status')
                       .textContent)
                    .toBe('Searching…');
            });

            it('errorText is shown on failure', async () => {
                comboBox = buildAsyncComboBox({
                    errorText: 'Could not reach the server.',
                });

                typeText(comboBox, 'ap');
                jasmine.clock().tick(251);

                loadRejecters[0](undefined);

                await Promise.resolve();
                await Promise.resolve();

                expect(comboBox.el
                       .querySelector('.ink-c-combo-box__status')
                       .textContent)
                    .toBe('Could not reach the server.');
            });

            it('noResultsText is shown when empty', async () => {
                comboBox = buildAsyncComboBox({
                    noResultsText: 'Nobody here.',
                });

                typeText(comboBox, 'ap');
                jasmine.clock().tick(251);

                loadResolvers[0]([]);

                await Promise.resolve();
                await Promise.resolve();

                expect(comboBox.el
                       .querySelector('.ink-c-combo-box__status')
                       .textContent)
                    .toBe('Nobody here.');
            });
        });
    });

    describe('Multiple mode', () => {
        function buildMultipleComboBox(): ComboBoxView {
            const view = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo" multiple name="fruits">
                 <Ink.ComboBox.Item id="apple" label="Apple"/>
                 <Ink.ComboBox.Item id="banana" label="Banana"/>
                 <Ink.ComboBox.Item id="grape" label="Grape"/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(view.el);

            return view;
        }

        function selectItem(
            view: ComboBoxView,
            query: string,
        ) {
            typeText(view, query);
            sendKeys(view.textField.inputEl, ['ArrowDown', 'Enter']);
        }

        beforeEach(() => {
            comboBox = buildMultipleComboBox();
        });

        it('Render', () => {
            const el = comboBox.el;

            expect(el.classList.contains('-is-multiple')).toBeTrue();

            const tokensEl = el.querySelector('.ink-c-combo-box__tokens');
            expect(tokensEl).not.toBeNull();

            const fieldEl = tokensEl.querySelector(
                '.ink-c-combo-box__token-field .ink-c-combo-box__field');
            expect(fieldEl).toBe(comboBox.textField.el);
        });

        it('Accepting an item adds a token and clears the field', () => {
            selectItem(comboBox, 'apple');

            expect(comboBox.isOpen).toBeFalse();
            expect(comboBox.textField.value).toBe('');
            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('apple');

            const tokenEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__token');
            expect(tokenEls.length).toBe(1);
            expect(tokenEls[0]
                   .querySelector('.ink-c-combo-box__token-label')
                   .textContent)
                .toBe('Apple');

            const removeEl =
                tokenEls[0].querySelector('.ink-c-combo-box__token-remove');
            expect(removeEl.getAttribute('aria-label')).toBe('Remove Apple');
        });

        it('Tokens are ordered before the field', () => {
            selectItem(comboBox, 'apple');
            selectItem(comboBox, 'banana');

            const itemEls = comboBox.el
                .querySelector('.ink-c-combo-box__tokens')
                .children;

            expect(itemEls.length).toBe(3);
            expect(itemEls[0].classList.contains('ink-c-combo-box__token'))
                .toBeTrue();
            expect(itemEls[1].classList.contains('ink-c-combo-box__token'))
                .toBeTrue();
            expect(itemEls[2].classList
                   .contains('ink-c-combo-box__token-field'))
                .toBeTrue();
        });

        it('Selected items are excluded from suggestions', () => {
            selectItem(comboBox, 'apple');

            typeText(comboBox, 'a');

            const optionEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__option');
            expect(optionEls.length).toBe(2);
            expect(optionEls[0].textContent).toContain('Banana');
            expect(optionEls[1].textContent).toContain('Grape');
        });

        it('The hidden input contains comma-separated IDs', () => {
            selectItem(comboBox, 'apple');
            selectItem(comboBox, 'banana');

            expect(comboBox.el
                   .querySelector<HTMLInputElement>('input[type="hidden"]')
                   .value)
                .toBe('apple,banana');
        });

        it('The hidden input skips items without IDs', () => {
            selectItem(comboBox, 'apple');

            comboBox.selectedItems.add({
                label: 'Not persisted',
            });

            selectItem(comboBox, 'banana');

            expect(comboBox.selectedItems.length).toBe(3);
            expect(comboBox.el
                   .querySelector<HTMLInputElement>('input[type="hidden"]')
                   .value)
                .toBe('apple,banana');
        });

        it('Comma accepts the highlighted item', () => {
            const fieldEl = comboBox.textField.inputEl;

            typeText(comboBox, 'app');
            sendKeys(fieldEl, ['ArrowDown']);

            const evt = new window.KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: ',',
            });
            fieldEl.dispatchEvent(evt);

            /* The comma should not be typed into the field. */
            expect(evt.defaultPrevented).toBeTrue();

            expect(comboBox.isOpen).toBeFalse();
            expect(comboBox.textField.value).toBe('');
            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('apple');
        });

        it('Comma without a highlight types normally', () => {
            const fieldEl = comboBox.textField.inputEl;

            typeText(comboBox, 'app');

            const evt = new window.KeyboardEvent('keydown', {
                bubbles: true,
                cancelable: true,
                key: ',',
            });
            fieldEl.dispatchEvent(evt);

            expect(evt.defaultPrevented).toBeFalse();
            expect(comboBox.selectedItems.length).toBe(0);
        });

        it('Backspace moves the last item into the field', () => {
            selectItem(comboBox, 'apple');
            selectItem(comboBox, 'banana');

            const onItemRemoved = jasmine.createSpy('onItemRemoved');
            comboBox.on('itemRemoved', onItemRemoved);

            sendKeys(comboBox.textField.inputEl, ['Backspace']);

            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('apple');
            expect(onItemRemoved).toHaveBeenCalled();
            expect(comboBox.el
                   .querySelectorAll('.ink-c-combo-box__token').length)
                .toBe(1);

            /* The label returns to the field for editing. */
            expect(comboBox.textField.value).toBe('Banana');
        });

        it('Backspace does nothing when the field has text', () => {
            selectItem(comboBox, 'apple');

            typeText(comboBox, 'gr');
            sendKeys(comboBox.textField.inputEl, ['Backspace']);

            expect(comboBox.selectedItems.length).toBe(1);
        });

        it('Clicking a token remove button removes the item', () => {
            selectItem(comboBox, 'apple');

            comboBox.el
                .querySelector('.ink-c-combo-box__token-remove')
                .dispatchEvent(new window.MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));

            expect(comboBox.selectedItems.length).toBe(0);
            expect(comboBox.el
                   .querySelectorAll('.ink-c-combo-box__token').length)
                .toBe(0);
            expect(comboBox.el
                   .querySelector<HTMLInputElement>('input[type="hidden"]')
                   .value)
                .toBe('');
        });

        it('Duplicate selections are ignored', () => {
            selectItem(comboBox, 'apple');

            /*
             * The item is filtered from suggestions, but adding it again
             * directly should also be a no-op.
             */
            comboBox.selectedItems.add({
                id: 'apple',
                label: 'Apple',
            });

            expect(comboBox.selectedItems.length).toBe(1);
        });

        it('itemSelected and change fire when selecting', () => {
            const onItemSelected = jasmine.createSpy('onItemSelected');
            const onChange = jasmine.createSpy('onChange');

            comboBox.on('itemSelected', onItemSelected);
            comboBox.on('change', onChange);

            selectItem(comboBox, 'apple');

            expect(onItemSelected).toHaveBeenCalledWith(
                comboBox.selectedItems.at(0));
            expect(onChange).toHaveBeenCalled();
        });
    });

    describe('Multiple mode with allowCustomTokens', () => {
        function buildCustomTokensComboBox(): ComboBoxView {
            const view = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo" multiple allowCustomTokens
                              name="fruits">
                 <Ink.ComboBox.Item id="apple" label="Apple"/>
                 <Ink.ComboBox.Item id="banana" label="Banana"/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(view.el);

            return view;
        }

        beforeEach(() => {
            comboBox = buildCustomTokensComboBox();
        });

        it('Enter selects the typed text', () => {
            typeText(comboBox, 'cherry ');

            sendKeys(comboBox.textField.inputEl, ['Enter']);

            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('cherry');
            expect(comboBox.selectedItems.at(0).get('label')).toBe('cherry');
            expect(comboBox.textField.value).toBe('');
            expect(comboBox.isOpen).toBeFalse();
        });

        it('Enter with a highlight accepts the suggestion', () => {
            typeText(comboBox, 'app');
            sendKeys(comboBox.textField.inputEl, ['ArrowDown', 'Enter']);

            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('apple');
        });

        it('Enter on an empty field is not handled', () => {
            const fieldEl = comboBox.textField.inputEl;
            const onKeyDown = jasmine.createSpy('onKeyDown');
            document.body.addEventListener('keydown', onKeyDown);

            try {
                sendKeys(fieldEl, ['Enter']);
            } finally {
                document.body.removeEventListener('keydown', onKeyDown);
            }

            /* The event propagates on, so a form can submit. */
            expect(comboBox.selectedItems.length).toBe(0);
            expect(onKeyDown).toHaveBeenCalled();
        });

        it('Comma selects the typed text', () => {
            typeText(comboBox, 'cherry');
            sendKeys(comboBox.textField.inputEl, [',']);

            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('cherry');
            expect(comboBox.textField.value).toBe('');
        });

        it('Comma on an empty field is swallowed', () => {
            sendKeys(comboBox.textField.inputEl, [',']);

            expect(comboBox.selectedItems.length).toBe(0);
            expect(comboBox.textField.value).toBe('');
        });

        it('Duplicate typed text clears the field only', () => {
            typeText(comboBox, 'cherry');
            sendKeys(comboBox.textField.inputEl, ['Enter']);
            typeText(comboBox, 'cherry');
            sendKeys(comboBox.textField.inputEl, ['Enter']);

            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.textField.value).toBe('');
        });

        it('Backspace makes a custom token editable', () => {
            typeText(comboBox, 'cherry');
            sendKeys(comboBox.textField.inputEl, ['Enter']);

            sendKeys(comboBox.textField.inputEl, ['Backspace']);

            expect(comboBox.selectedItems.length).toBe(0);
            expect(comboBox.textField.value).toBe('cherry');
        });
    });

    describe('Multiple mode with showSelected=false', () => {
        beforeEach(() => {
            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo" multiple name="fruits"
                              showSelected=${false}>
                 <Ink.ComboBox.Item id="apple" label="Apple"/>
                 <Ink.ComboBox.Item id="banana" label="Banana"/>
                </Ink.ComboBox>
            `;
            document.body.appendChild(comboBox.el);
        });

        it('Render without tokens', () => {
            const el = comboBox.el;

            expect(el.classList.contains('-is-multiple')).toBeFalse();
            expect(el.querySelector('.ink-c-combo-box__tokens')).toBeNull();
            expect(comboBox.textField.el.parentElement).toBe(el);
        });

        it('Selection is tracked without rendering tokens', () => {
            const onAdd = jasmine.createSpy('onAdd');
            comboBox.selectedItems.on('add', onAdd);

            typeText(comboBox, 'apple');
            sendKeys(comboBox.textField.inputEl, ['ArrowDown', 'Enter']);

            expect(comboBox.selectedItems.length).toBe(1);
            expect(comboBox.selectedItems.at(0).get('id')).toBe('apple');
            expect(onAdd).toHaveBeenCalled();

            expect(comboBox.el
                   .querySelectorAll('.ink-c-combo-box__token').length)
                .toBe(0);
            expect(comboBox.el
                   .querySelector<HTMLInputElement>('input[type="hidden"]')
                   .value)
                .toBe('apple');

            /* The selected item should still be excluded from queries. */
            typeText(comboBox, 'a');

            const optionEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__option');
            expect(optionEls.length).toBe(1);
            expect(optionEls[0].textContent).toContain('Banana');
        });

        it('Removing from the collection updates the field', () => {
            typeText(comboBox, 'apple');
            sendKeys(comboBox.textField.inputEl, ['ArrowDown', 'Enter']);

            comboBox.selectedItems.remove(comboBox.selectedItems.at(0));

            expect(comboBox.el
                   .querySelector<HTMLInputElement>('input[type="hidden"]')
                   .value)
                .toBe('');
        });
    });

    describe('Multiple mode with pre-populated selection', () => {
        it('Tokens render for existing items', () => {
            const selectedItems = new ComboBoxItemsCollection([
                {
                    id: 'apple',
                    label: 'Apple',
                },
                {
                    id: 'banana',
                    label: 'Banana',
                },
            ]);

            comboBox = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo" multiple name="fruits"
                              selectedItems=${selectedItems}/>
            `;
            document.body.appendChild(comboBox.el);

            expect(comboBox.selectedItems).toBe(selectedItems);

            const tokenEls =
                comboBox.el.querySelectorAll('.ink-c-combo-box__token');
            expect(tokenEls.length).toBe(2);
            expect(tokenEls[0].textContent).toContain('Apple');
            expect(tokenEls[1].textContent).toContain('Banana');
        });
    });

    describe('Properties', () => {
        beforeEach(() => {
            comboBox = buildStaticComboBox();
        });

        describe('value', () => {
            it('Set to an item', () => {
                typeText(comboBox, 'apple');
                sendKeys(comboBox.textField.inputEl, ['ArrowDown', 'Enter']);

                const value = comboBox.value;
                expect(value.get('id')).toBe('apple');

                comboBox.value = null;

                expect(comboBox.value).toBeNull();
                expect(comboBox.textField.value).toBe('');
                expect(comboBox.el
                       .querySelector<HTMLInputElement>(
                           'input[type="hidden"]')
                       .value)
                    .toBe('');
            });
        });

        describe('disabled', () => {
            it('Set to true closes and disables', () => {
                typeText(comboBox, 'a');
                expect(comboBox.isOpen).toBeTrue();

                comboBox.disabled = true;

                expect(comboBox.isOpen).toBeFalse();
                expect(comboBox.textField.inputEl.disabled).toBeTrue();
                expect(comboBox.el.classList.contains('-is-disabled'))
                    .toBeTrue();
            });
        });
    });

    describe('Disabled in multiple mode', () => {
        function buildDisabledMultipleComboBox(
            disabled: boolean,
        ): ComboBoxView {
            const selectedItems = new ComboBoxItemsCollection([
                {
                    id: 'apple',
                    label: 'Apple',
                },
            ]);

            const view = craft<ComboBoxView>`
                <Ink.ComboBox id="my-combo" multiple name="fruits"
                              disabled=${disabled}
                              selectedItems=${selectedItems}/>
            `;
            document.body.appendChild(view.el);

            return view;
        }

        it('Token remove buttons are disabled', () => {
            comboBox = buildDisabledMultipleComboBox(true);

            expect(comboBox.el
                   .querySelector<HTMLButtonElement>(
                       '.ink-c-combo-box__token-remove')
                   .disabled)
                .toBeTrue();
        });

        it('Clicking a token remove button does nothing', () => {
            comboBox = buildDisabledMultipleComboBox(true);

            comboBox.el
                .querySelector('.ink-c-combo-box__token-remove')
                .dispatchEvent(new window.MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));

            expect(comboBox.selectedItems.length).toBe(1);
        });

        it('Backspace does not remove the last item', () => {
            comboBox = buildDisabledMultipleComboBox(true);

            sendKeys(comboBox.textField.inputEl, ['Backspace']);

            expect(comboBox.selectedItems.length).toBe(1);
        });

        it('Disabling later disables existing tokens', () => {
            comboBox = buildDisabledMultipleComboBox(false);

            const removeEl = comboBox.el.querySelector<HTMLButtonElement>(
                '.ink-c-combo-box__token-remove');
            expect(removeEl.disabled).toBeFalse();

            comboBox.disabled = true;

            expect(removeEl.disabled).toBeTrue();
        });

        it('Tokens added while disabled are disabled', () => {
            comboBox = buildDisabledMultipleComboBox(true);

            comboBox.selectedItems.add({
                id: 'banana',
                label: 'Banana',
            });

            const removeEls =
                comboBox.el.querySelectorAll<HTMLButtonElement>(
                    '.ink-c-combo-box__token-remove');
            expect(removeEls.length).toBe(2);

            for (const removeEl of removeEls) {
                expect(removeEl.disabled).toBeTrue();
            }
        });
    });

    describe('Pop-up positioning', () => {
        /*
         * NOTE: JSDOM doesn't lay anything out, so every measurement the
         *       view takes reads back as 0. The horizontal tests below
         *       stub the handful of metrics involved, which is enough to
         *       drive the real code. The vertical logic depends on
         *       scroll state as well, and is verified manually.
         */

        /**
         * Stub out the layout metrics used for horizontal positioning.
         *
         * Args:
         *     metrics (object):
         *         The field's viewport offset and width, the pop-up's
         *         width, and the viewport width.
         */
        function stubMetrics(
            metrics: {
                elLeft: number,
                elWidth: number,
                popupWidth: number,
                windowWidth: number,
            },
        ) {
            const popupEl = comboBox.el.querySelector<HTMLElement>(
                '.ink-c-combo-box__popup');

            comboBox.el.getBoundingClientRect = () => ({
                bottom: 0,
                height: 0,
                left: metrics.elLeft,
                right: metrics.elLeft + metrics.elWidth,
                toJSON: () => ({}),
                top: 0,
                width: metrics.elWidth,
                x: metrics.elLeft,
                y: 0,
            }) as DOMRect;

            Object.defineProperty(popupEl, 'offsetWidth', {
                configurable: true,
                value: metrics.popupWidth,
            });

            Object.defineProperty(document.documentElement, 'clientWidth', {
                configurable: true,
                value: metrics.windowWidth,
            });

            return popupEl;
        }

        beforeEach(() => {
            comboBox = buildStaticComboBox();
        });

        afterEach(() => {
            /*
             * Drop the stubbed viewport width, so the real one on the
             * prototype applies again for other suites.
             */
            Reflect.deleteProperty(document.documentElement, 'clientWidth');
        });

        it('Fitting pop-ups are left-aligned with the field', () => {
            const popupEl = stubMetrics({
                elLeft: 20,
                elWidth: 150,
                popupWidth: 250,
                windowWidth: 800,
            });

            typeText(comboBox, 'a');

            expect(popupEl.style.left).toBe('');
            expect(popupEl.style.right).toBe('');
        });

        it('Overflowing pop-ups shift only as far as needed', () => {
            /*
             * The pop-up runs 5px past the right edge, so it should move
             * 5px, not jump to a different alignment.
             */
            const popupEl = stubMetrics({
                elLeft: 235,
                elWidth: 80,
                popupWidth: 250,
                windowWidth: 480,
            });

            typeText(comboBox, 'a');

            expect(popupEl.style.left).toBe('-5px');
            expect(popupEl.style.right).toBe('auto');
        });

        it('Pop-ups are never pushed past the left of the viewport', () => {
            const popupEl = stubMetrics({
                elLeft: 130,
                elWidth: 80,
                popupWidth: 250,
                windowWidth: 375,
            });

            typeText(comboBox, 'a');

            /* Shifted 5px to fit, and nowhere near the viewport edge. */
            expect(popupEl.style.left).toBe('-5px');
        });

        it('Pop-ups wider than the viewport align to its left edge', () => {
            const popupEl = stubMetrics({
                elLeft: 40,
                elWidth: 150,
                popupWidth: 600,
                windowWidth: 375,
            });

            typeText(comboBox, 'a');

            expect(popupEl.style.left).toBe('-40px');
            expect(popupEl.style.right).toBe('auto');
        });

        it('Closing clears the positioning state', () => {
            typeText(comboBox, 'a');
            expect(comboBox.isOpen).toBeTrue();

            const popupEl = comboBox.el.querySelector<HTMLElement>(
                '.ink-c-combo-box__popup');

            /* Stand in for a computed position from a real layout. */
            comboBox.el.classList.add('-opens-up');
            popupEl.style.bottom = '20px';
            popupEl.style.left = '-10px';
            popupEl.style.right = 'auto';

            comboBox.close();

            expect(comboBox.el.classList.contains('-opens-up')).toBeFalse();
            expect(popupEl.style.top).toBe('');
            expect(popupEl.style.bottom).toBe('');
            expect(popupEl.style.left).toBe('');
            expect(popupEl.style.right).toBe('');
        });
    });
});
