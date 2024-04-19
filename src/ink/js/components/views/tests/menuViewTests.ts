/**
 * Unit tests for MenuView.
 *
 * Version Added:
 *     1.0
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    craft,
    paint,
} from '../../../core';
import { sendKeys } from '../../../testing';
import { KeyboardShortcutRegistry } from '../../../foundation';
import { MenuItemsRadioGroup } from '../../collections';
import { MenuItemType } from '../../models';
import { MenuView } from '../menuView';


/**
 * Checks that a specific menu item is selected.
 *
 * Args:
 *     menuView (MenuView):
 *         The menu that owns the menu item.
 *
 *     menuItemEl (HTMLElement):
 *         The menu item element.
 */
function expectMenuItemSelected(
    menuView: MenuView,
    menuItemEl: HTMLElement,
) {
    expect(menuItemEl.getAttribute('aria-selected')).toBe('true');
    expect(menuItemEl.tabIndex).toBe(0);
    expect(menuItemEl.id).toBeTruthy();

    expect(menuView.el.getAttribute('aria-activedescendant'))
        .toBe(menuItemEl.id);
}


/**
 * Checks that a specific menu item is not selected.
 *
 * Args:
 *     menuView (MenuView):
 *         The menu that owns the menu item.
 *
 *     menuItemEl (HTMLElement):
 *         The menu item element.
 */
function expectMenuItemNotSelected(
    menuView: MenuView,
    menuItemEl: HTMLElement,
) {
    expect(menuItemEl.getAttribute('aria-selected')).toBeNull();
    expect(menuItemEl.tabIndex).toBe(-1);

    expect(menuView.el.getAttribute('aria-activedescendant'))
        .not.toBe(menuItemEl.id);
}


/**
 * Checks that a specific menu item is checked.
 *
 * Args:
 *     menuView (MenuView):
 *         The menu that owns the menu item.
 *
 *     menuItemEl (HTMLElement):
 *         The menu item element.
 */
function expectMenuItemChecked(
    menuView: MenuView,
    menuItemEl: HTMLElement,
) {
    const itemIndex = parseInt(menuItemEl.dataset.itemIndex, 10);

    const checkIconName = (
        (menuItemEl.getAttribute('role') === 'menuitemradio')
        ? 'ink-i-dot'
        : 'ink-i-check');

    expect(menuView.menuItems.at(itemIndex).get('checked')).toBeTrue();
    expect(menuItemEl.getAttribute('aria-checked')).toBe('true');
    expect(menuItemEl.querySelector('.ink-c-menu__item-icon'))
        .toHaveClass(checkIconName);
}


/**
 * Checks that a specific menu item is not checked.
 *
 * Args:
 *     menuView (MenuView):
 *         The menu that owns the menu item.
 *
 *     menuItemEl (HTMLElement):
 *         The menu item element.
 */
function expectMenuItemNotChecked(
    menuView: MenuView,
    menuItemEl: HTMLElement,
) {
    const itemIndex = parseInt(menuItemEl.dataset.itemIndex, 10);

    const checkIconName = (
        (menuItemEl.getAttribute('role') === 'menuitemradio')
        ? 'ink-i-dot'
        : 'ink-i-check');

    expect(menuView.menuItems.at(itemIndex).get('checked')).toBeFalse();
    expect(menuItemEl.getAttribute('aria-checked')).toBe('false');
    expect(menuItemEl.querySelector('.ink-c-menu__item-icon'))
        .not.toHaveClass(checkIconName);
}


/**
 * Checks that no menu item is selected in a menu.
 *
 * Args:
 *     menuView (MenuView):
 *         The menu to check.
 */
function expectNoMenuItemSelected(menuView: MenuView) {
    expect(menuView.el.getAttribute('aria-activedescendant')).toBeNull();
    expect(menuView.el.querySelector<HTMLLIElement>('[aria-selected=true]'))
        .toBeNull();
}


