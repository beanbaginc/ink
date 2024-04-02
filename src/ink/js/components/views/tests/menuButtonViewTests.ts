/**
 * Unit tests for MenuButtonView.
 *
 * Version Added:
 *     1.0
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    ButtonType,
    MenuButtonView,
    craft,
} from '../../../index';
import { sendKeys } from '../../../testing';


suite('components/views/MenuButtonView', () => {
    let menuButton: MenuButtonView = null;

    afterEach(() => {
        menuButton.remove();
        menuButton = null;
    });

    describe('Render', () => {
        it('With action button', () => {
            menuButton = craft<MenuButtonView>`
                <Ink.MenuButton label="My Button"
                                hasActionButton>
                 <Ink.MenuButton.Item id="item-1">
                  Item 1
                 </Ink.MenuButton.Item>
                </Ink.MenuButton>
            `;
            const cid = menuButton.cid;

            expect(menuButton.actionButtonView).not.toBeNull();

            expect(menuButton.el.outerHTML).toBe(
                '<div class="ink-c-menu-button" role="group">' +
                '<div class="ink-c-button-group ink-c-menu-button__buttons"' +
                ' role="group" aria-orientation="horizontal">' +
                '<button class="ink-c-button' +
                ' ink-c-menu-button__action-button" type="button">' +
                'My Button</button>' +
                `<button id="ink-menu-button__dropdown__${cid}"` +
                ' class="ink-c-button ink-c-menu-button__dropdown-button"' +
                ' type="button" aria-label="Open menu"' +
                ` aria-controls="ink-menu-button__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-button__icon ink-i-dropdown"' +
                ' aria-hidden="true"></span>' +
                '</button></div>' +
                `<menu id="ink-menu-button__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for My Button">' +
                '<li class="ink-c-menu__item" role="menuitem" id="item-1"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</div>'
            );
        });

        it('Without action button', () => {
            menuButton = craft<MenuButtonView>`
                <Ink.MenuButton label="My Button">
                 <Ink.MenuButton.Item id="item-1">Item 1</Ink.MenuButton.Item>
                </Ink.MenuButton>
            `;
            const cid = menuButton.cid;

            expect(menuButton.actionButtonView).toBeNull();

            expect(menuButton.el.outerHTML).toBe(
                '<div class="ink-c-menu-button" role="group">' +
                `<button id="ink-menu-button__dropdown__${cid}"` +
                ' class="ink-c-button ink-c-menu-button__dropdown-button"' +
                ' type="button" aria-label="Open menu"' +
                ` aria-controls="ink-menu-button__menu__${cid}"` +
                ' aria-expanded="false" aria-haspopup="true">' +
                '<span class="ink-c-button__icon ink-i-dropdown"' +
                ' aria-hidden="true"></span>' +
                '<label class="ink-c-button__label">My Button</label>' +
                '</button>' +
                `<menu id="ink-menu-button__menu__${cid}"` +
                ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                ' tabindex="-1" aria-label="Menu for My Button">' +
                '<li class="ink-c-menu__item" role="menuitem" id="item-1"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>' +
                '</div>'
            );
        });

        describe('With button type', () => {
            it('And action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    hasActionButton
                                    type="primary">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    '<div class="ink-c-button-group' +
                    ' ink-c-menu-button__buttons" role="group"' +
                    ' aria-orientation="horizontal">' +
                    '<button class="ink-c-button' +
                    ' ink-c-menu-button__action-button -is-primary"' +
                    ' type="button">' +
                    'My Button</button>' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button -is-primary"' +
                    ' type="button" aria-label="Open menu"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-dropdown"' +
                    ' aria-hidden="true"></span>' +
                    '</button></div>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Button">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    type="primary">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button -is-primary"' +
                    ' type="button" aria-label="Open menu"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-dropdown"' +
                    ' aria-hidden="true"></span>' +
                    '<label class="ink-c-button__label">My Button</label>' +
                    '</button>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Button">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });
        });

        describe('With dropdownButtonAriaLabel', () => {
            it('And action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    hasActionButton
                                    dropdownButtonAriaLabel="Oh hi">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    '<div class="ink-c-button-group' +
                    ' ink-c-menu-button__buttons" role="group"' +
                    ' aria-orientation="horizontal">' +
                    '<button class="ink-c-button' +
                    ' ink-c-menu-button__action-button"' +
                    ' type="button">' +
                    'My Button</button>' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button"' +
                    ' type="button" aria-label="Oh hi"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-dropdown"' +
                    ' aria-hidden="true"></span>' +
                    '</button></div>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Button">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    dropdownButtonAriaLabel="Oh hi">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button"' +
                    ' type="button" aria-label="Oh hi"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-dropdown"' +
                    ' aria-hidden="true"></span>' +
                    '<label class="ink-c-button__label">My Button</label>' +
                    '</button>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Button">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });
        });

        describe('With menuAriaLabel', () => {
            it('And action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    hasActionButton
                                    menuAriaLabel="Oh hi">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    '<div class="ink-c-button-group' +
                    ' ink-c-menu-button__buttons" role="group"' +
                    ' aria-orientation="horizontal">' +
                    '<button class="ink-c-button' +
                    ' ink-c-menu-button__action-button"' +
                    ' type="button">' +
                    'My Button</button>' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button"' +
                    ' type="button" aria-label="Open menu"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-dropdown"' +
                    ' aria-hidden="true"></span>' +
                    '</button></div>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Oh hi">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    menuAriaLabel="Oh hi">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button"' +
                    ' type="button" aria-label="Open menu"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-dropdown"' +
                    ' aria-hidden="true"></span>' +
                    '<label class="ink-c-button__label">My Button</label>' +
                    '</button>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Oh hi">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });
        });

        describe('With menuIconName', () => {
            it('And action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    hasActionButton
                                    menuIconName="ink-i-success">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    '<div class="ink-c-button-group' +
                    ' ink-c-menu-button__buttons" role="group"' +
                    ' aria-orientation="horizontal">' +
                    '<button class="ink-c-button' +
                    ' ink-c-menu-button__action-button"' +
                    ' type="button">' +
                    'My Button</button>' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button"' +
                    ' type="button" aria-label="Open menu"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '</button></div>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Button">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="My Button"
                                    menuIconName="ink-i-success">
                     <Ink.MenuButton.Item id="item-1">
                      Item 1
                     </Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                const cid = menuButton.cid;

                expect(menuButton.el.outerHTML).toBe(
                    '<div class="ink-c-menu-button" role="group">' +
                    `<button id="ink-menu-button__dropdown__${cid}"` +
                    ' class="ink-c-button' +
                    ' ink-c-menu-button__dropdown-button"' +
                    ' type="button" aria-label="Open menu"' +
                    ` aria-controls="ink-menu-button__menu__${cid}"` +
                    ' aria-expanded="false" aria-haspopup="true">' +
                    '<span class="ink-c-button__icon ink-i-success"' +
                    ' aria-hidden="true"></span>' +
                    '<label class="ink-c-button__label">My Button</label>' +
                    '</button>' +
                    `<menu id="ink-menu-button__menu__${cid}"` +
                    ' class="ink-c-menu ink-c-menu-button__menu" role="menu"' +
                    ' tabindex="-1" aria-label="Menu for My Button">' +
                    '<li class="ink-c-menu__item" role="menuitem"' +
                    ' id="item-1" tabindex="-1" data-item-index="0">' +
                    '<span class="ink-c-menu__item-inner" draggable="false"' +
                    ' role="presentation" tabindex="-1">' +
                    '<label class="ink-c-menu__item-label">Item 1</label>' +
                    '</span></li></menu>' +
                    '</div>'
                );
            });
        });
    });

    describe('Events', () => {
        describe('click', () => {
            it('On dropdown button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);

                const menuView = menuButton.menuView;
                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();

                menuButton.el
                    .querySelector('.ink-c-menu-button__dropdown-button')
                    .dispatchEvent(new window.MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                    }));

                expect(menuView.isOpen).toBeTrue();
                expect(menuView.isStickyOpen).toBeTrue();
            });
        });

        describe('focusout', () => {
            it('To action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);

                const menu = menuButton.menuView;
                menu.open();
                menu.el.focus();

                expect(menu.isOpen).toBeTrue();
                expect(menu.isStickyOpen).toBeFalse();

                menuButton.el
                    .querySelector<HTMLElement>(
                        '.ink-c-menu-button__action-button'
                    )
                    .focus();

                expect(menu.isOpen).toBeFalse();
                expect(menu.isStickyOpen).toBeNull();
            });

            it('To dropdown handle button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);

                const menu = menuButton.menuView;
                menu.open();
                menu.el.focus();

                expect(menu.isOpen).toBeTrue();
                expect(menu.isStickyOpen).toBeFalse();

                menuButton.el
                    .querySelector<HTMLElement>(
                        '.ink-c-menu-button__dropdown-button'
                    )
                    .focus();

                expect(menu.isOpen).toBeTrue();
                expect(menu.isStickyOpen).toBeFalse();
            });

            it('Outside component', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);

                const menu = menuButton.menuView;
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
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);
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
                        const dropdownButtonEl =
                            menuButton.el
                            .querySelector<HTMLElement>(
                                '.ink-c-menu-button__dropdown-button'
                            );

                        sendKeys(dropdownButtonEl, [key]);

                        const menuView = menuButton.menuView;

                        expect(menuView.isOpen).toBeTrue();
                        expect(menuView.isStickyOpen).toBeTrue();
                        expect(
                            menuView.el.children[0]
                            .getAttribute('aria-selected')
                        ).toBe('true');
                    });
                });
            }

            it('Escape', () => {
                const dropdownButtonEl =
                    menuButton.el
                    .querySelector<HTMLElement>(
                        '.ink-c-menu-button__dropdown-button'
                    );

                menuButton.menuView.show();

                sendKeys(dropdownButtonEl, ['Escape']);

                const menuView = menuButton.menuView;

                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();
                expect(
                    menuView.el.children[0]
                    .getAttribute('aria-selected')
                ).toBeNull();
            });
        });

        describe('mouseover', () => {
            it('Over action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);

                const menuView = menuButton.menuView;
                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();

                menuButton.el
                    .querySelector('.ink-c-menu-button__action-button')
                    .dispatchEvent(new window.MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                    }));

                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();
            });

            it('Over dropdown button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;
                document.body.appendChild(menuButton.el);

                const menuView = menuButton.menuView;
                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();

                menuButton.el
                    .querySelector('.ink-c-menu-button__dropdown-button')
                    .dispatchEvent(new window.MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                    }));

                expect(menuView.isOpen).toBeTrue();
                expect(menuView.isStickyOpen).toBeFalse();
            });
        });
    });

    describe('Properties', () => {
        describe('busy', () => {
            it('With action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.busy).toBeFalse();
                expect(menuButton.actionButtonView.busy).toBeFalse();
                expect(menuButton.actionButtonView.disabled).toBeFalse();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeFalse();
                expect(menuButton.el.getAttribute('aria-busy')).toBeNull();

                menuButton.busy = true;

                expect(menuButton.busy).toBeTrue();
                expect(menuButton.actionButtonView.busy).toBeTrue();
                expect(menuButton.actionButtonView.disabled).toBeFalse();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeTrue();
                expect(menuButton.el.getAttribute('aria-busy')).toBe('true');

                menuButton.busy = false;

                expect(menuButton.busy).toBeFalse();
                expect(menuButton.actionButtonView.busy).toBeFalse();
                expect(menuButton.actionButtonView.disabled).toBeFalse();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeFalse();
                expect(menuButton.el.getAttribute('aria-busy')).toBeNull();
            });

            it('With action button while disabled', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton disabled>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.busy).toBeFalse();
                expect(menuButton.actionButtonView.busy).toBeFalse();
                expect(menuButton.actionButtonView.disabled).toBeTrue();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeTrue();
                expect(menuButton.el.getAttribute('aria-busy')).toBeNull();

                menuButton.busy = true;

                expect(menuButton.busy).toBeTrue();
                expect(menuButton.actionButtonView.busy).toBeTrue();
                expect(menuButton.actionButtonView.disabled).toBeTrue();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeTrue();
                expect(menuButton.el.getAttribute('aria-busy')).toBe('true');

                menuButton.busy = false;

                expect(menuButton.busy).toBeFalse();
                expect(menuButton.actionButtonView.busy).toBeFalse();
                expect(menuButton.actionButtonView.disabled).toBeTrue();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeTrue();
                expect(menuButton.el.getAttribute('aria-busy')).toBeNull();
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.busy).toBeFalse();
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.el.getAttribute('aria-busy')).toBeNull();

                menuButton.busy = true;

                expect(menuButton.busy).toBeTrue();
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.busy).toBeTrue();
                expect(menuButton.el.getAttribute('aria-busy')).toBe('true');

                menuButton.busy = false;

                expect(menuButton.busy).toBeFalse();
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.busy).toBeFalse();
                expect(menuButton.el.getAttribute('aria-busy')).toBeNull();
            });
        });

        describe('disabled', () => {
            it('With action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.disabled).toBeFalse();
                expect(menuButton.actionButtonView.disabled).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeFalse();

                menuButton.disabled = true;

                expect(menuButton.disabled).toBeTrue();
                expect(menuButton.actionButtonView.disabled).toBeTrue();
                expect(menuButton.dropdownButtonView.disabled).toBeTrue();

                menuButton.disabled = false;

                expect(menuButton.disabled).toBeFalse();
                expect(menuButton.actionButtonView.disabled).toBeFalse();
                expect(menuButton.dropdownButtonView.disabled).toBeFalse();
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.disabled).toBeFalse();
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.disabled).toBeFalse();

                menuButton.disabled = true;

                expect(menuButton.disabled).toBeTrue();
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.disabled).toBeTrue();

                menuButton.disabled = false;

                expect(menuButton.disabled).toBeFalse();
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.disabled).toBeFalse();
            });
        });

        describe('iconName', () => {
            it('With action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.iconName).toBe('ink-i-dropdown');
                expect(menuButton.actionButtonView.iconName).toBeNull();
                expect(menuButton.dropdownButtonView.iconName)
                    .toBe('ink-i-dropdown');

                menuButton.iconName = 'ink-i-success';

                expect(menuButton.iconName).toBe('ink-i-success');
                expect(menuButton.actionButtonView.iconName).toBeNull();
                expect(menuButton.dropdownButtonView.iconName)
                    .toBe('ink-i-success');
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton>
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.iconName).toBe('ink-i-dropdown');
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.iconName)
                    .toBe('ink-i-dropdown');

                menuButton.iconName = 'ink-i-success';

                expect(menuButton.iconName).toBe('ink-i-success');
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.iconName)
                    .toBe('ink-i-success');
            });
        });

        describe('label', () => {
            it('With action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton
                                    label="Original label">
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.label).toBe('Original label');

                menuButton.label = 'New label';

                expect(menuButton.actionButtonView).not.toBeNull();
                expect(menuButton.actionButtonView.label)
                    .toBe('New label');

                expect(menuButton.dropdownButtonView.label).toBeNull();
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton label="Original label">
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.label).toBe('Original label');

                menuButton.label = 'New label';

                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.label)
                    .toBe('New label');
            });
        });

        describe('type', () => {
            it('With action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton hasActionButton type="primary">
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.type).toBe(ButtonType.PRIMARY);
                expect(menuButton.actionButtonView.type)
                    .toBe(ButtonType.PRIMARY);
                expect(menuButton.dropdownButtonView.type)
                    .toBe(ButtonType.PRIMARY);

                menuButton.type = ButtonType.DANGER;

                expect(menuButton.type).toBe(ButtonType.DANGER);
                expect(menuButton.actionButtonView.type)
                    .toBe(ButtonType.DANGER);
                expect(menuButton.dropdownButtonView.type)
                    .toBe(ButtonType.DANGER);
            });

            it('Without action button', () => {
                menuButton = craft<MenuButtonView>`
                    <Ink.MenuButton type="primary">
                     <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                    </Ink.MenuButton>
                `;

                expect(menuButton.type).toBe(ButtonType.PRIMARY);
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.type)
                    .toBe(ButtonType.PRIMARY);

                menuButton.type = ButtonType.DANGER;

                expect(menuButton.type).toBe(ButtonType.DANGER);
                expect(menuButton.actionButtonView).toBeNull();
                expect(menuButton.dropdownButtonView.type)
                    .toBe(ButtonType.DANGER);
            });
        });

        it('menuItems', () => {
            menuButton = craft<MenuButtonView>`
                <Ink.MenuButton hasActionButton type="primary">
                 <Ink.MenuButton.Item>Item 1</Ink.MenuButton.Item>
                </Ink.MenuButton>
            `;

            const menuItems = menuButton.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).get('label')).toBe('Item 1');
        });
    });
});
