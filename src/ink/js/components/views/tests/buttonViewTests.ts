/**
 * Unit tests for ButtonView.
 *
 * Version Added:
 *     1.0
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    ButtonType,
    ButtonView,
    KeyboardShortcutRegistry,
    craft,
    paint,
} from '../../../index';


suite('components/views/ButtonView', () => {
    describe('Render', () => {
        describe('With tagName="button"', () => {
            it('With label', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button>My Label</Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" type="button">' +
                    'My Label</button>'
                );
            });

            it('With label and icon', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button iconName="ink-i-success">My Label</Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" type="button">' +
                    '<span class="ink-c-button__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '<label class="ink-c-button__label">My Label</label>' +
                    '</button>'
                );
            });

            it('With icon only', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button iconName="ink-i-success"/>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" type="button">' +
                    '<span class="ink-c-button__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '</button>'
                );
            });

            describe('With keyboard shortcuts', () => {
                it('And showKeyboardShortcut=true', () => {
                    const registry = new KeyboardShortcutRegistry();

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button keyboardShortcut="Control-Alt-Delete"
                                    keyboardShortcutRegistry=${registry}
                                    showKeyboardShortcut>
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button"' +
                        ' aria-keyshortcuts="Control+Alt+Delete"' +
                        ' type="button">' +
                        '<label class="ink-c-button__label">My Label</label>' +
                        '<span class="ink-c-keyboard-shortcut' +
                        ' ink-c-button__keyboard-shortcut"' +
                        ' title="Control-Alt-Delete"' +
                        ' aria-label="Control-Alt-Delete"' +
                        ' aria-hidden="true">' +
                        '<span class="ink-c-keyboard-shortcut__key"' +
                        ' aria-hidden="true">Control</span>' +
                        '<span class="ink-c-keyboard-shortcut__key"' +
                        ' aria-hidden="true">Alt</span>' +
                        '<span class="ink-c-keyboard-shortcut__key"' +
                        ' aria-hidden="true">Delete</span>' +
                        '</span>' +
                        '</button>'
                    );
                });

                it('And showKeyboardShortcut=false', () => {
                    const registry = new KeyboardShortcutRegistry();

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button keyboardShortcut="Control-Alt-Delete"
                                    keyboardShortcutRegistry=${registry}>
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button"' +
                        ' aria-keyshortcuts="Control+Alt+Delete"' +
                        ' type="button">My Label</button>'
                    );
                });
            });

            describe('With type', () => {
                it('standard', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button type="standard">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Label</button>'
                    );
                });

                it('primary', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button type="primary">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button -is-primary"' +
                        ' type="button">' +
                        'My Label</button>'
                    );
                });

                it('submit', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button type="submit">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button" type="submit">' +
                        'My Label</button>'
                    );
                });

                it('danger', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button type="danger">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button -is-danger"' +
                        ' type="button">' +
                        'My Label</button>'
                    );
                });

                it('reset', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button type="reset">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<button class="ink-c-button" type="reset">' +
                        'My Label</button>'
                    );
                });
            });

            it('With attrs', () => {
                const attrs: Partial<HTMLButtonElement> = {
                    formMethod: 'post',
                    formNoValidate: true,
                }

                const el = paint<HTMLButtonElement>`
                    <Ink.Button attrs=${attrs}>
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" formnovalidate=""' +
                    ' type="button">' +
                    'My Label</button>'
                );
                expect(el.formMethod).toBe('post');
                expect(el.formNoValidate).toBe(true);
            });

            it('With autofocus', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button autofocus>
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" autofocus=""' +
                    ' type="button">My Label</button>'
                );
            });

            it('With busy', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button busy>
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" aria-busy="true"' +
                    ' type="button">My Label</button>'
                );
            });

            it('With disabled', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button disabled>
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<button class="ink-c-button" disabled="" type="button">' +
                    'My Label</button>'
                );
            });
        });

        describe('With tagName="a"', () => {
            it('With label', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button tagName="a">My Label</Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<a class="ink-c-button" role="button">My Label</a>'
                );
            });

            it('With label and icon', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button tagName="a"
                                iconName="ink-i-success">
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<a class="ink-c-button" role="button">' +
                    '<span class="ink-c-button__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '<label class="ink-c-button__label">My Label</label>' +
                    '</a>'
                );
            });

            it('With icon only', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button tagName="a" iconName="ink-i-success"/>
                `;

                expect(el.outerHTML).toBe(
                    '<a class="ink-c-button" role="button">' +
                    '<span class="ink-c-button__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '</a>'
                );
            });

            describe('With keyboard shortcuts', () => {
                it('And showKeyboardShortcut=true', () => {
                    const registry = new KeyboardShortcutRegistry();

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a"
                                    keyboardShortcut="Control-Alt-Delete"
                                    keyboardShortcutRegistry=${registry}
                                    showKeyboardShortcut>
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button"' +
                        ' aria-keyshortcuts="Control+Alt+Delete">' +
                        '<label class="ink-c-button__label">My Label</label>' +
                        '<span class="ink-c-keyboard-shortcut' +
                        ' ink-c-button__keyboard-shortcut"' +
                        ' title="Control-Alt-Delete"' +
                        ' aria-label="Control-Alt-Delete"' +
                        ' aria-hidden="true">' +
                        '<span class="ink-c-keyboard-shortcut__key"' +
                        ' aria-hidden="true">Control</span>' +
                        '<span class="ink-c-keyboard-shortcut__key"' +
                        ' aria-hidden="true">Alt</span>' +
                        '<span class="ink-c-keyboard-shortcut__key"' +
                        ' aria-hidden="true">Delete</span>' +
                        '</span>' +
                        '</a>'
                    );
                });

                it('And showKeyboardShortcut=false', () => {
                    const registry = new KeyboardShortcutRegistry();

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a"
                                    keyboardShortcut="Control-Alt-Delete"
                                    keyboardShortcutRegistry=${registry}>
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button"' +
                        ' aria-keyshortcuts="Control+Alt+Delete">' +
                        'My Label</a>'
                    );
                });
            });

            describe('With type', () => {
                it('standard', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a" type="standard">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">' +
                        'My Label</a>'
                    );
                });

                it('primary', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a" type="primary">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button -is-primary" role="button">' +
                        'My Label</a>'
                    );
                });

                it('submit', () => {
                    spyOn(console, 'warn');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a" type="submit">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">My Label</a>'
                    );
                    expect(console.warn).toHaveBeenCalledWith(
                        'Button type "submit" is not valid for button links ' +
                        '(tagName="a").'
                    );
                });

                it('danger', () => {
                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a" type="danger">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button -is-danger" role="button">' +
                        'My Label</a>'
                    );
                });

                it('reset', () => {
                    spyOn(console, 'warn');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button tagName="a" type="reset">
                         My Label
                        </Ink.Button>
                    `;

                    expect(el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">My Label</a>'
                    );
                    expect(console.warn).toHaveBeenCalledWith(
                        'Button type "reset" is not valid for button links ' +
                        '(tagName="a").'
                    );
                });
            });

            it('With busy', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button tagName="a" busy>
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<a class="ink-c-button" role="button" aria-busy="true">' +
                    'My Label</a>'
                );
            });

            it('With disabled', () => {
                const el = paint<HTMLButtonElement>`
                    <Ink.Button tagName="a" disabled>
                     My Label
                    </Ink.Button>
                `;

                expect(el.outerHTML).toBe(
                    '<a class="ink-c-button -is-disabled" role="button">' +
                    'My Label</a>'
                );
            });
        });
    });

    describe('Click Event', () => {
        it('onClick Handler', () => {
            const onClick = jasmine.createSpy('onClick');

            const el = paint<HTMLButtonElement>`
                <Ink.Button onClick=${onClick}>
                 My Label
                </Ink.Button>
            `;

            el.click();

            expect(onClick).toHaveBeenCalled();
        });

        describe('DOM click event', () => {
            describe('When enabled', () => {
                it('With onClick', () => {
                    const onClick1 = jasmine.createSpy('onClick1');
                    const onClick2 = jasmine.createSpy('onClick2');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button onClick=${onClick1}>
                         My Label
                        </Ink.Button>
                    `;

                    el.addEventListener('click', onClick2);

                    el.click();

                    expect(onClick1).toHaveBeenCalled();
                    expect(onClick2).not.toHaveBeenCalled();
                });

                it('Without onClick', () => {
                    const onClick = jasmine.createSpy('onClick');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button>
                         My Label
                        </Ink.Button>
                    `;

                    el.addEventListener('click', onClick);

                    el.click();

                    expect(onClick).toHaveBeenCalled();
                });
            });

            describe('When busy', () => {
                it('With onClick', () => {
                    const onClick1 = jasmine.createSpy('onClick1');
                    const onClick2 = jasmine.createSpy('onClick2');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button busy onClick=${onClick1}>
                         My Label
                        </Ink.Button>
                    `;

                    el.addEventListener('click', onClick2);

                    el.click();

                    expect(onClick1).not.toHaveBeenCalled();
                    expect(onClick2).not.toHaveBeenCalled();
                });

                it('Without onClick', () => {
                    const onClick = jasmine.createSpy('onClick');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button busy>
                         My Label
                        </Ink.Button>
                    `;

                    el.addEventListener('click', onClick);

                    el.click();

                    expect(onClick).not.toHaveBeenCalled();
                });
            });

            describe('When disabled', () => {
                it('With onClick', () => {
                    const onClick1 = jasmine.createSpy('onClick1');
                    const onClick2 = jasmine.createSpy('onClick2');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button disabled onClick=${onClick1}>
                         My Label
                        </Ink.Button>
                    `;

                    el.addEventListener('click', onClick2);

                    el.click();

                    expect(onClick1).not.toHaveBeenCalled();
                    expect(onClick2).not.toHaveBeenCalled();
                });

                it('Without onClick', () => {
                    const onClick = jasmine.createSpy('onClick');

                    const el = paint<HTMLButtonElement>`
                        <Ink.Button disabled>
                         My Label
                        </Ink.Button>
                    `;

                    el.addEventListener('click', onClick);

                    el.click();

                    expect(onClick).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('Properties', () => {
        describe('busy', () => {
            describe('Set to true', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.busy).toBeFalse();

                    button.busy = true;

                    expect(button.busy).toBeTrue();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button"' +
                        ' aria-busy="true">My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.busy).toBeFalse();

                    button.busy = true;

                    expect(button.busy).toBeTrue();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button"' +
                        ' aria-busy="true">My Label</button>'
                    );
                });
            });

            describe('Set to false', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" busy>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.busy).toBeTrue();

                    button.busy = false;

                    expect(button.busy).toBeFalse();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">' +
                        'My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button busy>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.busy).toBeTrue();

                    button.busy = false;

                    expect(button.busy).toBeFalse();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Label</button>'
                    );
                });
            });
        });

        describe('autofocus', () => {
            it('Set to true', () => {
                const button = craft<ButtonView>`
                    <Ink.Button>
                     My Label
                    </Ink.Button>
                `;

                expect(button.autofocus).toBeFalse();

                button.autofocus = true;

                expect(button.autofocus).toBeTrue();

                expect(button.el.outerHTML).toBe(
                    '<button class="ink-c-button" type="button"' +
                    ' autofocus="">' +
                    'My Label</button>'
                );
            });

            it('Set to false', () => {
                const button = craft<ButtonView>`
                    <Ink.Button autofocus>
                     My Label
                    </Ink.Button>
                `;

                expect(button.autofocus).toBeTrue();

                button.autofocus = false;

                expect(button.autofocus).toBeFalse();

                expect(button.el.outerHTML).toBe(
                    '<button class="ink-c-button" type="button">' +
                    'My Label</button>'
                );
            });
        });

        describe('disabled', () => {
            describe('Set to true', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.disabled).toBeFalse();

                    button.disabled = true;

                    expect(button.disabled).toBeTrue();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button -is-disabled" role="button">' +
                        'My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.disabled).toBeFalse();

                    button.disabled = true;

                    expect(button.disabled).toBeTrue();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button"' +
                        ' disabled="">' +
                        'My Label</button>'
                    );
                });
            });

            describe('Set to false', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" disabled>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.disabled).toBeTrue();

                    button.disabled = false;

                    expect(button.disabled).toBeFalse();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">' +
                        'My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button disabled>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.disabled).toBeTrue();

                    button.disabled = false;

                    expect(button.disabled).toBeFalse();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Label</button>'
                    );
                });
            });
        });

        describe('href', () => {
            describe('Set to a value', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.href).toBeNull();

                    button.href = '/target/';

                    expect(button.href).toBe('/target/');

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button"' +
                        ' href="/target/">My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    spyOn(console, 'warn');

                    const button = craft<ButtonView>`
                        <Ink.Button>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.href).toBeNull();

                    button.href = '/target/';

                    expect(button.href).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Label</button>'
                    );
                    expect(console.warn).toHaveBeenCalledWith(
                        'href is not valid for button links (tagName="a").'
                    );
                });
            });

            describe('Set to false', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" href="/target/">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.href).toBe('/target/');

                    button.href = null;

                    expect(button.href).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    spyOn(console, 'warn');

                    const button = craft<ButtonView>`
                        <Ink.Button iconName="ink-i-success">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.iconName).toBe('ink-i-success');

                    button.iconName = null;

                    expect(button.iconName).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Label</button>'
                    );
                    expect(console.warn).not.toHaveBeenCalled();
                });
            });
        });

        describe('iconName', () => {
            describe('Set to a value', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.iconName).toBeNull();

                    button.iconName = 'ink-i-success';

                    expect(button.iconName).toBe('ink-i-success');

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">' +
                        '<span class="ink-c-button__icon ink-i-success"' +
                        ' aria-hidden="true"></span>' +
                        '<label class="ink-c-button__label">My Label</label>' +
                        '</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button>
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.iconName).toBeNull();

                    button.iconName = 'ink-i-success';

                    expect(button.iconName).toBe('ink-i-success');

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        '<span class="ink-c-button__icon ink-i-success"' +
                        ' aria-hidden="true"></span>' +
                        '<label class="ink-c-button__label">My Label</label>' +
                        '</button>'
                    );
                });
            });

            describe('Set to null', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" iconName="ink-i-success">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.iconName).toBe('ink-i-success');

                    button.iconName = null;

                    expect(button.iconName).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">My Label</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button iconName="ink-i-success">
                         My Label
                        </Ink.Button>
                    `;

                    expect(button.iconName).toBe('ink-i-success');

                    button.iconName = null;

                    expect(button.iconName).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Label</button>'
                    );
                });
            });
        });

        describe('label', () => {
            describe('Set to a value', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a"/>
                    `;

                    expect(button.label).toBeNull();

                    button.label = 'My Button';

                    expect(button.label).toBe('My Button');

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">My Button</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`<Ink.Button/>`;

                    expect(button.label).toBeNull();

                    button.label = 'My Button';

                    expect(button.label).toBe('My Button');

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Button</button>'
                    );
                });
            });

            describe('Unset', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a">
                         My Button
                        </Ink.Button>
                    `;

                    expect(button.label).toBe('My Button');

                    button.label = null;

                    expect(button.label).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button"></a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button>
                         My Button
                        </Ink.Button>
                    `;

                    expect(button.label).toBe('My Button');

                    button.label = null;

                    expect(button.label).toBeNull();

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button"></button>'
                    );
                });
            });
        });

        describe('type', () => {
            describe('danger', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.STANDARD);

                    button.type = ButtonType.DANGER;

                    expect(button.type).toBe(ButtonType.DANGER);

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button -is-danger" role="button">' +
                        'My Button</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button>
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.STANDARD);

                    button.type = ButtonType.DANGER;

                    expect(button.type).toBe(ButtonType.DANGER);

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button -is-danger"' +
                        ' type="button">' +
                        'My Button</button>'
                    );
                });
            });

            describe('primary', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" type="danger">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.DANGER);

                    button.type = ButtonType.PRIMARY;

                    expect(button.type).toBe(ButtonType.PRIMARY);

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button -is-primary" role="button">' +
                        'My Button</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button type="danger">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.DANGER);

                    button.type = ButtonType.PRIMARY;

                    expect(button.type).toBe(ButtonType.PRIMARY);

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button -is-primary"' +
                        ' type="button">' +
                        'My Button</button>'
                    );
                });
            });

            describe('reset', () => {
                it('With tagName="a"', () => {
                    spyOn(console, 'warn');

                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" type="primary">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.PRIMARY);

                    button.type = ButtonType.RESET;

                    expect(button.type).toBe(ButtonType.STANDARD);

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">My Button</a>'
                    );
                    expect(console.warn).toHaveBeenCalledWith(
                        'Button type "reset" is not valid for button links ' +
                        '(tagName="a").'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button type="primary">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.PRIMARY);

                    button.type = ButtonType.RESET;

                    expect(button.type).toBe(ButtonType.RESET);

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="reset">' +
                        'My Button</button>'
                    );
                });
            });

            describe('standard', () => {
                it('With tagName="a"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" type="danger">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.DANGER);

                    button.type = ButtonType.STANDARD;

                    expect(button.type).toBe(ButtonType.STANDARD);

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">' +
                        'My Button</a>'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button type="danger">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.DANGER);

                    button.type = ButtonType.STANDARD;

                    expect(button.type).toBe(ButtonType.STANDARD);

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="button">' +
                        'My Button</button>'
                    );
                });
            });

            describe('submit', () => {
                it('With tagName="a"', () => {
                    spyOn(console, 'warn');

                    const button = craft<ButtonView>`
                        <Ink.Button tagName="a" type="primary">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.PRIMARY);

                    button.type = ButtonType.SUBMIT;

                    expect(button.type).toBe(ButtonType.STANDARD);

                    expect(button.el.outerHTML).toBe(
                        '<a class="ink-c-button" role="button">' +
                        'My Button</a>'
                    );
                    expect(console.warn).toHaveBeenCalledWith(
                        'Button type "submit" is not valid for button links ' +
                        '(tagName="a").'
                    );
                });

                it('With tagName="button"', () => {
                    const button = craft<ButtonView>`
                        <Ink.Button type="primary">
                         My Button
                        </Ink.Button
                    `;

                    expect(button.type).toBe(ButtonType.PRIMARY);

                    button.type = ButtonType.SUBMIT;

                    expect(button.type).toBe(ButtonType.SUBMIT);

                    expect(button.el.outerHTML).toBe(
                        '<button class="ink-c-button" type="submit">' +
                        'My Button</button>'
                    );
                });
            });
        });
    });
});
