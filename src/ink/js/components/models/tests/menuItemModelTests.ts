/**
 * Unit tests for MenuItem.
 *
 * Version Added:
 *     1.0
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    MenuItem,
    MenuItemType,
} from '../menuItemModel';
import { MenuItemsRadioGroup } from '../../collections';


suite('components/models/MenuItem', () => {
    describe('Construction', () => {
        it('Default type', () => {
            const menuItem = new MenuItem();

            expect(menuItem.get('type')).toBe(MenuItemType.ITEM);
        });

        describe('With type=RADIO_ITEM', () => {
            it('With a radio group and checked=true', () => {
                const radioGroup = new MenuItemsRadioGroup();
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        checked: true,
                        radioGroup: radioGroup,
                        type: MenuItemType.RADIO_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('type')).toBe(MenuItemType.RADIO_ITEM);
                expect(menuItem.get('checked')).toBeTrue();
                expect(radioGroup).toHaveSize(1);
                expect(radioGroup.at(0)).toBe(menuItem);
            });

            it('With a radio group and checked=false', () => {
                const radioGroup = new MenuItemsRadioGroup();
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        checked: false,
                        radioGroup: radioGroup,
                        type: MenuItemType.RADIO_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('type')).toBe(MenuItemType.RADIO_ITEM);
                expect(menuItem.get('checked')).toBeFalse();
                expect(radioGroup).toHaveSize(1);
                expect(radioGroup.at(0)).toBe(menuItem);
            });

            it('With a radio group and checked as default', () => {
                const radioGroup = new MenuItemsRadioGroup();
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        radioGroup: radioGroup,
                        type: MenuItemType.RADIO_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('type')).toBe(MenuItemType.RADIO_ITEM);
                expect(menuItem.get('checked')).toBeFalse();
                expect(radioGroup).toHaveSize(1);
                expect(radioGroup.at(0)).toBe(menuItem);
            });

            it('Without a radio group', () => {
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        type: MenuItemType.RADIO_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('radioGroup')).toBeNull();
            });
        });

        describe('With type=CHECKBOX_ITEM', () => {
            it('With checked=true', () => {
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        checked: true,
                        type: MenuItemType.CHECKBOX_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('type')).toBe(MenuItemType.CHECKBOX_ITEM);
                expect(menuItem.get('checked')).toBeTrue();
            });

            it('With checked=false', () => {
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        checked: false,
                        type: MenuItemType.CHECKBOX_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('type')).toBe(MenuItemType.CHECKBOX_ITEM);
                expect(menuItem.get('checked')).toBeFalse();
            });

            it('With checked as default', () => {
                let menuItem: MenuItem;

                expect(() => {
                    menuItem = new MenuItem({
                        type: MenuItemType.CHECKBOX_ITEM,
                    });
                }).not.toThrow();

                expect(menuItem.get('type')).toBe(MenuItemType.CHECKBOX_ITEM);
                expect(menuItem.get('checked')).toBeFalse();
            });
        });

        it('With type=ITEM', () => {
            const menuItem = new MenuItem({
                type: MenuItemType.ITEM,
            });

            expect(menuItem.get('type')).toBe(MenuItemType.ITEM);
        });

        it('With type=SEPARATOR', () => {
            const menuItem = new MenuItem({
                type: MenuItemType.SEPARATOR,
            });

            expect(menuItem.get('type')).toBe(MenuItemType.SEPARATOR);
        });

        it('With unsupported type', () => {
            expect(() => {
                const menuItem = new MenuItem({
                    // @ts-expect-error
                    type: 'bad',
                });
            }).toThrow(Error('Invalid menu item type: "bad"'));
        });
    });

    describe('Methods', () => {
        describe('invokeAction', () => {
            describe('With type=CHECKBOX_ITEM', () => {
                it('When checked=true', () => {
                    const onClick = jasmine.createSpy('onClick');
                    const evt = new window.MouseEvent('click');

                    const menuItem = new MenuItem({
                        checked: true,
                        onClick: onClick,
                        type: MenuItemType.CHECKBOX_ITEM,
                    });

                    menuItem.invokeAction(evt);

                    expect(menuItem.get('checked')).toBeFalse();
                    expect(onClick).toHaveBeenCalledWith(evt);
                });

                it('When checked=false', () => {
                    const onClick = jasmine.createSpy('onClick');
                    const evt = new window.MouseEvent('click');

                    const menuItem = new MenuItem({
                        checked: false,
                        onClick: onClick,
                        type: MenuItemType.CHECKBOX_ITEM,
                    });

                    menuItem.invokeAction(evt);

                    expect(menuItem.get('checked')).toBeTrue();
                    expect(onClick).toHaveBeenCalledWith(evt);
                });

                it('When checked=null', () => {
                    const onClick = jasmine.createSpy('onClick');
                    const evt = new window.MouseEvent('click');

                    const menuItem = new MenuItem({
                        onClick: onClick,
                        type: MenuItemType.CHECKBOX_ITEM,
                    });

                    menuItem.invokeAction(evt);

                    expect(menuItem.get('checked')).toBeTrue();
                    expect(onClick).toHaveBeenCalledWith(evt);
                });
            });

            describe('With type=RADIO_ITEM', () => {
                let radioGroup: MenuItemsRadioGroup;
                let otherMenuItem: MenuItem;

                beforeEach(() => {
                    radioGroup = new MenuItemsRadioGroup();
                    otherMenuItem = new MenuItem({
                        radioGroup: radioGroup,
                        type: MenuItemType.RADIO_ITEM,
                    });
                });

                it('When checked=true', () => {
                    const onClick = jasmine.createSpy('onClick');
                    const evt = new window.MouseEvent('click');

                    const menuItem = new MenuItem({
                        checked: true,
                        radioGroup: radioGroup,
                        onClick: onClick,
                        type: MenuItemType.RADIO_ITEM,
                    });

                    menuItem.invokeAction(evt);

                    expect(onClick).toHaveBeenCalledWith(evt);
                    expect(menuItem.get('checked')).toBeTrue();
                    expect(otherMenuItem.get('checked')).toBeFalse();
                });

                it('When checked=false', () => {
                    const onClick = jasmine.createSpy('onClick');
                    const evt = new window.MouseEvent('click');

                    otherMenuItem.set('checked', true);

                    const menuItem = new MenuItem({
                        checked: false,
                        radioGroup: radioGroup,
                        onClick: onClick,
                        type: MenuItemType.RADIO_ITEM,
                    });

                    menuItem.invokeAction(evt);

                    expect(onClick).toHaveBeenCalledWith(evt);
                    expect(menuItem.get('checked')).toBeTrue();
                    expect(otherMenuItem.get('checked')).toBeFalse();
                });

                it('When checked=null', () => {
                    const onClick = jasmine.createSpy('onClick');
                    const evt = new window.MouseEvent('click');

                    otherMenuItem.set('checked', true);

                    const menuItem = new MenuItem({
                        onClick: onClick,
                        radioGroup: radioGroup,
                        type: MenuItemType.RADIO_ITEM,
                    });

                    menuItem.invokeAction(evt);

                    expect(onClick).toHaveBeenCalledWith(evt);
                    expect(menuItem.get('checked')).toBeTrue();
                    expect(otherMenuItem.get('checked')).toBeFalse();
                });
            });

            it('With type=ITEM', () => {
                const onClick = jasmine.createSpy('onClick');
                const evt = new window.MouseEvent('click');

                const menuItem = new MenuItem({
                    onClick: onClick,
                });

                menuItem.invokeAction(evt);

                expect(menuItem.get('checked')).toBeNull();
                expect(onClick).toHaveBeenCalledWith(evt);
            });

            it('With type=SEPARATOR', () => {
                const onClick = jasmine.createSpy('onClick');
                const evt = new window.MouseEvent('click');

                const menuItem = new MenuItem({
                    onClick: onClick,
                    type: MenuItemType.SEPARATOR,
                });

                menuItem.invokeAction(evt);

                expect(menuItem.get('checked')).toBeNull();
                expect(onClick).not.toHaveBeenCalledWith(evt);
            });
        });
    });
});
