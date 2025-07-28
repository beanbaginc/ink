/**
 * Unit tests for ButtonGroupView.
 *
 * Version Added:
 *     0.5
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    ButtonGroupView,
    Orientation,
    craft,
    paint,
} from '../../../index';


suite('components/views/ButtonGroupView', () => {
    describe('Render', () => {
        it('Default', () => {
            const el = paint<HTMLElement>`
                <Ink.ButtonGroup>
                 <Ink.Button>Button 1</Ink.Button>
                 <Ink.Button>Button 2</Ink.Button>
                 <Ink.Button>Button 3</Ink.Button>
                </Ink.ButtonGroup>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-button-group" role="group"' +
                ' aria-orientation="horizontal">' +
                '<button class="ink-c-button"' +
                ' type="button">Button 1</button>' +
                '<button class="ink-c-button"' +
                ' type="button">Button 2</button>' +
                '<button class="ink-c-button"' +
                ' type="button">Button 3</button>' +
                '</div>'
            );
        });

        it('Horizontal', () => {
            const el = paint<HTMLElement>`
                <Ink.ButtonGroup orientation="horizontal">
                 <Ink.Button>Button 1</Ink.Button>
                 <Ink.Button>Button 2</Ink.Button>
                 <Ink.Button>Button 3</Ink.Button>
                </Ink.ButtonGroup>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-button-group" role="group"' +
                ' aria-orientation="horizontal">' +
                '<button class="ink-c-button"' +
                ' type="button">Button 1</button>' +
                '<button class="ink-c-button"' +
                ' type="button">Button 2</button>' +
                '<button class="ink-c-button"' +
                ' type="button">Button 3</button>' +
                '</div>'
            );
        });

        it('Vertical', () => {
            const el = paint<HTMLElement>`
                <Ink.ButtonGroup orientation="vertical">
                 <Ink.Button>Button 1</Ink.Button>
                 <Ink.Button>Button 2</Ink.Button>
                 <Ink.Button>Button 3</Ink.Button>
                </Ink.ButtonGroup>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-button-group" role="group"' +
                ' aria-orientation="vertical">' +
                '<button class="ink-c-button"' +
                ' type="button">Button 1</button>' +
                '<button class="ink-c-button"' +
                ' type="button">Button 2</button>' +
                '<button class="ink-c-button"' +
                ' type="button">Button 3</button>' +
                '</div>'
            );
        });
    });

    describe('Properties', () => {
        describe('orientation', () => {
            it('Changing to horizontal', () => {
                const buttonGroup = craft<ButtonGroupView>`
                    <Ink.ButtonGroup orientation="vertical">
                     <Ink.Button>Button 1</Ink.Button>
                     <Ink.Button>Button 2</Ink.Button>
                     <Ink.Button>Button 3</Ink.Button>
                    </Ink.ButtonGroup>
                `;

                expect(buttonGroup.orientation).toBe(Orientation.VERTICAL);

                buttonGroup.orientation = Orientation.HORIZONTAL;

                expect(buttonGroup.orientation).toBe(Orientation.HORIZONTAL);

                expect(buttonGroup.el.outerHTML).toBe(
                    '<div class="ink-c-button-group" role="group"' +
                    ' aria-orientation="horizontal">' +
                    '<button class="ink-c-button" type="button">' +
                    'Button 1</button>' +
                    '<button class="ink-c-button" type="button">' +
                    'Button 2</button>' +
                    '<button class="ink-c-button" type="button">' +
                    'Button 3</button>' +
                    '</div>'
                );
            });

            it('Changing to vertical', () => {
                const buttonGroup = craft<ButtonGroupView>`
                    <Ink.ButtonGroup>
                     <Ink.Button>Button 1</Ink.Button>
                     <Ink.Button>Button 2</Ink.Button>
                     <Ink.Button>Button 3</Ink.Button>
                    </Ink.ButtonGroup>
                `;

                expect(buttonGroup.orientation).toBe(Orientation.HORIZONTAL);

                buttonGroup.orientation = Orientation.VERTICAL;

                expect(buttonGroup.orientation).toBe(Orientation.VERTICAL);

                expect(buttonGroup.el.outerHTML).toBe(
                    '<div class="ink-c-button-group" role="group"' +
                    ' aria-orientation="vertical">' +
                    '<button class="ink-c-button" type="button">' +
                    'Button 1</button>' +
                    '<button class="ink-c-button" type="button">' +
                    'Button 2</button>' +
                    '<button class="ink-c-button" type="button">' +
                    'Button 3</button>' +
                    '</div>'
                );
            });
        });
    });
});
