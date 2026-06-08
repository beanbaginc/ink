/**
 * Unit tests for BadgeView.
 *
 * Version Added:
 *     0.10
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    BadgeType,
    BadgeView,
    paint,
} from '../../../index';


suite('components/views/BadgeView', () => {
    describe('Render', () => {
        it('With label', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge>My Label</Ink.Badge>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-badge" data-type="standard">' +
                '<span class="ink-c-badge__label">My Label</span>' +
                '</span>'
            );
        });

        it('With label and start icon', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge iconStart="ink-i-success">My Label</Ink.Badge>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-badge" data-type="standard">' +
                '<span class="ink-c-badge__icon ink-i-success"' +
                ' aria-hidden="true"></span>' +
                '<span class="ink-c-badge__label">My Label</span>' +
                '</span>'
            );
        });

        it('With label and end icon', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge iconEnd="ink-i-success">My Label</Ink.Badge>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-badge" data-type="standard">' +
                '<span class="ink-c-badge__label">My Label</span>' +
                '<span class="ink-c-badge__icon ink-i-success"' +
                ' aria-hidden="true"></span>' +
                '</span>'
            );
        });

        it('With label and start and end icons', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge iconStart="ink-i-success"
                           iconEnd="ink-i-warning">My Label</Ink.Badge>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-badge" data-type="standard">' +
                '<span class="ink-c-badge__icon ink-i-success"' +
                ' aria-hidden="true"></span>' +
                '<span class="ink-c-badge__label">My Label</span>' +
                '<span class="ink-c-badge__icon ink-i-warning"' +
                ' aria-hidden="true"></span>' +
                '</span>'
            );
        });

        it('Without a label', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge/>
            `;

            expect(el.outerHTML).toBe(
                '<span class="ink-c-badge" data-type="standard">' +
                '<span class="ink-c-badge__label"></span>' +
                '</span>'
            );
        });

        describe('With type', () => {
            for (const type of Object.values(BadgeType)) {
                it(`type=${type}`, () => {
                    const el = paint<HTMLSpanElement>`
                        <Ink.Badge type=${type}>My Label</Ink.Badge>
                    `;

                    expect(el.getAttribute('data-type')).toBe(type);
                });
            }
        });
    });

    describe('setComponentChildren', () => {
        it('With multiple children', () => {
            const badge = new BadgeView();

            expect(() => badge.setComponentChildren(['a', 'b'])).toThrow(
                new Error(
                    'Ink.Badge can only accept a single string child as a ' +
                    'label.'
                ));
        });
    });

    describe('Passthrough', () => {
        it('With class', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge class="custom-badge">My Label</Ink.Badge>
            `;

            expect(el.classList.contains('ink-c-badge')).toBeTrue();
            expect(el.classList.contains('custom-badge')).toBeTrue();
        });

        it('With style', () => {
            const el = paint<HTMLSpanElement>`
                <Ink.Badge style="color: red">My Label</Ink.Badge>
            `;

            expect(el.style.color).toBe('red');
        });
    });
});
