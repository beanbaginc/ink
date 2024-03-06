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

                expect(registry['_shortcuts']).toEqual({
                    'z-0': {
                        key: 'Z',
                        modifiers: {
                            altKey: false,
                            ctrlKey: false,
                            metaKey: false,
                            shiftKey: false,
                        },
                        onInvoke: onInvoke,
                    },
                });
            });

            it('With Alt modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    altKey: true,
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                expect(registry['_shortcuts']).toEqual({
                    'z-1': {
                        key: 'Z',
                        modifiers: {
                            altKey: true,
                            ctrlKey: false,
                            metaKey: false,
                            shiftKey: false,
                        },
                        onInvoke: onInvoke,
                    },
                });
            });

            it('With Control modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    ctrlKey: true,
                    key: 'Z',
                    onInvoke: onInvoke,
                });

                expect(registry['_shortcuts']).toEqual({
                    'z-2': {
                        key: 'Z',
                        modifiers: {
                            altKey: false,
                            ctrlKey: true,
                            metaKey: false,
                            shiftKey: false,
                        },
                        onInvoke: onInvoke,
                    },
                });
            });

            it('With Meta modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    metaKey: true,
                    onInvoke: onInvoke,
                });

                expect(registry['_shortcuts']).toEqual({
                    'z-4': {
                        key: 'Z',
                        modifiers: {
                            altKey: false,
                            ctrlKey: false,
                            metaKey: true,
                            shiftKey: false,
                        },
                        onInvoke: onInvoke,
                    },
                });
            });

            it('With Shift modifier', () => {
                function onInvoke() {}

                registry.registerShortcut({
                    key: 'Z',
                    onInvoke: onInvoke,
                    shiftKey: true,
                });

                expect(registry['_shortcuts']).toEqual({
                    'z-8': {
                        key: 'Z',
                        modifiers: {
                            altKey: false,
                            ctrlKey: false,
                            metaKey: false,
                            shiftKey: true,
                        },
                        onInvoke: onInvoke,
                    },
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

                expect(registry['_shortcuts']).toEqual({
                    'z-15': {
                        key: 'Z',
                        modifiers: {
                            altKey: true,
                            ctrlKey: true,
                            metaKey: true,
                            shiftKey: true,
                        },
                        onInvoke: onInvoke,
                    },
                });
            });

            it('With conflict', () => {
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

                expect(registry['_shortcuts']).toEqual({
                    'z-15': {
                        key: 'Z',
                        modifiers: {
                            altKey: true,
                            ctrlKey: true,
                            metaKey: true,
                            shiftKey: true,
                        },
                        onInvoke: onInvoke1,
                    },
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

                expect(registry['_shortcuts']).toEqual({});
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

                expect(registry['_shortcuts']).toEqual({});
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

                expect(registry['_shortcuts']).toEqual({});
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

                expect(registry['_shortcuts']).toEqual({});
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

                expect(registry['_shortcuts']).toEqual({});
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

                expect(registry['_shortcuts']).toEqual({});
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

        it('getAllShortcuts', () => {
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

            registry.registerShortcut({
                key: 'Escape',
                onInvoke: onInvoke,

                metaKey: true,
            });

            registry.registerShortcut({
                key: '?',
                onInvoke: onInvoke,
            });

            expect(registry.getAllShortcuts()).toEqual([
                {
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
