/**
 * Storybook story for the Menu component.
 *
 * Version Added:
 *     1.0
 */

import {
    type MenuItem,
    KeyboardShortcutRegistry,
    KeyboardShortcutRegistryView,
    MenuItemType,
    MenuItemsCollection,
    MenuItemsRadioGroup,
    MenuView,
    paint,
    renderInto,
} from '../../ink/js';


export default {
    tags: ['autodocs'],
    title: 'Ink/Components/Menu',

    render: ({
        ariaLabel,
        creationMethod,
        hasIcons,
        hasShortcuts,
        onMenuItemClicked,
    }) => {
        let menuEl: HTMLMenuElement;

        const registry = new KeyboardShortcutRegistry();
        const registryView = new KeyboardShortcutRegistryView({
            model: registry,
        });
        registryView.render();
        registryView.el.style.display = 'inline-block';

        const registryEl = registryView.el;

        const radioGroup1 = new MenuItemsRadioGroup();

        const item1Props: Record<string, unknown> = {};
        const item2Props: Record<string, unknown> = {};
        const item3Props: Record<string, unknown> = {};
        const item4Props: Record<string, unknown> = {};

        function updateMenuItemLabel(
            menuItem: MenuItem,
        ) {
            menuItem.set('label', 'Clicked!');
        }

        function updateMenuItemIcon(
            menuItem: MenuItem,
        ) {
            menuItem.set('iconName', 'ink-i-success');
        }

        function updateMenuItemChecked(
            menuItem: MenuItem,
        ) {
            menuItem.set('label',
                         menuItem.get('checked') ? 'Checked' : 'Unchecked');
        }

        if (hasIcons) {
            item1Props['iconName'] = 'ink-i-success';
            item2Props['iconName'] = 'ink-i-warning';
        }

        if (hasShortcuts) {
            item1Props['keyboardShortcut'] = 'Cmd-X';
            item1Props['keyboardShortcutRegistry'] = registry;
            item3Props['keyboardShortcut'] = 'Control-G';
            item3Props['keyboardShortcutRegistry'] = registry;
        }

        if (creationMethod === 'crafted-subcomponents') {
            menuEl = paint`
                <Ink.Menu aria-label="${ariaLabel}"
                          embedded>
                 <Ink.Menu.Item onClick=${onMenuItemClicked}
                                ...${item1Props}>
                  Item 1
                 </>
                 <Ink.Menu.Item onClick=${onMenuItemClicked}
                                url="#"
                                ...${item2Props}>
                  Item 2...
                 </>
                 <Ink.Menu.Item onClick=${updateMenuItemLabel}
                                ...${item3Props}>
                  Click me to re-render the label
                 </>
                 <Ink.Menu.Item onClick=${updateMenuItemIcon}
                                ...${item4Props}>
                  Click me to re-render the icon
                 </>
                 <Ink.Menu.Separator/>
                 <Ink.Menu.Item onClick=${onMenuItemClicked}>
                  Item 4 and this is a long one people
                 </>
                 <Ink.Menu.Item disabled>
                  This item is disabled
                 </>
                 <Ink.Menu.Separator/>
                 <Ink.Menu.CheckboxItem checked
                                        onClick=${updateMenuItemChecked}>
                  Checked
                 </>
                 <Ink.Menu.CheckboxItem>
                  Checkbox Item 2
                 </>
                 <Ink.Menu.CheckboxItem disabled>
                  Checkbox Item 3
                 </>
                 <Ink.Menu.Separator/>
                 <Ink.Menu.Header>
                  These are radio buttons:
                 </>
                 <Ink.Menu.RadioItem checked radioGroup=${radioGroup1}>
                  Radio Item 1
                 </>
                 <Ink.Menu.RadioItem radioGroup=${radioGroup1}>
                  Radio Item 2
                 </>
                 <Ink.Menu.RadioItem disabled
                                     radioGroup=${radioGroup1}>
                  Radio Item 3
                 </>
                </>
            `;
        } else {
            const menuItems = new MenuItemsCollection([
                {
                    label: 'Item 1',
                    onClick: onMenuItemClicked,
                    ...item1Props,
                },
                {
                    label: 'Item 2',
                    onClick: onMenuItemClicked,
                    url: '#',
                    ...item2Props,
                },
                {
                    label: 'Click me to re-render the label',
                    onClick: updateMenuItemLabel,
                    ...item3Props,
                },
                {
                    label: 'Click me to re-render the icon',
                    onClick: updateMenuItemIcon,
                    ...item4Props,
                },
                {
                    type: MenuItemType.SEPARATOR,
                },
                {
                    label: 'Item 4 and this is a long one people',
                    onClick: onMenuItemClicked,
                },
                {
                    disabled: true,
                    label: 'This item is disabled',
                },
            ]);

            if (creationMethod === 'crafted-collection') {
                menuEl = paint`
                    <Ink.Menu aria-label="${ariaLabel}"
                              menuItems=${menuItems}
                              embedded/>
                `;
            } else if (creationMethod === 'view-collection') {
                const menuView = new MenuView({
                    ariaLabel: ariaLabel,
                    embedded: true,
                    menuItems: menuItems,
                });
                menuEl = menuView.render().el;
            } else {
                console.assert(false, 'not reached');
            }

            menuItems.add({
                label: 'Item 5!',
            });
        }

        renderInto(registryEl, menuEl);

        return registryEl;
    },

    argTypes: {
        ariaLabel: {
            description: 'ARIA label for the menu.',
            control: 'text',
        },
        creationMethod: {
            description: '',
            control: 'radio',
            options: [
                'crafted-subcomponents',
                'crafted-collection',
                'view-collection',
            ],
        },
        hasIcons: {
            description: 'Whether to show icons in the menu.',
            control: 'boolean',
        },
        hasShortcuts: {
            description: 'Whether to show shortcuts in the menu.',
            control: 'boolean',
        },
        onMenuItemClicked: {
            description: 'Handle menu item clicks',
            control: 'action',
        },
    },
    args: {
        'ariaLabel': 'Test Menu',
        'creationMethod': 'crafted-subcomponents',
        'hasIcons': true,
        'hasShortcuts': true,
    },
};


export const Standard = {};


export const Plain = {
    args: {
        'hasIcons': false,
        'hasShortcuts': false,
    },
};


export const Icons = {
    args: {
        'hasIcons': true,
        'hasShortcuts': false,
    },
};


export const Shortcuts = {
    args: {
        'hasIcons': false,
        'hasShortcuts': true,
    },
};


export const CraftedWithCollection = {
    args: {
        'creationMethod': 'crafted-collection',
    },
};


export const ViewWithCollection = {
    args: {
        'creationMethod': 'view-collection',
    },
};


export const WithUpdates = {
    args: {
        'creationMethod': 'view-collection',
    },

    render: () => {
        const menuItems = new MenuItemsCollection([
            {
                label: 'Orig Item',
            },
        ]);

        const menuEl = paint`
            <div style="display: inline-block;">
             <Ink.Menu menuItems=${menuItems}
                       embedded/>
            </>
        `;

        menuItems.reset();
        menuItems.add({
            iconName: 'ink-i-success',
            label: 'Item 1',
            shortcut: 'Ctrl-Alt-Del',
        });
        menuItems.add([
            {
                label: 'Item 2',
            },
            {
                type: MenuItemType.SEPARATOR,
            },
            {
                iconName: 'ink-i-warning',
                label: 'Item 3',
            },
        ]);

        return menuEl;
    },
};