suite('components/views/MenuView', () => {
    let menuView: MenuView = null;

    beforeEach(() => {
        MenuView.openedMenu = null;
    });

    afterEach(() => {
        if (menuView) {
            menuView.remove();
        }

        MenuView.openedMenu = null;
    });

    describe('Rendering', () => {
        it('Standard menu items', () => {
            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.Item id="my-item">Item 1</Ink.Menu.Item>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: null,
                id: 'my-item',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 1',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded' +
                ' -is-open" role="menu" tabindex="0">' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>'
            );
        });

        it('Checkbox menu items', () => {
            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.CheckboxItem id="my-item-1">
                  Item 1
                 </Ink.Menu.CheckboxItem>
                 <Ink.Menu.CheckboxItem id="my-item-2" checked>
                  Item 2
                 </Ink.Menu.CheckboxItem>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(2);
            expect(menuItems.at(0).attributes).toEqual({
                checked: false,
                childEl: null,
                iconName: null,
                id: 'my-item-1',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 1',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.CHECKBOX_ITEM,
                url: null,
            });
            expect(menuItems.at(1).attributes).toEqual({
                checked: true,
                childEl: null,
                iconName: null,
                id: 'my-item-2',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 2',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.CHECKBOX_ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded -is-open' +
                ' -has-icons" role="menu" tabindex="0">' +
                '<li class="ink-c-menu__item" role="menuitemcheckbox"' +
                ' id="my-item-1" aria-checked="false" tabindex="-1"' +
                ' data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<span class="ink-c-menu__item-icon" aria-hidden="true">' +
                '</span>' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li>' +
                '<li class="ink-c-menu__item" role="menuitemcheckbox"' +
                ' id="my-item-2" aria-checked="true" tabindex="-1"' +
                ' data-item-index="1">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<span class="ink-c-menu__item-icon ink-i-check"' +
                ' aria-hidden="true"></span>' +
                '<label class="ink-c-menu__item-label">Item 2</label>' +
                '</span></li>' +
                '</menu>'
            );
        });

        it('Radio menu items', () => {
            const radioGroup = new MenuItemsRadioGroup();

            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.RadioItem id="my-item-1"
                                     radioGroup=${radioGroup}>
                  Item 1
                 </Ink.Menu.RadioItem>
                 <Ink.Menu.RadioItem id="my-item-2"
                                     radioGroup=${radioGroup}
                                     checked>
                  Item 2
                 </Ink.Menu.RadioItem>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(2);
            expect(menuItems.at(0).attributes).toEqual({
                checked: false,
                childEl: null,
                iconName: null,
                id: 'my-item-1',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 1',
                onClick: null,
                radioGroup: radioGroup,
                type: MenuItemType.RADIO_ITEM,
                url: null,
            });
            expect(menuItems.at(1).attributes).toEqual({
                checked: true,
                childEl: null,
                iconName: null,
                id: 'my-item-2',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 2',
                onClick: null,
                radioGroup: radioGroup,
                type: MenuItemType.RADIO_ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded' +
                ' -is-open -has-icons" role="menu" tabindex="0">' +
                '<li class="ink-c-menu__item" role="menuitemradio"' +
                ' id="my-item-1" aria-checked="false" tabindex="-1"' +
                ' data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<span class="ink-c-menu__item-icon" aria-hidden="true">' +
                '</span>' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li>' +
                '<li class="ink-c-menu__item" role="menuitemradio"' +
                ' id="my-item-2" aria-checked="true" tabindex="-1"' +
                ' data-item-index="1">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<span class="ink-c-menu__item-icon ink-i-dot"' +
                ' aria-hidden="true"></span>' +
                '<label class="ink-c-menu__item-label">Item 2</label>' +
                '</span></li>' +
                '</menu>'
            );
        });

        it('Separator items', () => {
            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.Separator/>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: null,
                id: null,
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: null,
                onClick: null,
                radioGroup: null,
                type: MenuItemType.SEPARATOR,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded -is-open"' +
                ' role="menu" tabindex="0">' +
                '<li class="ink-c-menu__separator" role="separator"' +
                ' tabindex="-1"></li>' +
                '</menu>'
            );
        });

        it('With childEl', () => {
            const customItemEl = paint<HTMLElement>`
                <div class="my-custom-component">Hi!</div>
            `;

            menuView = craft`
                <Ink.Menu id="my-menu">
                 <Ink.Menu.Item id="my-item" childEl=${customItemEl}/>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: customItemEl,
                iconName: null,
                id: 'my-item',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: null,
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu" role="menu"' +
                ' tabindex="-1">' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">' +
                '<div class="my-custom-component">Hi!</div></label>' +
                '</span></li></menu>'
            );
        });

        it('With controllerEl', () => {
            const controllerEl = document.createElement('div');

            menuView = craft`
                <Ink.Menu id="my-menu" controllerEl=${controllerEl}>
                 <Ink.Menu.Item id="my-item">
                  Item 1
                 </Ink.Menu.Item>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: null,
                id: 'my-item',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 1',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(controllerEl.outerHTML).toBe(
                '<div aria-controls="my-menu" aria-expanded="false"' +
                ' aria-haspopup="true"></div>'
            );

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu" role="menu"' +
                ' tabindex="-1">' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>'
            );
        });

        it('With icons', () => {
            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.Item id="my-item"
                                iconName="ink-i-success">
                  Item 1
                 </Ink.Menu.Item>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: 'ink-i-success',
                id: 'my-item',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'Item 1',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded' +
                ' -is-open -has-icons" role="menu" tabindex="0">' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<span class="ink-c-menu__item-icon ink-i-success"' +
                ' aria-hidden="true"></span>' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '</span></li></menu>'
            );
        });

        it('With keyboard shortcuts', () => {
            const keyboardShortcutRegistry = new KeyboardShortcutRegistry();

            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.Item id="my-item"
                   keyboardShortcut="Control-Alt-Delete"
                   keyboardShortcutRegistry=${keyboardShortcutRegistry}>
                  Item 1
                 </Ink.Menu.Item>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(1);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: null,
                id: 'my-item',
                keyboardShortcut: 'Control-Alt-Delete',
                keyboardShortcutRegistry: keyboardShortcutRegistry,
                label: 'Item 1',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded -is-open' +
                ' -has-shortcuts" role="menu" tabindex="0">' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">Item 1</label>' +
                '<span class="ink-c-keyboard-shortcut' +
                ' ink-c-menu__item-shortcut" title="Control-Alt-Delete"' +
                ' aria-label="Control-Alt-Delete">' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Control</span>' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Alt</span>' +
                '<span class="ink-c-keyboard-shortcut__key"' +
                ' aria-hidden="true">Delete</span></span>' +
                '</span></li></menu>'
            );
        });
    });

    describe('Menu Events', () => {
        it('Menu items change', () => {
            menuView = craft`
                <Ink.Menu embedded id="my-menu">
                 <Ink.Menu.Item>
                  Item 1
                 </Ink.Menu.Item>
                 <Ink.Menu.Item>
                  Item 2
                 </Ink.Menu.Item>
                </Ink.Menu>
            `;

            menuView.menuItems.reset([
                {
                    id: 'my-item-1',
                    label: 'New Item 1',
                },
                {
                    iconName: 'ink-i-success',
                    id: 'my-item-2',
                    label: 'New Item 2',
                },
            ]);

            const menuItems = menuView.menuItems;

            expect(menuItems).toHaveSize(2);
            expect(menuItems.at(0).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: null,
                id: 'my-item-1',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'New Item 1',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(menuItems.at(1).attributes).toEqual({
                checked: null,
                childEl: null,
                iconName: 'ink-i-success',
                id: 'my-item-2',
                keyboardShortcut: null,
                keyboardShortcutRegistry: null,
                label: 'New Item 2',
                onClick: null,
                radioGroup: null,
                type: MenuItemType.ITEM,
                url: null,
            });

            expect(menuView.el.outerHTML).toBe(
                '<menu id="my-menu" class="ink-c-menu -is-embedded' +
                ' -is-open -has-icons" role="menu" tabindex="0">' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item-1"' +
                ' tabindex="-1" data-item-index="0">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<label class="ink-c-menu__item-label">New Item 1</label>' +
                '</span></li>' +
                '<li class="ink-c-menu__item" role="menuitem" id="my-item-2"' +
                ' tabindex="-1" data-item-index="1">' +
                '<span class="ink-c-menu__item-inner" draggable="false"' +
                ' role="presentation" tabindex="-1">' +
                '<span class="ink-c-menu__item-icon ink-i-success"' +
                ' aria-hidden="true"></span>' +
                '<label class="ink-c-menu__item-label">New Item 2</label>' +
                '</span></li></menu>'
            );
        });

        it('Focus in', () => {
            menuView = craft`
                <Ink.Menu>
                 <Ink.Menu.Item>
                  Item 1
                 </Ink.Menu.Item>
                 <Ink.Menu.Item>
                  Item 123
                 </Ink.Menu.Item>
                 <Ink.Menu.Item>
                  Item 456
                 </Ink.Menu.Item>
                </Ink.Menu>
            `;
            document.body.append(menuView.el);
            menuView.open();

            const firstItemEl = menuView.el.children[0] as HTMLElement;
            expectMenuItemNotSelected(menuView, firstItemEl);

            menuView.el.focus();

            expectMenuItemSelected(menuView, firstItemEl);
        });

        describe('Focus out', () => {
            let otherEl: HTMLElement;

            beforeEach(() => {
                otherEl = paint`<div tabIndex=0/>`;
                document.body.appendChild(otherEl);
            });

            describe('Outside of menu', () => {
                it('When popped open', () => {
                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    document.body.append(menuView.el);
                    menuView.open();
                    menuView.el.focus();

                    const firstItemEl = menuView.el.children[0] as HTMLElement;
                    expectMenuItemSelected(menuView, firstItemEl);

                    otherEl.focus();

                    expectMenuItemNotSelected(menuView, firstItemEl);
                    expect(menuView.isOpen).toBeFalse();
                });

                it('When embedded', () => {
                    menuView = craft`
                        <Ink.Menu embedded>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    document.body.append(menuView.el);
                    menuView.open();
                    menuView.el.focus();

                    const firstItemEl = menuView.el.children[0] as HTMLElement;
                    expectMenuItemSelected(menuView, firstItemEl);

                    otherEl.focus();

                    expectMenuItemNotSelected(menuView, firstItemEl);
                    expect(menuView.isOpen).toBeTrue();
                });
            });

            describe('Inside of menu', () => {
                it('When popped open', () => {
                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    document.body.append(menuView.el);
                    menuView.open();
                    menuView.el.focus();

                    const firstItemEl = menuView.el.children[0] as HTMLElement;
                    expectMenuItemSelected(menuView, firstItemEl);

                    otherEl.focus();

                    expectMenuItemNotSelected(menuView, firstItemEl);
                    expect(menuView.isOpen).toBeFalse();
                });

                it('When embedded', () => {
                    menuView = craft`
                        <Ink.Menu embedded>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    document.body.append(menuView.el);
                    menuView.open();
                    menuView.el.focus();

                    const firstItemEl = menuView.el.children[0] as HTMLElement;
                    expectMenuItemSelected(menuView, firstItemEl);

                    otherEl.focus();

                    expectMenuItemNotSelected(menuView, firstItemEl);
                    expect(menuView.isOpen).toBeTrue();
                });
            });
        });

        describe('Keydown', () => {
            it('Typeahead buffer match', () => {
                menuView = craft`
                    <Ink.Menu>
                     <Ink.Menu.Item>
                      Item 1
                     </Ink.Menu.Item>
                     <Ink.Menu.Item>
                      Item 123
                     </Ink.Menu.Item>
                     <Ink.Menu.Item>
                      Item 456
                     </Ink.Menu.Item>
                    </Ink.Menu>
                `;
                menuView.open();

                sendKeys(menuView.el, 'item 12');

                expectMenuItemSelected(
                    menuView,
                    menuView.el.children[1] as HTMLElement);
            });

            describe('Enter', () => {
                it('No item selected', () => {
                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    sendKeys(menuView.el, ['Enter']);

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeTrue();
                });

                it('On menu item', () => {
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item onClick=${onClick}>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ['Enter']);

                    expect(onClick).toHaveBeenCalled();

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeFalse();
                });

                it('On checkbox menu item', () => {
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.CheckboxItem onClick=${onClick}>
                          Item 1
                         </Ink.Menu.CheckboxItem>
                         <Ink.Menu.CheckboxItem>
                          Item 123
                         </Ink.Menu.CheckboxItem>
                         <Ink.Menu.CheckboxItem>
                          Item 456
                         </Ink.Menu.CheckboxItem>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ['Enter']);

                    const menuItemEl = menuView.el.children[0] as HTMLElement;

                    expectMenuItemChecked(menuView, menuItemEl);

                    expect(onClick).toHaveBeenCalled();

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeFalse();
                });

                it('On radio menu item', () => {
                    const radioGroup = new MenuItemsRadioGroup();
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.RadioItem radioGroup=${radioGroup}
                                             onClick=${onClick}>
                          Item 1
                         </Ink.Menu.RadioItem>
                         <Ink.Menu.RadioItem radioGroup=${radioGroup}
                                             checked>
                          Item 123
                         </Ink.Menu.RadioItem>
                         <Ink.Menu.RadioItem radioGroup=${radioGroup}>
                          Item 456
                         </Ink.Menu.RadioItem>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ['Enter']);

                    const menuItemEl = menuView.el.children[0] as HTMLElement;

                    expectMenuItemChecked(menuView, menuItemEl);
                    expectMenuItemNotChecked(
                        menuView,
                        menuView.el.children[1] as HTMLElement);

                    expect(onClick).toHaveBeenCalled();

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeFalse();
                });

                it('On separator', () => {
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Separator onClick=${onClick}/>
                         <Ink.Menu.Separator/>
                         <Ink.Menu.Separator/>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ['Enter']);

                    expect(onClick).not.toHaveBeenCalled();

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeTrue();
                });
            });

            describe('Space', () => {
                it('No item selected', () => {
                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    sendKeys(menuView.el, ' ');

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeTrue();
                });

                it('On menu item', () => {
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item onClick=${onClick}>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 123
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 456
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ' ');

                    expect(onClick).toHaveBeenCalled();

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeFalse();
                });

                it('On checkbox menu item', () => {
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.CheckboxItem onClick=${onClick}>
                          Item 1
                         </Ink.Menu.CheckboxItem>
                         <Ink.Menu.CheckboxItem>
                          Item 123
                         </Ink.Menu.CheckboxItem>
                         <Ink.Menu.CheckboxItem>
                          Item 456
                         </Ink.Menu.CheckboxItem>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ' ');

                    const menuItemEl = menuView.el.children[0] as HTMLElement;

                    expectMenuItemChecked(menuView, menuItemEl);

                    expect(onClick).toHaveBeenCalled();

                    expectMenuItemSelected(menuView, menuItemEl);
                    expect(menuView.isOpen).toBeTrue();
                });

                it('On radio menu item', () => {
                    const radioGroup = new MenuItemsRadioGroup();
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.RadioItem radioGroup=${radioGroup}
                                             onClick=${onClick}>
                          Item 1
                         </Ink.Menu.RadioItem>
                         <Ink.Menu.RadioItem radioGroup=${radioGroup}
                                             checked>
                          Item 123
                         </Ink.Menu.RadioItem>
                         <Ink.Menu.RadioItem radioGroup=${radioGroup}>
                          Item 456
                         </Ink.Menu.RadioItem>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ' ');

                    const menuItemEl = menuView.el.children[0] as HTMLElement;

                    expectMenuItemChecked(menuView, menuItemEl);
                    expectMenuItemNotChecked(
                        menuView,
                        menuView.el.children[1] as HTMLElement);

                    expect(onClick).toHaveBeenCalled();

                    expectMenuItemSelected(menuView, menuItemEl);
                    expect(menuView.isOpen).toBeTrue();
                });

                it('On separator', () => {
                    const onClick = jasmine.createSpy('onClick');

                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Separator onClick=${onClick}/>
                         <Ink.Menu.Separator/>
                         <Ink.Menu.Separator/>
                        </Ink.Menu>
                    `;
                    menuView.open();

                    menuView.setCurrentItem(0);
                    sendKeys(menuView.el, ' ');

                    expect(onClick).not.toHaveBeenCalled();

                    expectNoMenuItemSelected(menuView);
                    expect(menuView.isOpen).toBeTrue();
                });
            });

            for (const key of ['ArrowDown', 'Down']) {
                describe(key, () => {
                    it('With item below', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(0);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[1] as HTMLElement);
                    });

                    it('At last item', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(2);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[0] as HTMLElement);
                    });
                });
            }

            for (const key of ['ArrowUp', 'Up']) {
                describe(key, () => {
                    it('With item above', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(1);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[0] as HTMLElement);
                    });

                    it('At last item', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(0);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[2] as HTMLElement);
                    });
                });
            }

            for (const key of ['Home', 'PageUp']) {
                describe(key, () => {
                    it('With item above', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(1);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[0] as HTMLElement);
                    });

                    it('At first item', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(0);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[0] as HTMLElement);
                    });
                });
            }

            for (const key of ['End', 'PageDown']) {
                describe(key, () => {
                    it('With item below', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(1);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[2] as HTMLElement);
                    });

                    it('At last item', () => {
                        menuView = craft`
                            <Ink.Menu embedded>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 123
                             </Ink.Menu.Item>
                             <Ink.Menu.Item>
                              Item 456
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        menuView.setCurrentItem(0);
                        sendKeys(menuView.el, [key]);

                        expectMenuItemSelected(
                            menuView,
                            menuView.el.children[2] as HTMLElement);
                    });
                });
            }

            for (const key of ['Escape', 'Tab']) {
                describe(key, () => {
                    it('When popped open', () => {
                        const controllerEl = paint<HTMLElement>`
                            <div tabIndex=0/>
                        `;
                        document.body.appendChild(controllerEl);

                        menuView = craft`
                            <Ink.Menu controllerEl=${controllerEl}>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;
                        menuView.open();

                        sendKeys(menuView.el, [key]);

                        expect(menuView.isOpen).toBeFalse();
                        expect(document.activeElement).toBe(controllerEl);
                    });

                    it('When embedded', () => {
                        const controllerEl = paint<HTMLElement>`
                            <div tabIndex=0/>
                        `;
                        document.body.appendChild(controllerEl);

                        menuView = craft`
                            <Ink.Menu embedded controllerEl=${controllerEl}>
                             <Ink.Menu.Item>
                              Item 1
                             </Ink.Menu.Item>
                            </Ink.Menu>
                        `;

                        sendKeys(menuView.el, [key]);

                        expect(menuView.isOpen).toBeTrue();
                        expect(document.activeElement).toBe(controllerEl);
                    });
                });
            }
        });

        /*
         * NOTE: The event we use in the view is 'mouseenter', but Backbone
         *       uses jQuery, which emulates 'mouseenter' using 'mouseover'
         *       for wider browser support.
         */
        describe('mouseover', () => {
            it('To item', () => {
                menuView = craft`
                    <Ink.Menu embedded>
                     <Ink.Menu.Item>
                      Item 1
                     </Ink.Menu.Item>
                    </Ink.Menu>
                `;
                document.body.appendChild(menuView.el);

                const menuItemEl = menuView.el.children[0] as HTMLElement;

                menuItemEl.dispatchEvent(
                    new window.MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                    }));

                expectMenuItemSelected(menuView, menuItemEl);
            });

            it('To non-item', () => {
                menuView = craft`
                    <Ink.Menu embedded>
                     <Ink.Menu.Item>
                      Item 1
                     </Ink.Menu.Item>
                     <Ink.Menu.Separator/>
                     <Ink.Menu.Item>
                      Item 2
                     </Ink.Menu.Item>
                    </Ink.Menu>
                `;
                document.body.appendChild(menuView.el);

                const menuItemEl = menuView.el.children[1] as HTMLElement;

                menuItemEl.dispatchEvent(
                    new window.MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                    }));

                expectNoMenuItemSelected(menuView);
            });
        });

        /*
         * NOTE: The event we use in the view is 'mouseleave', but Backbone
         *       uses jQuery, which emulates 'mouseleave' using 'mouseout'
         *       for wider browser support.
         */
        describe('mouseout', () => {
            it('To inner child', () => {
                menuView = craft`
                    <Ink.Menu embedded>
                     <Ink.Menu.Item>
                      Item 1
                     </Ink.Menu.Item>
                     <Ink.Menu.Item>
                      Item 2
                     </Ink.Menu.Item>
                    </Ink.Menu>
                `;
                document.body.appendChild(menuView.el);

                menuView.setCurrentItem(0);

                const menuItemEl = menuView.el.children[0] as HTMLElement;

                menuItemEl.dispatchEvent(
                    new window.MouseEvent('mouseout', {
                        bubbles: true,
                        cancelable: true,
                        relatedTarget: menuView.el.children[1],
                    }));

                expectMenuItemSelected(menuView, menuItemEl);
            });

            describe('Outside menu', () => {
                it('With sticky open', () => {
                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 2
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    document.body.appendChild(menuView.el);

                    menuView.open({
                        sticky: true,
                    });
                    menuView.setCurrentItem(0);

                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.isStickyOpen).toBeTrue();

                    const menuItemEl = menuView.el.children[0] as HTMLElement;

                    menuItemEl.dispatchEvent(
                        new window.MouseEvent('mouseout', {
                            bubbles: true,
                            cancelable: true,
                            relatedTarget: document.body,
                        }));

                    expectNoMenuItemSelected(menuView);

                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.isStickyOpen).toBeTrue();
                });

                it('With standard open', () => {
                    menuView = craft`
                        <Ink.Menu>
                         <Ink.Menu.Item>
                          Item 1
                         </Ink.Menu.Item>
                         <Ink.Menu.Item>
                          Item 2
                         </Ink.Menu.Item>
                        </Ink.Menu>
                    `;
                    document.body.appendChild(menuView.el);

                    menuView.open();
                    menuView.setCurrentItem(0);

                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.isStickyOpen).toBeFalse();

                    const menuItemEl = menuView.el.children[0] as HTMLElement;

                    menuItemEl.dispatchEvent(
                        new window.MouseEvent('mouseout', {
                            bubbles: true,
                            cancelable: true,
                            relatedTarget: document.body,
                        }));

                    expectNoMenuItemSelected(menuView);

                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.isStickyOpen).toBeNull();
                });
            });
        });
    });

    describe('Menu Item Events', () => {
        it('Item clicked', () => {
            const onClick = jasmine.createSpy('onClick');
            const onParentClick = jasmine.createSpy('onClick');

            menuView = craft`
                <Ink.Menu>
                 <Ink.Menu.Item onClick=${onClick}>
                  Item 1
                 </Ink.Menu.Item>
                </Ink.Menu>
            `;
            menuView.open();

            const parentEl = paint<HTMLDivElement>`<div>${menuView}</div>`;
            parentEl.addEventListener('click', onParentClick);

            (menuView.el.children[0] as HTMLElement).click();

            expect(onClick).toHaveBeenCalled();
            expect(onParentClick).not.toHaveBeenCalled();

            expect(menuView.isOpen).toBeFalse();
        });

        it('Separator clicked', () => {
            const onClick = jasmine.createSpy('onClick');
            const onParentClick = jasmine.createSpy('onClick');

            menuView = craft`
                <Ink.Menu>
                 <Ink.Menu.Separator onClick=${onClick}/>
                </Ink.Menu>
            `;
            menuView.open();

            const parentEl = paint<HTMLDivElement>`<div>${menuView}</div>`;
            parentEl.addEventListener('click', onParentClick);

            (menuView.el.children[0] as HTMLElement).click();

            expect(onClick).not.toHaveBeenCalled();
            expect(onParentClick).not.toHaveBeenCalled();

            expect(menuView.isOpen).toBeTrue();
        });

        describe('Checkbox item clicked', () => {
            it('When checked', () => {
                const onClick = jasmine.createSpy('onClick');
                const onParentClick = jasmine.createSpy('onClick');

                menuView = craft`
                    <Ink.Menu>
                     <Ink.Menu.CheckboxItem checked onClick=${onClick}>
                      Item 1
                     </Ink.Menu.CheckboxItem>
                    </Ink.Menu>
                `;
                menuView.open();

                const parentEl = paint<HTMLDivElement>`<div>${menuView}</div>`;
                parentEl.addEventListener('click', onParentClick);

                const menuItemEl = menuView.el.children[0] as HTMLElement;
                expectMenuItemChecked(menuView, menuItemEl);

                menuItemEl.click();

                expect(onClick).toHaveBeenCalled();
                expect(onParentClick).not.toHaveBeenCalled();
                expectMenuItemNotChecked(menuView, menuItemEl);
                expect(menuView.isOpen).toBeTrue();
            });

            it('When not checked', () => {
                const onClick = jasmine.createSpy('onClick');
                const onParentClick = jasmine.createSpy('onClick');

                menuView = craft`
                    <Ink.Menu>
                     <Ink.Menu.CheckboxItem onClick=${onClick}>
                      Item 1
                     </Ink.Menu.CheckboxItem>
                    </Ink.Menu>
                `;
                menuView.open();

                const parentEl = paint<HTMLDivElement>`<div>${menuView}</div>`;
                parentEl.addEventListener('click', onParentClick);

                const menuItemEl = menuView.el.children[0] as HTMLElement;
                expectMenuItemNotChecked(menuView, menuItemEl);

                menuItemEl.click();

                expect(onClick).toHaveBeenCalled();
                expect(onParentClick).not.toHaveBeenCalled();
                expectMenuItemChecked(menuView, menuItemEl);
                expect(menuView.isOpen).toBeTrue();
            });
        });

        describe('Radio item clicked', () => {
            it('When checked', () => {
                const onClick = jasmine.createSpy('onClick');
                const onParentClick = jasmine.createSpy('onClick');

                const radioGroup = new MenuItemsRadioGroup();

                menuView = craft`
                    <Ink.Menu>
                     <Ink.Menu.RadioItem radioGroup=${radioGroup}
                                         onClick=${onClick}
                      Item 1
                     </Ink.Menu.RadioItem>
                     <Ink.Menu.RadioItem checked
                                         radioGroup=${radioGroup}
                                         onClick=${onClick}>
                      Item 2
                     </Ink.Menu.RadioItem>
                    </Ink.Menu>
                `;
                menuView.open();

                const parentEl = paint<HTMLDivElement>`<div>${menuView}</div>`;
                parentEl.addEventListener('click', onParentClick);

                const menuItemEl1 = menuView.el.children[0] as HTMLElement;
                const menuItemEl2 = menuView.el.children[1] as HTMLElement;

                expectMenuItemNotChecked(menuView, menuItemEl1);
                expectMenuItemChecked(menuView, menuItemEl2);

                menuItemEl2.click();

                expect(onClick).toHaveBeenCalled();
                expect(onParentClick).not.toHaveBeenCalled();
                expectMenuItemNotChecked(menuView, menuItemEl1);
                expectMenuItemChecked(menuView, menuItemEl2);
                expect(menuView.isOpen).toBeTrue();
            });

            it('When not checked', () => {
                const onClick = jasmine.createSpy('onClick');
                const onParentClick = jasmine.createSpy('onClick');

                const radioGroup = new MenuItemsRadioGroup();

                menuView = craft`
                    <Ink.Menu>
                     <Ink.Menu.RadioItem radioGroup=${radioGroup}
                                         onClick=${onClick}
                      Item 1
                     </Ink.Menu.RadioItem>
                     <Ink.Menu.RadioItem checked
                                         radioGroup=${radioGroup}
                                         onClick=${onClick}>
                      Item 2
                     </Ink.Menu.RadioItem>
                    </Ink.Menu>
                `;
                menuView.open();

                const parentEl = paint<HTMLDivElement>`<div>${menuView}</div>`;
                parentEl.addEventListener('click', onParentClick);

                const menuItemEl1 = menuView.el.children[0] as HTMLElement;
                const menuItemEl2 = menuView.el.children[1] as HTMLElement;

                expectMenuItemNotChecked(menuView, menuItemEl1);
                expectMenuItemChecked(menuView, menuItemEl2);

                menuItemEl1.click();

                expect(onClick).toHaveBeenCalled();
                expect(onParentClick).not.toHaveBeenCalled();
                expectMenuItemChecked(menuView, menuItemEl1);
                expectMenuItemNotChecked(menuView, menuItemEl2);
                expect(menuView.isOpen).toBeTrue();
            });
        });

        it('Checkbox item updated', () => {
            menuView = craft`
                <Ink.Menu embedded>
                 <Ink.Menu.CheckboxItem>
                  Item 1
                 </Ink.Menu.CheckboxItem>
                 <Ink.Menu.CheckboxItem checked>
                  Item 2
                 </Ink.Menu.CheckboxItem>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;
            const menuItemEls = menuView.el.children;
            const menuItemEl1 = menuItemEls[0] as HTMLElement;
            const menuItemEl2 = menuItemEls[1] as HTMLElement;

            expectMenuItemNotChecked(menuView, menuItemEl1);
            expectMenuItemChecked(menuView, menuItemEl2);

            menuItems.at(0).set('checked', true);

            expectMenuItemChecked(menuView, menuItemEl1);
            expectMenuItemChecked(menuView, menuItemEl2);

            menuItems.at(1).set('checked', false);

            expectMenuItemChecked(menuView, menuItemEl1);
            expectMenuItemNotChecked(menuView, menuItemEl2);
        });

        it('Radio menu item updated', () => {
            const radioGroup = new MenuItemsRadioGroup();

            menuView = craft`
                <Ink.Menu embedded>
                 <Ink.Menu.RadioItem radioGroup=${radioGroup}>
                  Item 1
                 </Ink.Menu.RadioItem>
                 <Ink.Menu.RadioItem checked radioGroup=${radioGroup}>
                  Item 2
                 </Ink.Menu.RadioItem>
                </Ink.Menu>
            `;

            const menuItems = menuView.menuItems;
            const menuItemEls = menuView.el.children;

            const menuItemEl1 = menuItemEls[0] as HTMLElement;
            const menuItemEl2 = menuItemEls[1] as HTMLElement;

            expectMenuItemNotChecked(menuView, menuItemEl1);
            expectMenuItemChecked(menuView, menuItemEl2);

            menuItems.at(0).set('checked', true);

            expectMenuItemChecked(menuView, menuItemEl1);
            expectMenuItemNotChecked(menuView, menuItemEl2);
        });

        it('Document click when open', () => {
            menuView = craft`<Ink.Menu/>`;
            menuView.open();
            expect(menuView.isOpen).toBeTrue();

            document.body.click();

            expect(menuView.isOpen).toBeFalse();
        });
    });

    describe('Methods', () => {
        describe('close', () => {
            it('When closed', () => {
                const onClosing = jasmine.createSpy('onClosing');
                const onClosed = jasmine.createSpy('onClosed');

                menuView = craft`<Ink.Menu/>`;
                menuView.on('closing', onClosing);
                menuView.on('closed', onClosed);

                /* This should do nothing. */
                expect(() => {
                    menuView.close({
                        animate: false,
                    });
                }).not.toThrow();

                expect(onClosing).not.toHaveBeenCalled();
                expect(onClosed).not.toHaveBeenCalled();

                expect(menuView.isOpen).toBeFalse();
                expect(menuView.isStickyOpen).toBeNull();
            });

            it('When embedded', () => {
                const onClosing = jasmine.createSpy('onClosing');
                const onClosed = jasmine.createSpy('onClosed');

                menuView = craft`<Ink.Menu embedded/>`;
                menuView.on('closing', onClosing);
                menuView.on('closed', onClosed);

                menuView.menuItems.add([
                    {label: 'Item 1'},
                    {label: 'Item 2'},
                ]);
                menuView.render();
                menuView.open({
                    animate: false,
                });
                menuView.setCurrentItem(1);

                expectMenuItemSelected(
                    menuView,
                    menuView.el.children[1] as HTMLElement);

                menuView.close();

                expect(onClosing).not.toHaveBeenCalled();
                expect(onClosed).not.toHaveBeenCalled();
                expectNoMenuItemSelected(menuView);

                expect(menuView.isOpen).toBeTrue();
                expect(menuView.isStickyOpen).toBeTrue();
            });

            it('With animate=false', onDone => {
                const onClosing = jasmine.createSpy('onClosing', () => {
                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.el).toHaveClass('-is-open');
                    expect(menuView.el).toHaveClass('js-no-animation');
                    expect(menuView.el.tabIndex).toBe(0);

                    expect(MenuView.openedMenu).toBe(menuView);
                }).and.callThrough();

                const onClosed = jasmine.createSpy('onClosed', () => {
                    expect(onClosing).toHaveBeenCalled();

                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.el).not.toHaveClass('-is-open');
                    expect(menuView.el).toHaveClass('js-no-animation');
                    expect(menuView.el.tabIndex).toBe(-1);

                    expect(MenuView.openedMenu).toBeNull();

                    setTimeout(() => {
                        expect(menuView.el).not.toHaveClass('js-no-animation');

                        onDone();
                    }, 50);
                }).and.callThrough();

                menuView = craft`<Ink.Menu/>`;
                menuView.on('closing', onClosing);
                menuView.on('closed', onClosed);
                menuView.on('opened', () => {
                    menuView.close({
                        animate: false,
                    });
                });

                menuView.open({
                    animate: false,
                });
            });

            it('With controllerEl', onDone => {
                const controllerEl = document.createElement('div');

                const onClosing = jasmine.createSpy('onClosing');
                const onClosed = jasmine.createSpy('onClosed', () => {
                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.el).not.toHaveClass('-is-open');
                    expect(menuView.el.tabIndex).toBe(-1);

                    expect(controllerEl).not.toHaveClass('-is-menu-open');
                    expect(controllerEl.getAttribute('aria-expanded'))
                        .toBe('false');

                    expect(MenuView.openedMenu).toBeNull();

                    expect(onClosing).toHaveBeenCalled();

                    onDone();
                }).and.callThrough();

                menuView = craft`
                    <Ink.Menu controllerEl=${controllerEl}/>
                `;
                menuView.on('closing', onClosing);
                menuView.on('closed', onClosed);
                menuView.on('opened', () => {
                    menuView.close();
                });

                menuView.open({
                    animate: false,
                });
            });

            it('With delay', onDone => {
                const onClosing = jasmine.createSpy('onClosing');
                const onClosed = jasmine.createSpy('onClosed', () => {
                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.el).not.toHaveClass('-is-open');
                    expect(menuView.el.tabIndex).toBe(-1);
                    expect(MenuView.openedMenu).toBeNull();
                    expect(onClosing).toHaveBeenCalled();

                    onDone();
                }).and.callThrough();

                menuView = craft`<Ink.Menu/>`;
                menuView.on('closing', onClosing);
                menuView.on('closed', onClosed);
                menuView.on('opened', () => {
                    menuView.close({
                        delay: true,
                    });

                    /* Nothing should change until the timeout completes. */
                    expect(menuView.isOpen).toBeTrue();
                    expect(onClosing).not.toHaveBeenCalled();
                    expect(onClosed).not.toHaveBeenCalled();
                    expect(MenuView.openedMenu).toBe(menuView);
                });

                menuView.open({
                    animate: false,
                });
            });

            it('With triggerEvents=false', onDone => {
                const onClosing = jasmine.createSpy('onClosing');
                const onClosed = jasmine.createSpy('onClosed');

                menuView = craft`<Ink.Menu/>`;
                menuView.on('closing', onClosing);
                menuView.on('closed', onClosed);
                menuView.on('opened', () => {
                    menuView.close({
                        triggerEvents: false,
                    });

                    /* Nothing should change until the timeout completes. */
                    expect(menuView.isOpen).toBeFalse();
                    expect(onClosing).not.toHaveBeenCalled();
                    expect(onClosed).not.toHaveBeenCalled();
                    expect(MenuView.openedMenu).toBeNull();

                    onDone();
                });

                menuView.open();
            });
        });

        describe('open', () => {
            it('When open', () => {
                const onOpening = jasmine.createSpy('onOpening');
                const onOpened = jasmine.createSpy('onOpened');

                menuView = craft`<Ink.Menu/>`;
                menuView.open({
                    animate: false,
                });

                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);

                /* This should do nothing. */
                expect(() => {
                    menuView.open({
                        animate: false,
                    });
                }).not.toThrow();

                expect(onOpening).not.toHaveBeenCalled();
                expect(onOpened).not.toHaveBeenCalled();

                expect(menuView.isOpen).toBeTrue();
                expect(menuView.isStickyOpen).toBeFalse();
            });

            it('With defaults', onDone => {
                const onOpening = jasmine.createSpy('onOpening', () => {
                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.isStickyOpen).toBeFalse();
                    expect(menuView.el).not.toHaveClass('-is-open');
                    expect(menuView.el).not.toHaveClass('js-no-animation');
                    expect(menuView.el.tabIndex).toBe(-1);

                    expect(MenuView.openedMenu).toBeNull();
                }).and.callThrough();

                const onOpened = jasmine.createSpy('onOpened', () => {
                    expect(onOpening).toHaveBeenCalled();

                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.isStickyOpen).toBeFalse();
                    expect(menuView.el).toHaveClass('-is-open');
                    expect(menuView.el).not.toHaveClass('js-no-animation');
                    expect(menuView.el.tabIndex).toBe(0);

                    expect(MenuView.openedMenu).toBe(menuView);
                    expectNoMenuItemSelected(menuView);

                    onDone();
                }).and.callThrough();

                menuView = craft`<Ink.Menu/>`;
                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);

                expect(menuView.isStickyOpen).toBeNull();

                menuView.open();
            });

            it('With animate=false', onDone => {
                const onOpening = jasmine.createSpy('onOpening', () => {
                    expect(menuView.isOpen).toBeFalse();
                    expect(menuView.el).not.toHaveClass('-is-open');
                    expect(menuView.el).toHaveClass('js-no-animation');
                    expect(menuView.el.tabIndex).toBe(-1);

                    expect(MenuView.openedMenu).toBeNull();
                }).and.callThrough();

                const onOpened = jasmine.createSpy('onOpened', () => {
                    expect(onOpening).toHaveBeenCalled();

                    expect(menuView.isOpen).toBeTrue();
                    expect(menuView.el).toHaveClass('-is-open');
                    expect(menuView.el).toHaveClass('js-no-animation');
                    expect(menuView.el.tabIndex).toBe(0);

                    expect(MenuView.openedMenu).toBe(menuView);
                    expectNoMenuItemSelected(menuView);

                    setTimeout(() => {
                        expect(menuView.el).not.toHaveClass('js-no-animation');

                        onDone();
                    }, 50);
                }).and.callThrough();

                menuView = craft`<Ink.Menu/>`;
                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);

                menuView.open({
                    animate: false,
                });
            });

            describe('With stickyOpen=true', () => {
                it('When closed', onDone => {
                    const onOpening = jasmine.createSpy('onOpening', () => {
                        expect(menuView.isOpen).toBeFalse();
                        expect(menuView.isStickyOpen).toBeTrue();
                        expect(menuView.el).not.toHaveClass('-is-open');
                        expect(menuView.el).not.toHaveClass('js-no-animation');
                        expect(menuView.el.tabIndex).toBe(-1);

                        expect(MenuView.openedMenu).toBeNull();
                    }).and.callThrough();

                    const onOpened = jasmine.createSpy('onOpened', () => {
                        expect(onOpening).toHaveBeenCalled();

                        expect(menuView.isOpen).toBeTrue();
                        expect(menuView.isStickyOpen).toBeTrue();
                        expect(menuView.el).toHaveClass('-is-open');
                        expect(menuView.el).not.toHaveClass('js-no-animation');
                        expect(menuView.el.tabIndex).toBe(0);

                        expect(MenuView.openedMenu).toBe(menuView);
                        expectNoMenuItemSelected(menuView);

                        onDone();
                    }).and.callThrough();

                    menuView = craft`<Ink.Menu/>`;
                    menuView.on('opening', onOpening);
                    menuView.on('opened', onOpened);

                    expect(menuView.isStickyOpen).toBeNull();

                    menuView.open({
                        sticky: true,
                    });
                });

                it('When opened', onDone => {
                    const onOpening = jasmine.createSpy('onOpening', () => {
                        expect(menuView.isOpen).toBeFalse();
                        expect(menuView.isStickyOpen).toBeFalse();
                        expect(menuView.el).not.toHaveClass('-is-open');
                        expect(menuView.el).not.toHaveClass('js-no-animation');
                        expect(menuView.el.tabIndex).toBe(-1);

                        expect(MenuView.openedMenu).toBeNull();
                    }).and.callThrough();

                    const onOpened = jasmine.createSpy('onOpened', () => {
                        expect(onOpening).toHaveBeenCalled();

                        expect(menuView.isOpen).toBeTrue();
                        expect(menuView.isStickyOpen).toBeFalse();
                        expect(menuView.el).toHaveClass('-is-open');
                        expect(menuView.el).not.toHaveClass('js-no-animation');
                        expect(menuView.el.tabIndex).toBe(0);

                        expect(MenuView.openedMenu).toBe(menuView);
                        expectNoMenuItemSelected(menuView);

                        menuView.open({
                            sticky: true,
                        });

                        expect(menuView.isStickyOpen).toBeTrue();

                        onDone();
                    }).and.callThrough();

                    menuView = craft`<Ink.Menu/>`;
                    menuView.on('opening', onOpening);
                    menuView.on('opened', onOpened);

                    expect(menuView.isStickyOpen).toBeNull();

                    menuView.open();
                });
            });

            it('With triggerEvents=false', () => {
                const onOpening = jasmine.createSpy('onOpening');
                const onOpened = jasmine.createSpy('onOpened');

                menuView = craft`<Ink.Menu/>`;
                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);

                menuView.open({
                    triggerEvents: false,
                });

                expect(onOpening).not.toHaveBeenCalled();
                expect(onOpened).not.toHaveBeenCalled();
            });

            it('With controllerEl', onDone => {
                const controllerEl = document.createElement('div');

                const onOpening = jasmine.createSpy('onOpening');
                const onOpened = jasmine.createSpy('onOpened', () => {
                    expect(onOpening).toHaveBeenCalled();

                    expect(controllerEl.getAttribute('aria-expanded'))
                        .toBe('true');
                    expect(controllerEl).toHaveClass('-is-menu-open');

                    onDone();
                }).and.callThrough();

                menuView = craft`
                    <Ink.Menu controllerEl=${controllerEl}/>
                `;
                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);
                menuView.open();

                menuView.open({
                    currentItemIndex: 1,
                });
            });

            it('With currentItemIndex', onDone => {
                const onOpening = jasmine.createSpy('onOpening');
                const onOpened = jasmine.createSpy('onOpened', () => {
                    expect(onOpening).toHaveBeenCalled();

                    expectMenuItemSelected(
                        menuView,
                        menuView.el.children[1] as HTMLElement);

                    onDone();
                }).and.callThrough();

                menuView = craft`<Ink.Menu/>`;
                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);

                menuView.menuItems.add([
                    {label: 'Item 1'},
                    {label: 'Item 2'},
                ]);
                menuView.render();

                menuView.open({
                    currentItemIndex: 1,
                });
            });

            it('After delayed close', onDone => {
                const onOpening = jasmine.createSpy('onOpening');
                const onOpened = jasmine.createSpy('onOpened', () => {
                    expect(onOpening).toHaveBeenCalled();

                    expectMenuItemSelected(
                        menuView,
                        menuView.el.children[1] as HTMLElement);

                    onDone();
                }).and.callThrough();

                menuView = craft`<Ink.Menu/>`;
                menuView.on('opening', onOpening);
                menuView.on('opened', onOpened);

                menuView.menuItems.add([
                    {label: 'Item 1'},
                    {label: 'Item 2'},
                ]);
                menuView.render();

                menuView.open({
                    currentItemIndex: 1,
                });
            });
        });

        describe('setCurrentItem', () => {
            beforeEach(() => {
                menuView = craft`
                    <Ink.Menu embedded>
                     <Ink.Menu.Item>Item 1</Ink.Menu.Item>
                     <Ink.Menu.Item>Item 2</Ink.Menu.Item>
                    </Ink.Menu>
                `;

                expectNoMenuItemSelected(menuView);
            });

            it('To valid index', () => {
                /* Set it once. */
                menuView.setCurrentItem(0);

                const children = menuView.el.children;
                const itemEl1 = children[0] as HTMLElement;
                const itemEl2 = children[1] as HTMLElement;

                expectMenuItemSelected(menuView, itemEl1);

                /* Set it a second time. */
                menuView.setCurrentItem(1);

                expectMenuItemSelected(menuView, itemEl2);
                expectMenuItemNotSelected(menuView, itemEl1);
            });

            it('To negative index', () => {
                menuView.setCurrentItem(-5);

                expectMenuItemSelected(
                    menuView,
                    menuView.el.children[1] as HTMLElement);
            });

            it('To index past length', () => {
                menuView.setCurrentItem(999);

                expectMenuItemSelected(
                    menuView,
                    menuView.el.children[0] as HTMLElement);
            });
        });

        describe('toggle', () => {
            it('When closed', () => {
                menuView = craft`<Ink.Menu/>`;
                spyOn(menuView, 'open');

                menuView.toggle(
                    {
                        animate: false,
                    },
                    {});

                expect(menuView.open).toHaveBeenCalledWith({
                    animate: false,
                });
            });

            it('When opened', onDone => {
                menuView = craft`<Ink.Menu/>`;
                menuView.on('opened', () => {
                    spyOn(menuView, 'close');

                    menuView.toggle(
                        {},
                        {
                            animate: false,
                        });

                    expect(menuView.close).toHaveBeenCalledWith({
                        animate: false,
                    });

                    onDone();
                });

                menuView.open();
            });
        });
    });

    describe('Properties', () => {
        describe('isOpen', () => {
            it('With opened', () => {
                menuView = craft`<Ink.Menu/>`;
                menuView.open({
                    animate: false,
                });

                expect(menuView.isOpen).toBeTrue();
            });

            it('With not opened', () => {
                menuView = craft`<Ink.Menu/>`;

                expect(menuView.isOpen).toBeFalse();
            });

            it('With embedded mode', () => {
                menuView = craft`
                    <Ink.Menu embedded/>
                `;

                expect(menuView.isOpen).toBeTrue();
            });
        });
    });
});
