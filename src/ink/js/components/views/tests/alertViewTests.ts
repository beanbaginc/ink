import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    AlertView,
    craft,
    paint,
} from '../../../index';


suite('components/views/AlertView', () => {
    describe('Render', () => {
        it('canClose=true', () => {
            const el = paint<HTMLElement>`
                <Ink.Alert canClose>
                 <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                </Ink.Alert>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-alert" data-type="standard"' +
                ' role="status">' +
                '<span class="ink-c-alert__close" role="button"' +
                ' title="Close" aria-label="Close" tabindex="0"></span>' +
                '<div class="ink-c-alert__content">' +
                '<h3 class="ink-c-alert__heading">Heading</h3>' +
                '</div>' +
                '</div>'
            );
        });

        it('important=true', () => {
            const el = paint<HTMLElement>`
                <Ink.Alert important>
                 <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                </Ink.Alert>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-alert" data-type="standard"' +
                ' role="alert">' +
                '<div class="ink-c-alert__content">' +
                '<h3 class="ink-c-alert__heading">Heading</h3>' +
                '</div>' +
                '</div>'
            );
        });

        it('Actions', () => {
            const el = paint<HTMLElement>`
                <Ink.Alert>
                 <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                 <Ink.Alert.Actions>
                  <Ink.Button>Button 1</Ink.Button>
                  <Ink.Button>Button 2</Ink.Button>
                  <Ink.Button>Button 3</Ink.Button>
                 </Ink.Actions>
                </Ink.Alert>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-alert" data-type="standard"' +
                ' role="status">' +
                '<div class="ink-c-alert__content">' +
                '<h3 class="ink-c-alert__heading">Heading</h3>' +
                '<div class="ink-c-alert__actions">' +
                '<button class="ink-c-button" type="button">' +
                'Button 1</button>' +
                '<button class="ink-c-button" type="button">' +
                'Button 2</button>' +
                '<button class="ink-c-button" type="button">' +
                'Button 3</button>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        });

        it('Content', () => {
            const el = paint<HTMLElement>`
                <Ink.Alert>
                 <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                 <Ink.Alert.Content>
                  <p>hello</p>
                  <table>
                   <tr>
                    <td>
                     world
                    </td>
                   </tr>
                  </table>
                 </Ink.Content>
                </Ink.Alert>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-alert" data-type="standard"' +
                ' role="status">' +
                '<div class="ink-c-alert__content">' +
                '<h3 class="ink-c-alert__heading">Heading</h3>' +
                '<div class="ink-c-alert__body">' +
                '<p>hello</p>' +
                '<table><tr><td>world</td></tr></table>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        });

        it('Complex', () => {
            const el = paint<HTMLElement>`
                <Ink.Alert important canClose type="error">
                 <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                 <Ink.Alert.Content>
                  <p>hello</p>
                  <table>
                   <tr>
                    <td>
                     world
                    </td>
                   </tr>
                  </table>
                 </Ink.Content>
                 <Ink.Alert.Actions>
                  <Ink.Button>Button 1</Ink.Button>
                  <Ink.Button>Button 2</Ink.Button>
                  <Ink.Button>Button 3</Ink.Button>
                 </Ink.Actions>
                </Ink.Alert>
            `;

            expect(el.outerHTML).toBe(
                '<div class="ink-c-alert" data-type="error"' +
                ' role="alert">' +
                '<span class="ink-c-alert__close" role="button"' +
                ' title="Close" aria-label="Close" tabindex="0"></span>' +
                '<div class="ink-c-alert__content">' +
                '<h3 class="ink-c-alert__heading">Heading</h3>' +
                '<div class="ink-c-alert__body">' +
                '<p>hello</p>' +
                '<table><tr><td>world</td></tr></table>' +
                '</div>' +
                '<div class="ink-c-alert__actions">' +
                '<button class="ink-c-button" type="button">' +
                'Button 1</button>' +
                '<button class="ink-c-button" type="button">' +
                'Button 2</button>' +
                '<button class="ink-c-button" type="button">' +
                'Button 3</button>' +
                '</div>' +
                '</div>' +
                '</div>'
            );
        });

        describe('Types', () => {
            it('Default', () => {
                const el = paint<HTMLElement>`
                    <Ink.Alert>
                     <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                    </Ink.Alert>
                `;

                expect(el.outerHTML).toBe(
                    '<div class="ink-c-alert" data-type="standard"' +
                    ' role="status">' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading">Heading</h3>' +
                    '</div>' +
                    '</div>'
                );
            });

            it('Standard', () => {
                const el = paint<HTMLElement>`
                    <Ink.Alert type="standard">
                     <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                    </Ink.Alert>
                `;

                expect(el.outerHTML).toBe(
                    '<div class="ink-c-alert" data-type="standard"' +
                    ' role="status">' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading">Heading</h3>' +
                    '</div>' +
                    '</div>'
                );
            });

            it('Error', () => {
                const el = paint<HTMLElement>`
                    <Ink.Alert type="error">
                     <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                    </Ink.Alert>
                `;

                expect(el.outerHTML).toBe(
                    '<div class="ink-c-alert" data-type="error"' +
                    ' role="status">' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading">Heading</h3>' +
                    '</div>' +
                    '</div>'
                );
            });

            it('Info', () => {
                const el = paint<HTMLElement>`
                    <Ink.Alert type="info">
                     <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                    </Ink.Alert>
                `;

                expect(el.outerHTML).toBe(
                    '<div class="ink-c-alert" data-type="info"' +
                    ' role="status">' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading">Heading</h3>' +
                    '</div>' +
                    '</div>'
                );
            });

            it('Success', () => {
                const el = paint<HTMLElement>`
                    <Ink.Alert type="success">
                     <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                    </Ink.Alert>
                `;

                expect(el.outerHTML).toBe(
                    '<div class="ink-c-alert" data-type="success"' +
                    ' role="status">' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading">Heading</h3>' +
                    '</div>' +
                    '</div>'
                );
            });

            it('Warning', () => {
                const el = paint<HTMLElement>`
                    <Ink.Alert type="warning">
                     <Ink.Alert.Heading>Heading</Ink.Alert.Heading>
                    </Ink.Alert>
                `;

                expect(el.outerHTML).toBe(
                    '<div class="ink-c-alert" data-type="warning"' +
                    ' role="status">' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading">Heading</h3>' +
                    '</div>' +
                    '</div>'
                );
            });
        });
    });

    describe('Events', () => {
        describe('Close', () => {
            it('Default', () => {
                const el = paint<HTMLElement>`
                    <div><Ink.Alert canClose/></div>
                `;

                expect(el.outerHTML).toBe(
                    '<div>' +
                    '<div class="ink-c-alert" data-type="standard"' +
                    ' role="status">' +
                    '<span class="ink-c-alert__close" role="button"' +
                    ' title="Close" aria-label="Close" tabindex="0"></span>' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading"></h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );

                el.querySelector<HTMLElement>('.ink-c-alert__close').click();

                expect(el.outerHTML).toBe('<div></div>');
            });

            it('With onClose callback', () => {
                const onClose = jasmine.createSpy('onClose');
                const el = paint<HTMLElement>`
                    <div><Ink.Alert canClose onClose=${onClose}/></div>
                `;

                expect(el.outerHTML).toBe(
                    '<div>' +
                    '<div class="ink-c-alert" data-type="standard"' +
                    ' role="status">' +
                    '<span class="ink-c-alert__close" role="button"' +
                    ' title="Close" aria-label="Close" tabindex="0"></span>' +
                    '<div class="ink-c-alert__content">' +
                    '<h3 class="ink-c-alert__heading"></h3>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                );

                el.querySelector<HTMLElement>('.ink-c-alert__close').click();

                expect(el.outerHTML).toBe('<div></div>');
                expect(onClose).toHaveBeenCalled();
            });
        });
    });
});
