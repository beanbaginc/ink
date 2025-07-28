/**
 * Unit tests for TypeaheadBuffer.
 *
 * Version Added:
 *     0.5
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import { TypeaheadBuffer } from '../typeaheadBuffer';


suite('foundation/models/TypeaheadBuffer', () => {
    let typeaheadBuffer: TypeaheadBuffer;

    function sendKeys(
        keys: string | string[],
        expectHandled?: boolean,
    ) {
        for (let i = 0; i < keys.length; i++) {
            const handled = typeaheadBuffer.handleKeyDown(
                new window.KeyboardEvent('keydown', {
                    key: keys[i],
                }));

            expect(handled).toBe(expectHandled ?? true);
        }
    }

    beforeEach(() => {
        typeaheadBuffer = new TypeaheadBuffer({
            autoClearDelayMS: 0.1,
        });
    });

    afterEach(() => {
        typeaheadBuffer.clearBuffer();
        typeaheadBuffer = null;
    });

    it('clearBuffer', () => {
        sendKeys('a');
        typeaheadBuffer.clearBuffer();

        expect(typeaheadBuffer.hasContent()).toBeFalse();
    });

    describe('handleKeyDown', () => {
        it('With printable keys', () => {
            sendKeys('aBc');

            expect(typeaheadBuffer.buffer).toBe('abc');
        });

        it('With first key non-printable', () => {
            sendKeys('/', false);

            expect(typeaheadBuffer.buffer).toBe('');
        });

        describe('With Backspace', () => {
            it('With empty buffer', () => {
                sendKeys(['Backspace']);

                expect(typeaheadBuffer.buffer).toBe('');
            });

            it('With populated buffer', () => {
                sendKeys(['a', 'b', 'Backspace']);

                expect(typeaheadBuffer.buffer).toBe('a');
            });
        });

        it('With Escape', () => {
            sendKeys(['a', 'b', 'Escape']);

            expect(typeaheadBuffer.buffer).toBe('');
        });

        it('After auto-clear delay expires', onDone => {
            sendKeys('ab');
            expect(typeaheadBuffer.buffer).toBe('ab');

            setTimeout(() => {
                expect(typeaheadBuffer.buffer).toBe('');
                sendKeys('xyz');
                expect(typeaheadBuffer.buffer).toBe('xyz');

                onDone();
            }, 0.2);
        });
    });

    describe('hasContent', () => {
        it('With content', () => {
            sendKeys('a');

            expect(typeaheadBuffer.hasContent()).toBeTrue();
        });

        it('Without content', () => {
            expect(typeaheadBuffer.hasContent()).toBeFalse();
        });
    });

    describe('helpFindItemWithPrefix', () => {
        const items = [
            {label: 'a'},
            {label: 'b'},
            {label: 'c'},
            {label: 'cd'},
            {label: 'z'},
        ]

        describe('With found', () => {
            it('As first item', () => {
                sendKeys('a');

                expect(typeaheadBuffer.helpFindItemWithPrefix({
                    firstItem: 0,
                    lastItem: items.length - 1,
                    getNextItem: i => i + 1,
                    getItemText: i => items[i].label,
                })).toBe(0);
            });

            it('As middle item', () => {
                sendKeys('cd');

                expect(typeaheadBuffer.helpFindItemWithPrefix({
                    firstItem: 0,
                    lastItem: items.length - 1,
                    getNextItem: i => i + 1,
                    getItemText: i => items[i].label,
                })).toBe(3);
            });

            it('As first last item', () => {
                sendKeys('z');

                expect(typeaheadBuffer.helpFindItemWithPrefix({
                    firstItem: 0,
                    lastItem: items.length - 1,
                    getNextItem: i => i + 1,
                    getItemText: i => items[i].label,
                })).toBe(4);
            });
        });

        describe('With not found', () => {
            it('Below range', () => {
                sendKeys('a');

                expect(typeaheadBuffer.helpFindItemWithPrefix({
                    firstItem: 1,
                    lastItem: items.length - 1,
                    getNextItem: i => i + 1,
                    getItemText: i => items[i].label,
                })).toBeNull();
            });

            it('Above range', () => {
                sendKeys('cd');

                expect(typeaheadBuffer.helpFindItemWithPrefix({
                    firstItem: 0,
                    lastItem: 2,
                    getNextItem: i => i + 1,
                    getItemText: i => items[i].label,
                })).toBeNull();
            });

            it('Not in range', () => {
                sendKeys('q');

                expect(typeaheadBuffer.helpFindItemWithPrefix({
                    firstItem: 0,
                    lastItem: items.length - 1,
                    getNextItem: i => i + 1,
                    getItemText: i => items[i].label,
                })).toBeNull();
            });
        });
    });

    describe('matchesText', () => {
        it('With match', () => {
            sendKeys('abc');

            expect(typeaheadBuffer.matchesText('abc')).toBeTrue();
            expect(typeaheadBuffer.matchesText('abcd')).toBeTrue();
            expect(typeaheadBuffer.matchesText('a b + c')).toBeTrue();
        });

        it('Without match', () => {
            sendKeys('abc');

            expect(typeaheadBuffer.matchesText('abd')).toBeFalse();
            expect(typeaheadBuffer.matchesText('ad')).toBeFalse();
            expect(typeaheadBuffer.matchesText('a')).toBeFalse();
        });
    });
});
