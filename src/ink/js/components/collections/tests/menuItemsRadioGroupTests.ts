/**
 * Unit tests for MenuItemsRadioGroup.
 *
 * Version Added:
 *     0.5
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    MenuItem,
    MenuItemAttrs,
    MenuItemType,
} from '../../models';
import { MenuItemsRadioGroup } from '../menuItemsRadioGroup';


/**
 * Return a new radio menu item for testing.
 *
 * Args:
 *     attrs (MenuItemAttrs, optional):
 *         Attributes to include in the new menu item.
 *
 * Returns:
 *     MenuItem:
 *     The new menu item instance.
 */
function createMenuItem(attrs: MenuItemAttrs = {}) {
    return new MenuItem({
        type: MenuItemType.RADIO_ITEM,
        ...attrs
    });
}


suite('components/collections/MenuItemsRadioGroup', () => {
    describe('Construction', () => {
        it('With checked menu items', () => {
            const menuItem1 = createMenuItem();
            const menuItem2 = createMenuItem();
            const menuItem3 = createMenuItem({
                checked: true,
            });
            const menuItem4 = createMenuItem({
                checked: true,
            });

            const radioGroup = new MenuItemsRadioGroup([
                menuItem1,
                menuItem2,
                menuItem3,
                menuItem4,
            ]);

            expect(menuItem1.get('checked')).toBeFalse();
            expect(menuItem1.get('radioGroup')).toBe(radioGroup);
            expect(menuItem2.get('checked')).toBeFalse();
            expect(menuItem2.get('radioGroup')).toBe(radioGroup);
            expect(menuItem3.get('checked')).toBeFalse();
            expect(menuItem3.get('radioGroup')).toBe(radioGroup);
            expect(menuItem4.get('checked')).toBeTrue();
            expect(menuItem4.get('radioGroup')).toBe(radioGroup);
            expect(radioGroup.checkedMenuItem).toBe(menuItem4);
        });

        it('Without checked menu items', () => {
            const menuItem1 = createMenuItem();
            const menuItem2 = createMenuItem({
                checked: false,
            });
            const menuItem3 = createMenuItem({
                checked: null,
            });

            const radioGroup = new MenuItemsRadioGroup([
                menuItem1,
                menuItem2,
                menuItem3,
            ]);

            expect(menuItem1.get('checked')).toBeFalse();
            expect(menuItem1.get('radioGroup')).toBe(radioGroup);
            expect(menuItem2.get('checked')).toBeFalse();
            expect(menuItem2.get('radioGroup')).toBe(radioGroup);
            expect(menuItem3.get('checked')).toBeFalse();
            expect(menuItem3.get('radioGroup')).toBe(radioGroup);
            expect(radioGroup.checkedMenuItem).toBeNull();
        });
    });

    describe('Events', () => {
        let radioGroup: MenuItemsRadioGroup;

        beforeEach(() => {
            radioGroup = new MenuItemsRadioGroup();
        });

        describe('Menu item added', () => {
            it('With checked=true and no existing items', () => {
                const menuItem = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem);

                expect(menuItem.get('checked')).toBeTrue();
                expect(menuItem.get('radioGroup')).toBe(radioGroup);
                expect(radioGroup.checkedMenuItem).toBe(menuItem);
            });

            it('With checked=false and no existing items', () => {
                const menuItem = createMenuItem();
                radioGroup.add(menuItem);

                expect(menuItem.get('checked')).toBeFalse();
                expect(menuItem.get('radioGroup')).toBe(radioGroup);
                expect(radioGroup.checkedMenuItem).toBeNull();
            });

            it('With checked=true and existing items (all unchecked)', () => {
                radioGroup.add(createMenuItem());
                radioGroup.add(createMenuItem());

                const menuItem = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem);

                expect(menuItem.get('checked')).toBeTrue();
                expect(menuItem.get('radioGroup')).toBe(radioGroup);
                expect(radioGroup.checkedMenuItem).toBe(menuItem);
            });

            it('With checked=false and existing items (all unchecked)', () => {
                radioGroup.add(createMenuItem());

                const menuItem = createMenuItem();
                radioGroup.add(menuItem);

                expect(menuItem.get('checked')).toBeFalse();
                expect(menuItem.get('radioGroup')).toBe(radioGroup);
                expect(radioGroup.checkedMenuItem).toBeNull();
            });

            it('With checked=true and existing item checked', () => {
                const prevMenuItem = createMenuItem({
                    checked: true,
                });
                radioGroup.add(prevMenuItem);

                const menuItem = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem);

                expect(menuItem.get('checked')).toBeTrue();
                expect(menuItem.get('radioGroup')).toBe(radioGroup);
                expect(prevMenuItem.get('checked')).toBeFalse();
                expect(radioGroup.checkedMenuItem).toBe(menuItem);
            });
        });

        describe('Menu item removed', () => {
            it('With checked=true as last menu item', () => {
                const menuItem = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem);
                radioGroup.remove(menuItem);

                expect(menuItem.get('checked')).toBeTrue();
                expect(menuItem.get('radioGroup')).toBeNull();
                expect(radioGroup.checkedMenuItem).toBeNull();
            });

            it('With checked=false as last menu item', () => {
                const menuItem = createMenuItem();
                radioGroup.add(menuItem);
                radioGroup.remove(menuItem);

                expect(menuItem.get('checked')).toBeFalse();
                expect(menuItem.get('radioGroup')).toBeNull();
                expect(radioGroup.checkedMenuItem).toBeNull();
            });

            it('With checked=true with existing menu items', () => {
                const menuItem1 = createMenuItem();
                radioGroup.add(menuItem1);

                const menuItem2 = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem2);
                radioGroup.remove(menuItem2);

                expect(menuItem1.get('checked')).toBeFalse();
                expect(menuItem1.get('radioGroup')).toBe(radioGroup);
                expect(menuItem2.get('checked')).toBeTrue();
                expect(menuItem2.get('radioGroup')).toBeNull();
                expect(radioGroup.checkedMenuItem).toBeNull();
            });

            it('With checked=false with existing menu items', () => {
                const menuItem1 = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem1);

                const menuItem2 = createMenuItem();
                radioGroup.add(menuItem2);
                radioGroup.remove(menuItem2);

                expect(menuItem1.get('checked')).toBeTrue();
                expect(menuItem1.get('radioGroup')).toBe(radioGroup);
                expect(menuItem2.get('checked')).toBeFalse();
                expect(menuItem2.get('radioGroup')).toBeNull();
                expect(radioGroup.checkedMenuItem).toBe(menuItem1);
            });

            it('Disconnects signals', () => {
                const menuItem1 = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem1);

                const menuItem2 = createMenuItem();
                radioGroup.add(menuItem2);
                radioGroup.remove(menuItem2);

                menuItem2.set('checked', true);

                expect(menuItem1.get('checked')).toBeTrue();
                expect(menuItem1.get('radioGroup')).toBe(radioGroup);
                expect(menuItem2.get('checked')).toBeTrue();
                expect(menuItem2.get('radioGroup')).toBeNull();
                expect(radioGroup.checkedMenuItem).toBe(menuItem1);
            });
        });

        describe('Reset', () => {
            it('To empty', () => {
                const menuItem1 = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem1);

                const menuItem2 = createMenuItem();
                radioGroup.add(menuItem2);

                radioGroup.reset();

                expect(menuItem1.get('checked')).toBeTrue();
                expect(menuItem1.get('radioGroup')).toBeNull();
                expect(menuItem2.get('checked')).toBeFalse();
                expect(menuItem2.get('radioGroup')).toBeNull();
                expect(radioGroup.checkedMenuItem).toBeNull();

                /* Make sure this disconnected signals. */
                menuItem2.set('checked', true);
                expect(radioGroup.checkedMenuItem).toBeNull();
            });

            it('To new models', () => {
                const menuItem1 = createMenuItem({
                    checked: true,
                });
                radioGroup.add(menuItem1);

                const menuItem2 = createMenuItem();
                radioGroup.add(menuItem2);

                const menuItem3 = createMenuItem({
                    checked: true,
                });
                const menuItem4 = createMenuItem();

                radioGroup.reset([
                    menuItem3,
                    menuItem4,
                ]);

                expect(menuItem1.get('checked')).toBeTrue();
                expect(menuItem1.get('radioGroup')).toBeNull();
                expect(menuItem2.get('checked')).toBeFalse();
                expect(menuItem2.get('radioGroup')).toBeNull();
                expect(menuItem3.get('checked')).toBeTrue();
                expect(menuItem3.get('radioGroup')).toBe(radioGroup);
                expect(menuItem4.get('checked')).toBeFalse();
                expect(menuItem4.get('radioGroup')).toBe(radioGroup);
                expect(radioGroup.checkedMenuItem).toBe(menuItem3);

                /* Make sure this disconnected signals. */
                menuItem2.set('checked', true);
                expect(menuItem3.get('checked')).toBeTrue();
                expect(radioGroup.checkedMenuItem).toBe(menuItem3);
            });
        });

        it('Checked changed to true', () => {
            const menuItem1 = createMenuItem({
                checked: true,
            });
            radioGroup.add(menuItem1);

            const menuItem2 = createMenuItem();
            radioGroup.add(menuItem2);

            const onChecked = jasmine.createSpy('onChecked');
            radioGroup.on('change:checked', onChecked);

            menuItem2.set('checked', true);

            expect(menuItem1.get('checked')).toBeFalse();
            expect(menuItem1.get('radioGroup')).toBe(radioGroup);
            expect(menuItem2.get('checked')).toBeTrue();
            expect(menuItem2.get('radioGroup')).toBe(radioGroup);
            expect(radioGroup.checkedMenuItem).toBe(menuItem2);
            expect(onChecked).toHaveBeenCalledWith(menuItem1, false, {});
            expect(onChecked).toHaveBeenCalledWith(menuItem2, true, {});
        });

        it('Checked changed to false', () => {
            const menuItem1 = createMenuItem({
                checked: true,
            });
            radioGroup.add(menuItem1);

            const menuItem2 = createMenuItem();
            radioGroup.add(menuItem2);

            const onChecked = jasmine.createSpy('onChecked');
            radioGroup.on('change:checked', onChecked);

            menuItem1.set('checked', false);

            expect(menuItem1.get('checked')).toBeFalse();
            expect(menuItem1.get('radioGroup')).toBe(radioGroup);
            expect(menuItem2.get('checked')).toBeFalse();
            expect(menuItem2.get('radioGroup')).toBe(radioGroup);
            expect(radioGroup.checkedMenuItem).toBeNull();
            expect(onChecked).toHaveBeenCalledOnceWith(menuItem1, false, {});
        });

        it('Checked set from true to true', () => {
            const menuItem1 = createMenuItem({
                checked: true,
            });
            radioGroup.add(menuItem1);

            const menuItem2 = createMenuItem();
            radioGroup.add(menuItem2);

            const onChecked = jasmine.createSpy('onChecked');
            radioGroup.on('change:checked', onChecked);

            menuItem1.set('checked', true);

            expect(menuItem1.get('checked')).toBeTrue();
            expect(menuItem1.get('radioGroup')).toBe(radioGroup);
            expect(menuItem2.get('checked')).toBeFalse();
            expect(menuItem2.get('radioGroup')).toBe(radioGroup);
            expect(radioGroup.checkedMenuItem).toBe(menuItem1);
            expect(onChecked).not.toHaveBeenCalled();
        });

        it('Checked set from false to false', () => {
            const menuItem1 = createMenuItem({
                checked: true,
            });
            radioGroup.add(menuItem1);

            const menuItem2 = createMenuItem();
            radioGroup.add(menuItem2);

            const onChecked = jasmine.createSpy('onChecked');
            radioGroup.on('change:checked', onChecked);

            menuItem2.set('checked', false);

            expect(menuItem1.get('checked')).toBeTrue();
            expect(menuItem1.get('radioGroup')).toBe(radioGroup);
            expect(menuItem2.get('checked')).toBeFalse();
            expect(menuItem2.get('radioGroup')).toBe(radioGroup);
            expect(radioGroup.checkedMenuItem).toBe(menuItem1);
            expect(onChecked).not.toHaveBeenCalled();
        });
    });
})
