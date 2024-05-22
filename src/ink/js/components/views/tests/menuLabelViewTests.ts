/**
 * Unit tests for MenuLabelView.
 *
 * Version Added:
 *     1.0
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    MenuLabelView,
    craft,
} from '../../../index';
import { sendKeys } from '../../../testing';


suite('components/views/MenuLabelView', () => {
    let menuLabel: MenuLabelView = null;

    afterEach(() => {
        menuLabel.remove();
        menuLabel = null;
    });

    describe('Render', () => {
        it('Default', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel text="My Menu Label">
                 <Ink.MenuLabel.Item id="item-1">Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;
            const cid = menuLabel.cid;

            expect(menuLabel.el.outerHTML).toBe(
                '<span class="ink-c-menu-label" role="menuitem" tabindex="0"' +
                ` aria-controls="ink-menu-label__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-menu-label__inner">' +
                '<span class="ink-c-menu-label__text">My Menu Label</span>' +
                '<span class="ink-c-menu-label__dropdown-icon' +
                ' ink-i-dropdown"></span>' +
                '</span>' +
                `<menu id="ink-menu-label__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                '<li role="menuitem" draggable="false" tabindex="-1"' +
                ' id="item-1" class="ink-c-menu__item" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" role="presentation"' +
                ' tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</span>'
            );
        });

        it('With Icon', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel iconName="ink-i-success"
                               text="My Menu Label">
                 <Ink.MenuLabel.Item id="item-1">Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;
            const cid = menuLabel.cid;

            expect(menuLabel.el.outerHTML).toBe(
                '<span class="ink-c-menu-label" role="menuitem" tabindex="0"' +
                ` aria-controls="ink-menu-label__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-menu-label__inner">' +
                '<span class="ink-c-menu-label__icon ink-i-success"' +
                ' aria-hidden="true"></span>' +
                '<span class="ink-c-menu-label__text">My Menu Label</span>' +
                '<span class="ink-c-menu-label__dropdown-icon' +
                ' ink-i-dropdown"></span>' +
                '</span>' +
                `<menu id="ink-menu-label__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                '<li role="menuitem" draggable="false" tabindex="-1"' +
                ' id="item-1" class="ink-c-menu__item" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" role="presentation"' +
                ' tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</span>'
            );
        });

        it('With custom drop-down icon', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel dropDownIconName="ink-i-success"
                               text="My Menu Label">
                 <Ink.MenuLabel.Item id="item-1">Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;
            const cid = menuLabel.cid;

            expect(menuLabel.el.outerHTML).toBe(
                '<span class="ink-c-menu-label" role="menuitem" tabindex="0"' +
                ` aria-controls="ink-menu-label__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-menu-label__inner">' +
                '<span class="ink-c-menu-label__text">My Menu Label</span>' +
                '<span class="ink-c-menu-label__dropdown-icon' +
                ' ink-i-success"></span>' +
                '</span>' +
                `<menu id="ink-menu-label__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                '<li role="menuitem" draggable="false" tabindex="-1"' +
                ' id="item-1" class="ink-c-menu__item" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" role="presentation"' +
                ' tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</span>'
            );
        });

        it('Without drop-down icon', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel dropDownIconName=""
                               text="My Menu Label">
                 <Ink.MenuLabel.Item id="item-1">Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;
            const cid = menuLabel.cid;

            expect(menuLabel.el.outerHTML).toBe(
                '<span class="ink-c-menu-label" role="menuitem" tabindex="0"' +
                ` aria-controls="ink-menu-label__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-menu-label__inner">' +
                '<span class="ink-c-menu-label__text">My Menu Label</span>' +
                '</span>' +
                `<menu id="ink-menu-label__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                '<li role="menuitem" draggable="false" tabindex="-1"' +
                ' id="item-1" class="ink-c-menu__item" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" role="presentation"' +
                ' tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</span>'
            );
        });

        it('With menuAriaLabel', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel text="My Menu Label"
                               menuAriaLabel="Oh hi">
                 <Ink.MenuLabel.Item id="item-1">
                  Item 1
                 </Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;
            const cid = menuLabel.cid;

            expect(menuLabel.el.outerHTML).toBe(
                '<span class="ink-c-menu-label" role="menuitem" tabindex="0"' +
                ` aria-controls="ink-menu-label__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-menu-label__inner">' +
                '<span class="ink-c-menu-label__text">My Menu Label</span>' +
                '<span class="ink-c-menu-label__dropdown-icon' +
                ' ink-i-dropdown"></span>' +
                '</span>' +
                `<menu id="ink-menu-label__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                ' tabindex="-1" aria-label="Oh hi">' +
                '<li role="menuitem" draggable="false" tabindex="-1"' +
                ' id="item-1" class="ink-c-menu__item" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" role="presentation"' +
                ' tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</span>'
            );
        });
    });

    describe('Events', () => {
        describe('click', () => {
            it('When enabled', () => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel>
                     <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;
                document.body.appendChild(menuLabel.el);

                const menuView = menuLabel.menuView;
                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();

                menuLabel.el.dispatchEvent(new window.MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));

                expect(menuView.isOpen).toBeTrue();
                expect(menuView.isStickyOpen).toBeTrue();
            });

            it('When disabled', () => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel disabled>
                     <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;
                document.body.appendChild(menuLabel.el);

                const menuView = menuLabel.menuView;
                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();

                menuLabel.el.dispatchEvent(new window.MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                }));

                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();
            });
        });

        describe('focusout', () => {
            describe('To menu label', () => {
                it('When enabled', () => {
                    menuLabel = craft<MenuLabelView>`
                        <Ink.MenuLabel>
                         <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                        </Ink.MenuLabel>
                    `;
                    document.body.appendChild(menuLabel.el);

                    const menu = menuLabel.menuView;
                    menu.open();
                    menu.el.focus();

                    expect(menu.isOpen).toBeTrue();
                    expect(menu.isStickyOpen).toBeFalse();

                    menuLabel.el.focus();

                    expect(menu.isOpen).toBeTrue();
                    expect(menu.isStickyOpen).toBeFalse();
                });

                it('When disabled', () => {
                    menuLabel = craft<MenuLabelView>`
                        <Ink.MenuLabel disabled>
                         <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                        </Ink.MenuLabel>
                    `;
                    document.body.appendChild(menuLabel.el);

                    const menu = menuLabel.menuView;

                    menuLabel.el.focus();

                    expect(menu.isOpen).toBeFalse();
                    expect(menu.isStickyOpen).toBeNull();
                });
            });

            it('Outside component', () => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel>
                     <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;
                document.body.appendChild(menuLabel.el);

                const menu = menuLabel.menuView;
                menu.open();
                menu.el.focus();

                document.body.tabIndex = 0;
                document.body.focus();

                expect(menu.isOpen).toBeFalse();
                expect(menu.isStickyOpen).toBeNull();
            });
        });

        describe('keydown', () => {
            beforeEach(() => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel>
                     <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;
                document.body.appendChild(menuLabel.el);
            });

            for (const key of ['ArrowDown', 'ArrowUp', 'Enter', ' ']) {
                describe(key, () => {
                    it('When menu opens up', () => {
                        /*
                         * Ideally, we'd test for the "opens up" and
                         * "opens down" states, but jsdom doesn't let us do
                         * anything with getBoundingClientRect (it's always
                         * empty, no matter what I try). So we test the bare
                         * minimum here.
                         */
                        sendKeys(menuLabel.el, [key]);

                        const menuView = menuLabel.menuView;

                        expect(menuView.isOpen).toBeTrue();
                        expect(menuView.isStickyOpen).toBeTrue();
                        expect(
                            menuView.el.children[0]
                            .getAttribute('aria-selected')
                        ).toBe('true');
                    });

                    it('When disabled', () => {
                        menuLabel.disabled =true;
                        sendKeys(menuLabel.el, [key]);

                        const menuView = menuLabel.menuView;

                        expect(menuView.isOpen).toBeFalse();
                        expect(menuView.isStickyOpen).toBeNull();
                    });
                });
            }

            it('Escape', () => {
                menuLabel.menuView.show();

                sendKeys(menuLabel.el, ['Escape']);

                const menuView = menuLabel.menuView;

                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();
                expect(
                    menuView.el.children[0]
                    .getAttribute('aria-selected')
                ).toBeNull();
            });
        });

        describe('mouseover', () => {
            describe('Over menu label', () => {
                it('When enabled', () => {
                    menuLabel = craft<MenuLabelView>`
                        <Ink.MenuLabel>
                         <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                        </Ink.MenuLabel>
                    `;
                    document.body.appendChild(menuLabel.el);

                    const menuView = menuLabel.menuView;
                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.isStickyOpen).toBeNull();

                    menuLabel.el.dispatchEvent(
                        new window.MouseEvent('mouseover', {
                            bubbles: true,
                            cancelable: true,
                        }));

                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.isStickyOpen).toBeFalse();
                });

                it('When disabled', () => {
                    menuLabel = craft<MenuLabelView>`
                        <Ink.MenuLabel disabled>
                         <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                        </Ink.MenuLabel>
                    `;
                    document.body.appendChild(menuLabel.el);

                    const menuView = menuLabel.menuView;

                    menuLabel.el.dispatchEvent(
                        new window.MouseEvent('mouseover', {
                            bubbles: true,
                            cancelable: true,
                        }));

                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.isStickyOpen).toBeNull();
                });
            });
        });
    });

    describe('Properties', () => {
        it('disabled', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel>
                 <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;

            expect(menuLabel.disabled).toBeFalse();
            expect(menuLabel.el.getAttribute('aria-disabled')).toBeNull();

            menuLabel.disabled = true;

            expect(menuLabel.disabled).toBeTrue();
            expect(menuLabel.el.getAttribute('aria-disabled')).toBe('true');

            menuLabel.disabled = false;

            expect(menuLabel.disabled).toBeFalse();
            expect(menuLabel.el.getAttribute('aria-disabled')).toBeNull();
        });

        describe('iconName', () => {
            it('To value', () => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel text="My Menu Label">
                     <Ink.MenuLabel.Item id="item-1">
                      Item 1
                     </Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;

                const cid = menuLabel.cid;

                expect(menuLabel.iconName).toBeNull();
                expect(menuLabel.el.outerHTML).toBe(
                    '<span class="ink-c-menu-label" role="menuitem"' +
                    ' tabindex="0"' +
                    ` aria-controls="ink-menu-label__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-menu-label__inner">' +
                    '<span class="ink-c-menu-label__text">My Menu Label' +
                    '</span>' +
                    '<span class="ink-c-menu-label__dropdown-icon' +
                    ' ink-i-dropdown"></span>' +
                    '</span>' +
                    `<menu id="ink-menu-label__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                    '<li role="menuitem" draggable="false" tabindex="-1"' +
                    ' id="item-1" class="ink-c-menu__item"' +
                    ' data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner"' +
                    ' role="presentation"' +
                    ' tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</span>'
                );

                menuLabel.iconName = 'ink-i-success';

                expect(menuLabel.iconName).toBe('ink-i-success');
                expect(menuLabel.el.outerHTML).toBe(
                    '<span class="ink-c-menu-label" role="menuitem"' +
                    ' tabindex="0"' +
                    ` aria-controls="ink-menu-label__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-menu-label__inner">' +
                    '<span class="ink-c-menu-label__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '<span class="ink-c-menu-label__text">My Menu Label' +
                    '</span>' +
                    '<span class="ink-c-menu-label__dropdown-icon' +
                    ' ink-i-dropdown"></span>' +
                    '</span>' +
                    `<menu id="ink-menu-label__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                    '<li role="menuitem" draggable="false" tabindex="-1"' +
                    ' id="item-1" class="ink-c-menu__item"' +
                    ' data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner"' +
                    ' role="presentation"' +
                    ' tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</span>'
                );
            });

            it('To null', () => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel iconName="ink-i-success"
                                   text="My Menu Label">
                     <Ink.MenuLabel.Item id="item-1">
                      Item 1
                     </Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;

                const cid = menuLabel.cid;

                expect(menuLabel.iconName).toBe('ink-i-success');
                expect(menuLabel.el.outerHTML).toBe(
                    '<span class="ink-c-menu-label" role="menuitem"' +
                    ' tabindex="0"' +
                    ` aria-controls="ink-menu-label__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-menu-label__inner">' +
                    '<span class="ink-c-menu-label__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '<span class="ink-c-menu-label__text">My Menu Label' +
                    '</span>' +
                    '<span class="ink-c-menu-label__dropdown-icon' +
                    ' ink-i-dropdown"></span>' +
                    '</span>' +
                    `<menu id="ink-menu-label__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                    '<li role="menuitem" draggable="false" tabindex="-1"' +
                    ' id="item-1" class="ink-c-menu__item"' +
                    ' data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner"' +
                    ' role="presentation"' +
                    ' tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</span>'
                );

                menuLabel.iconName = null;

                expect(menuLabel.iconName).toBeNull();
                expect(menuLabel.el.outerHTML).toBe(
                    '<span class="ink-c-menu-label" role="menuitem"' +
                    ' tabindex="0"' +
                    ` aria-controls="ink-menu-label__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-menu-label__inner">' +
                    '<span class="ink-c-menu-label__text">My Menu Label' +
                    '</span>' +
                    '<span class="ink-c-menu-label__dropdown-icon' +
                    ' ink-i-dropdown"></span>' +
                    '</span>' +
                    `<menu id="ink-menu-label__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                    '<li role="menuitem" draggable="false" tabindex="-1"' +
                    ' id="item-1" class="ink-c-menu__item"' +
                    ' data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner"' +
                    ' role="presentation"' +
                    ' tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</span>'
                );
            });

            it('To empty string', () => {
                menuLabel = craft<MenuLabelView>`
                    <Ink.MenuLabel iconName="ink-i-success"
                                   text="My Menu Label">
                     <Ink.MenuLabel.Item id="item-1">
                      Item 1
                     </Ink.MenuLabel.Item>
                    </Ink.MenuLabel>
                `;

                const cid = menuLabel.cid;

                expect(menuLabel.iconName).toBe('ink-i-success');
                expect(menuLabel.el.outerHTML).toBe(
                    '<span class="ink-c-menu-label" role="menuitem"' +
                    ' tabindex="0"' +
                    ` aria-controls="ink-menu-label__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-menu-label__inner">' +
                    '<span class="ink-c-menu-label__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '<span class="ink-c-menu-label__text">My Menu Label' +
                    '</span>' +
                    '<span class="ink-c-menu-label__dropdown-icon' +
                    ' ink-i-dropdown"></span>' +
                    '</span>' +
                    `<menu id="ink-menu-label__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                    '<li role="menuitem" draggable="false" tabindex="-1"' +
                    ' id="item-1" class="ink-c-menu__item"' +
                    ' data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner"' +
                    ' role="presentation"' +
                    ' tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</span>'
                );

                menuLabel.iconName = '';

                expect(menuLabel.iconName).toBeNull();
                expect(menuLabel.el.outerHTML).toBe(
                    '<span class="ink-c-menu-label" role="menuitem"' +
                    ' tabindex="0"' +
                    ` aria-controls="ink-menu-label__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-menu-label__inner">' +
                    '<span class="ink-c-menu-label__text">My Menu Label' +
                    '</span>' +
                    '<span class="ink-c-menu-label__dropdown-icon' +
                    ' ink-i-dropdown"></span>' +
                    '</span>' +
                    `<menu id="ink-menu-label__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Menu Label">' +
                    '<li role="menuitem" draggable="false" tabindex="-1"' +
                    ' id="item-1" class="ink-c-menu__item"' +
                    ' data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner"' +
                    ' role="presentation"' +
                    ' tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</span>'
                );
            });
        });

        it('text', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel text="Original label">
                 <Ink.MenuLabel.Item id="item-1">Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;

            const cid = menuLabel.cid;

            expect(menuLabel.text).toBe('Original label');

            menuLabel.text = 'New label';

            expect(menuLabel.text).toBe('New label');
            expect(menuLabel.el.outerHTML).toBe(
                '<span class="ink-c-menu-label" role="menuitem"' +
                ' tabindex="0"' +
                ` aria-controls="ink-menu-label__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-menu-label__inner">' +
                '<span class="ink-c-menu-label__text">New label' +
                '</span>' +
                '<span class="ink-c-menu-label__dropdown-icon' +
                ' ink-i-dropdown"></span>' +
                '</span>' +
                `<menu id="ink-menu-label__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-label__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for Original label">' +
                '<li role="menuitem" draggable="false" tabindex="-1"' +
                ' id="item-1" class="ink-c-menu__item"' +
                ' data-item-index="0">' +
                '<span class="ink-c-menu__item-inner"' +
                ' role="presentation"' +
                ' tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</span>'
            );
        });

        it('menuItems', () => {
            menuLabel = craft<MenuLabelView>`
                <Ink.MenuLabel>
                 <Ink.MenuLabel.Item>Item 1</Ink.MenuLabel.Item>
                </Ink.MenuLabel>
            `;

            const menuItems = menuLabel.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).get('label')).toBe('Item 1');
        });
    });
});
