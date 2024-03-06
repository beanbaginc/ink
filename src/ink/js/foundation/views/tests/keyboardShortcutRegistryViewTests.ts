import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    KeyboardShortcutRegistry,
} from '../../models/keyboardShortcutRegistry';
import {
    KeyboardShortcutRegistryView,
} from '../keyboardShortcutRegistryView';


suite('foundation/views/KeyboardShortcutRegistryView', () => {
    let el: HTMLElement | null;
    let childEl: HTMLElement | null;
    let registry: KeyboardShortcutRegistry | null;
    let registryView: KeyboardShortcutRegistryView | null;

    beforeEach(() => {
        el = document.createElement('div');

        childEl = document.createElement('div');
        el.appendChild(childEl);

        registry = new KeyboardShortcutRegistry();
        registryView = new KeyboardShortcutRegistryView({
            el: el,
            model: registry,
        });
        registryView.render();
    });

    afterEach(() => {
        if (registryView) {
            registryView.remove();
        }

        if (el) {
            el.remove();
        }

        childEl = null;
        el = null;
        registry = null;
        registryView = null;
    });

    describe('Construction', () => {
        it('Registers the view', () => {
            expect(KeyboardShortcutRegistryView.registryViews.get(el))
                .toBe(registryView);
        });
    });

    describe('Removal', () => {
        it('Unregisters the view', () => {
            registryView.remove();
            registryView = null;

            expect(KeyboardShortcutRegistryView.registryViews.get(el))
                .toBeUndefined();
        });
    });

    describe('Events', () => {
        it('On registry element', () => {
            const onInvoke1 = jasmine.createSpy('onInvoke1');
            const onInvoke2 = jasmine.createSpy('onInvoke2');
            const onInvoke3 = jasmine.createSpy('onInvoke3');
            const onInvoke4 = jasmine.createSpy('onInvoke4');

            /* These should not be invoked. */
            registry.registerShortcut({
                key: 'ArrowDown',
                onInvoke: onInvoke1,
            });

            registry.registerShortcut({
                key: 'ArrowDown',
                onInvoke: onInvoke2,

                altKey: true,
                shiftKey: true,
            });

            registry.registerShortcut({
                key: 'ArrowUp',
                onInvoke: onInvoke3,
                shiftKey: true,
            });

            /* This one should be. */
            registry.registerShortcut({
                key: 'ArrowDown',
                onInvoke: onInvoke4,
                shiftKey: true,
            });

            const triggeredDefault =
                el.dispatchEvent(new window.KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,

                    key: 'ArrowDown',

                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                }));

            expect(triggeredDefault).toBeFalse();

            expect(onInvoke1).not.toHaveBeenCalled();
            expect(onInvoke2).not.toHaveBeenCalled();
            expect(onInvoke3).not.toHaveBeenCalled();
            expect(onInvoke4).toHaveBeenCalled();
        });

        it('On child element', () => {
            const onInvoke1 = jasmine.createSpy('onInvoke1');
            const onInvoke2 = jasmine.createSpy('onInvoke2');
            const onInvoke3 = jasmine.createSpy('onInvoke3');
            const onInvoke4 = jasmine.createSpy('onInvoke4');

            /* These should not be invoked. */
            registry.registerShortcut({
                key: 'ArrowDown',
                onInvoke: onInvoke1,
            });

            registry.registerShortcut({
                key: 'ArrowDown',
                onInvoke: onInvoke2,

                altKey: true,
                shiftKey: true,
            });

            registry.registerShortcut({
                key: 'ArrowUp',
                onInvoke: onInvoke3,
                shiftKey: true,
            });

            /* This one should be. */
            registry.registerShortcut({
                key: 'ArrowDown',
                onInvoke: onInvoke4,
                shiftKey: true,
            });

            const triggeredDefault =
                childEl.dispatchEvent(new window.KeyboardEvent('keydown', {
                    bubbles: true,
                    cancelable: true,

                    key: 'ArrowDown',

                    altKey: false,
                    ctrlKey: false,
                    metaKey: false,
                    shiftKey: true,
                }));

            expect(triggeredDefault).toBeFalse();

            expect(onInvoke1).not.toHaveBeenCalled();
            expect(onInvoke2).not.toHaveBeenCalled();
            expect(onInvoke3).not.toHaveBeenCalled();
            expect(onInvoke4).toHaveBeenCalled();
        });
    });

    describe('Methods', () => {
        describe('findNearestRegistryView', () => {
            it('On element', () => {
                expect(
                    KeyboardShortcutRegistryView.findNearestRegistryView(el)
                ).toBe(registryView);
            });

            it('On child element', () => {
                expect(
                    KeyboardShortcutRegistryView
                    .findNearestRegistryView(childEl)
                ).toBe(registryView);
            });

            it('Not found', () => {
                const emptyEl = document.createElement('div');

                expect(
                    KeyboardShortcutRegistryView
                    .findNearestRegistryView(emptyEl)
                ).toBeNull();
            });
        });

        describe('findNearestRegistry', () => {
            it('On element', () => {
                expect(
                    KeyboardShortcutRegistryView.findNearestRegistry(el)
                ).toBe(registry);
            });

            it('On child element', () => {
                expect(
                    KeyboardShortcutRegistryView
                    .findNearestRegistry(childEl)
                ).toBe(registry);
            });

            it('Not found', () => {
                const emptyEl = document.createElement('div');

                expect(
                    KeyboardShortcutRegistryView
                    .findNearestRegistry(emptyEl)
                ).toBeNull();
            });
        });
    });
});
