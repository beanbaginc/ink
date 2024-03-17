import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    KeyboardShortcutRegistry,
} from '../keyboardShortcutRegistry';


suite('foundation/models/KeyboardShortcutRegistry', () => {
    let registry: KeyboardShortcutRegistry | null;

    beforeEach(() => {
        registry = new KeyboardShortcutRegistry();
    });

    afterEach(() => {
        registry = null;
    });

    describe('Methods', () => {
        describe('registerShortcut', () => {
            it('Without modifiers', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                const shortcuts = registry['_shortcuts'];
                expect(shortcuts.size).toBe(1);
                expect(shortcuts.get('z-0')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Alt modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    altKey: true,
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                const shortcuts = registry['_shortcuts'];
                expect(shortcuts.size).toBe(1);
                expect(shortcuts.get('z-1')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: true,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Control modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    ctrlKey: true,
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                const shortcuts = registry['_shortcuts'];
                expect(shortcuts.size).toBe(1);
                expect(shortcuts.get('z-2')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: true,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Meta modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    metaKey: true,
                    onInvoke: onInvoke,
                });

                const shortcuts = registry['_shortcuts'];
                expect(shortcuts.size).toBe(1);
                expect(shortcuts.get('z-4')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: true,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Shift modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,
                    shiftKey: true,
                });

                const shortcuts = registry['_shortcuts'];
                expect(shortcuts.size).toBe(1);
                expect(shortcuts.get('z-8')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With all modifiers', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,

                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                });

                const shortcuts = registry['_shortcuts'];
                expect(shortcuts.size).toBe(1);
                expect(shortcuts.get('z-15')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                });
            });

            describe('With conflict', () => {
                it('On active shortcut', () => {
                    function onInvoke1() {}

                    function onInvoke2() {}

                    registry.registerShortcut({
                        key: 'Z',
                        onInvoke: onInvoke1,

                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    });

                    spyOn(console, 'warn');

                    /* Trigger a conflict. */
                    registry.registerShortcut({
                        key: 'Z',
                        onInvoke: onInvoke2,

                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    });

                    expect(console.warn).toHaveBeenCalledWith(
                        'Keyboard shortcut "Alt-Shift-Control-Meta-Z" is ' +
                        'already registered.');

                    const shortcuts = registry['_shortcuts'];
                    expect(shortcuts.size).toBe(1);
                    expect(shortcuts.get('z-15')).toEqual({
                        boundObj: null,
                        key: 'Z',
                        modifiers: {
                            altKey: true,
                            ctrlKey: true,
                            metaKey: true,
                            shiftKey: true,
                        },
                        onInvoke: onInvoke1,
                    });
                });

                it('On expired shortcut', () => {
                    function onInvoke1() {}

                    function onInvoke2() {}

                    let expiredEl = document.createElement('div');

                    registry.registerShortcut({
                        boundObj: expiredEl,
                        key: 'Z',
                        onInvoke: onInvoke1,

                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    });

                    /*
                     * Now remove the element.
                     *
                     * Realistically, this isn't going to be GC'd during this
                     * test, so we're going to need to simulate it with a spy.
                     */
                    expiredEl.remove();
                    expiredEl = null;
                    spyOn(registry as any, '_isExpired')
                        .and.callFake(() => true);

                    spyOn(console, 'warn');

                    /* Trigger a conflict. */
                    registry.registerShortcut({
                        key: 'Z',
                        onInvoke: onInvoke2,

                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    });

                    expect(console.warn).not.toHaveBeenCalled();

                    const shortcuts = registry['_shortcuts'];
                    expect(shortcuts.size).toBe(1);
                    expect(shortcuts.get('z-15')).toEqual({
                        boundObj: null,
                        key: 'Z',
                        modifiers: {
                            altKey: true,
                            ctrlKey: true,
                            metaKey: true,
                            shiftKey: true,
                        },
                        onInvoke: onInvoke2,
                    });
                });
            });
        });

        describe('unregisterShortcut', () => {
            beforeEach(() => {
                spyOn(console, 'warn');
            });

            it('Without modifiers', () => {
                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: () => {},
                });

                registry.unregisterShortcut({
                    key: 'Z',
                });

                expect(registry['_shortcuts'].size).toEqual(0);
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('With Alt modifier', () => {
                registry.registerShortcut({
                    altKey: true,
                    key: 'Z',
                    onInvoke: () => {},
                });

                registry.unregisterShortcut({
                    altKey: true,
                    key: 'Z',
                });

                expect(registry['_shortcuts'].size).toEqual(0);
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('With Control modifier', () => {
                registry.registerShortcut({
                    ctrlKey: true,
                    key: 'Z',
                    onInvoke: () => {},
                });

                registry.unregisterShortcut({
                    ctrlKey: true,
                    key: 'Z',
                });

                expect(registry['_shortcuts'].size).toEqual(0);
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('With Meta modifier', () => {
                registry.registerShortcut({
                    key: 'Z',
                    metaKey: true,
                    onInvoke: () => {},
                });

                registry.unregisterShortcut({
                    key: 'Z',
                    metaKey: true,
                });

                expect(registry['_shortcuts'].size).toEqual(0);
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('With Shift modifier', () => {
                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: () => {},
                    shiftKey: true,
                });

                registry.unregisterShortcut({
                    key: 'Z',
                    shiftKey: true,
                });

                expect(registry['_shortcuts'].size).toEqual(0);
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('With all modifiers', () => {
                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: () => {},

                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                });

                registry.unregisterShortcut({
                    key: 'Z',

                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                });

                expect(registry['_shortcuts'].size).toEqual(0);
                expect(console.warn).not.toHaveBeenCalled();
            });

            it('With not found', () => {
                registry.unregisterShortcut({
                    key: 'Z',

                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                });

                expect(console.warn).toHaveBeenCalledWith(
                    'Keyboard shortcut "Alt-Shift-Control-Meta-Z" is ' +
                    'not registered.');
            });
        });

        describe('getShortcut', () => {
            it('Without modifiers', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                expect(registry.getShortcut('Z')).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Alt modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    altKey: true,
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                expect(registry.getShortcut('Z', {
                    altKey: true,
                })).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: true,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Control modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    ctrlKey: true,
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                expect(registry.getShortcut('Z', {
                    ctrlKey: true,
                })).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: true,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Meta modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    metaKey: true,
                    onInvoke: onInvoke,
                });

                expect(registry.getShortcut('Z', {
                    metaKey: true,
                })).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: true,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With Shift modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,
                    shiftKey: true,
                });

                expect(registry.getShortcut('Z', {
                    shiftKey: true,
                })).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With all modifiers', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,

                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                });

                expect(registry.getShortcut('Z', {
                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                })).toEqual({
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                });
            });

            it('With not found', () => {
                expect(registry.getShortcut('Z', {
                    altKey: true,
                    ctrlKey: true,
                    metaKey: true,
                    shiftKey: true,
                })).toBeNull();
            });
        });

        it('iterator', () => {
            function onInvoke() {}

            registry.registerShortcut({
                key: 'Z',
                onInvoke: onInvoke,

                altKey: true,
                ctrlKey: true,
                metaKey: true,
                shiftKey: true,
            });

            registry.registerShortcut({
                key: 'Z',
                onInvoke: onInvoke,

                shiftKey: true,
            });

            registry.registerShortcut({
                key: 'ArrowUp',
                onInvoke: onInvoke,

                shiftKey: true,
            });

            const boundObj = document.createElement('div');

            registry.registerShortcut({
                boundObj: boundObj,
                key: 'ArrowLeft',
                onInvoke: onInvoke,
            });

            registry.registerShortcut({
                key: 'Escape',
                onInvoke: onInvoke,

                metaKey: true,
            });

            registry.registerShortcut({
                key: '?',
                onInvoke: onInvoke,
            });

            /* Simulate expiration of the bound object. */
            spyOn(registry as any, '_isExpired').and.callFake(
                registeredShortcut => {
                    return registeredShortcut.boundObj?.deref() === boundObj;
                });

            expect([...registry]).toEqual([
                {
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: true,
                        ctrlKey: true,
                        metaKey: true,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                },
                {
                    boundObj: null,
                    key: 'Z',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                },
                {
                    boundObj: null,
                    key: 'ArrowUp',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: true,
                    },
                    onInvoke: onInvoke,
                },
                {
                    boundObj: null,
                    key: 'Escape',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: true,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                },
                {
                    boundObj: null,
                    key: '?',
                    modifiers: {
                        altKey: false,
                        ctrlKey: false,
                        metaKey: false,
                        shiftKey: false,
                    },
                    onInvoke: onInvoke,
                },
            ]);
        });
    });
});
