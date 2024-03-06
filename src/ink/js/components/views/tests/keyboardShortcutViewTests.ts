import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    KeyboardShortcutRegistry,
    KeyboardShortcutRegistryView,
    KeyboardShortcutView,
    craft,
    paint,
} from '../../../index';


suite('components/views/KeyboardShortcutView', () => {
    let registryEl: HTMLElement;
    let registry: KeyboardShortcutRegistry;
    let registryView: KeyboardShortcutRegistryView;

    beforeEach(() => {
        registryEl = document.createElement('div');
        registry = new KeyboardShortcutRegistry();

        registryView = new KeyboardShortcutRegistryView({
            el: registryEl,
            model: registry,
        });
        registryView.render();
    });

    afterEach(() => {
        registryView.remove();
        registryEl.remove();

        registry = null;
        registryEl = null;
        registryView = null;
    });

    describe('Construction', () => {
        it('With keys', () => {
            new KeyboardShortcutView({
                keys: 'Control-Meta-X',
            });
        });

        it('Without keys', () => {
            expect(() => new KeyboardShortcutView()).toThrow(new Error(
                'Ink.KeyboardShortcut is missing a value for option "keys".'
            ));
        });

        it('With onInvoke and registry', () => {
            new KeyboardShortcutView({
                keys: 'Control-Meta-X',
                onInvoke: () => null,
                registry: registry,
            });
        });

        it('With onInvoke="click"', () => {
            const view = new KeyboardShortcutView({
                keys: 'Control-Meta-X',
                onInvoke: 'click',
                registry: registry,
            });

            expect(typeof view['initialComponentState'].options.onInvoke)
                .toBe('function');
        });

        it('With invalid onInvoke', () => {
            expect(
                () => new KeyboardShortcutView({
                    keys: 'Control-Meta-X',
                    registry: registry,

                    // @ts-expect-error: Invalid onInvoke value
                    onInvoke: 123,
                })
            ).toThrow(new Error(
                'Ink.KeyboardShortcut onInvoke must be "click" or a function.'
            ));
        });

        it('With onInvoke, no registry', () => {
            expect(
                () => new KeyboardShortcutView({
                    keys: 'Control-Meta-X',
                    onInvoke: () => null,
                })
            ).toThrow(new Error(
                'Ink.KeyboardShortcut onInvoke and registry must both be ' +
                'set in order to register a shortcut.'
            ));
        });

        it('With registry, no onInvoke', () => {
            expect(
                () => new KeyboardShortcutView({
                    keys: 'Control-Meta-X',
                    registry: registry,
                })
            ).toThrow(new Error(
                'Ink.KeyboardShortcut onInvoke and registry must both be ' +
                'set in order to register a shortcut.'
            ));
        });
    });

    describe('Removing', () => {
        it('With registered shortcut', () => {
            const view = craft<KeyboardShortcutView>`
                <Ink.KeyboardShortcut keys="Control-Meta-X"
                                      registry=${registry}
                                      onInvoke=${() => null}/>
            `;
            expect(registry.getAllShortcuts()).toHaveSize(1);

            view.remove();

            expect(registry.getAllShortcuts()).toHaveSize(0);
        });

        it('Without registered shortcut', () => {
            const view = craft<KeyboardShortcutView>`
                <Ink.KeyboardShortcut keys="Control-Meta-X"/>
            `;
            expect(registry.getAllShortcuts()).toHaveSize(0);

            view.remove();

            expect(registry.getAllShortcuts()).toHaveSize(0);
        });
    });

    describe('Render', () => {
        it('With onInvoke', () => {
            const el = paint<HTMLElement>`
                <Ink.KeyboardShortcut keys="Control-Meta-X"
                                      registry=${registry}
                                      onInvoke=${() => null}/>
            `;

            expect(el.outerHTML).toEqual(
                '<span class="ink-c-keyboard-shortcut"' +
                ' title="Control-Meta-X" aria-label="Control-Meta-X">' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Control</span>' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Meta</span>' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">X</span></span>'
            );

            expect(registry.getAllShortcuts()).toHaveSize(1);
            expect(registry.getShortcut('X', {
                ctrlKey: true,
                metaKey: true,
            })).not.toBeNull();
        });

        it('Without onInvoke', () => {
            const el = paint<HTMLElement>`
                <Ink.KeyboardShortcut keys="Control-Meta-X"/>
            `;

            expect(el.outerHTML).toEqual(
                '<span class="ink-c-keyboard-shortcut"' +
                ' title="Control-Meta-X" aria-label="Control-Meta-X">' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Control</span>' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Meta</span>' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">X</span></span>'
            );

            expect(registry.getAllShortcuts()).toHaveSize(0);
        });

        it('With attachTo', () => {
            const attachEl = document.createElement('div');

            const el = paint<HTMLElement>`
                <Ink.KeyboardShortcut keys="Control-Meta-X"
                                      attachTo=${attachEl}/>
            `;

            expect(el.getAttribute('aria-hidden')).toBe('true');
            expect(attachEl.getAttribute('aria-keyshortcuts'))
                .toBe('Control+Meta+X');
        });
    });

    describe('Methods', () => {
        it('attachTo', () => {
            const attachEl = document.createElement('div');

            const view = craft<KeyboardShortcutView>`
                <Ink.KeyboardShortcut keys="Control-Meta-X"
                                      registry=${registry}
                                      onInvoke=${() => null}/>
            `;
            view.attachTo(attachEl);

            expect(view.el.getAttribute('aria-hidden')).toBe('true');
            expect(attachEl.getAttribute('aria-keyshortcuts'))
                .toBe('Control+Meta+X');
        });
    });
});
