/**
 * Storybook story for the MenuLabel component.
 *
 * Version Added:
 *     0.5
 */

import {
    paint,
} from '../../ink/js';


export default {
    title: 'Ink/Components/MenuLabel',
    tags: ['autodocs'],
    render: args => {
        return paint`
            <div style="height: 150px">
             <Ink.MenuLabel ...${args}>
              <Ink.MenuLabel.Item iconName="ink-i-success">
               Item 1
              </Ink.MenuLabel.Item>
              <Ink.MenuLabel.Item iconName="ink-i-warning"
                                  href="#">
               Item 2
              </Ink.MenuLabel.Item>
              <Ink.MenuLabel.Item>
               Item 3
              </Ink.MenuLabel.Item>
             </Ink.MenuLabel>
            </div>
        `;
    },
    argTypes: {
        disabled: {
            description: 'Whether the menu label is disabled.',
            control: 'boolean',
        },
        dropDownIconName: {
            description: 'The icon class for the dropdown handle button.',
            control: 'text',
        },
        iconName: {
            description: 'The icon class to use beside the label.',
            control: 'text',
        },
        menuLabel: {
            description: 'The ARIA label for the dropdown handle button.',
            control: 'text',
        },
        text: {
            description: 'The text for the label.',
            control: 'text',
        },
    },
    args: {
        text: 'Menu Label',
        menuLabel: 'Open Menu',
    },
};


export const Standard = {};


export const WithIcon = {
    args: {
        iconName: 'ink-i-success',
    },
};


export const WithoutDropDownIcon = {
    args: {
        dropDownIconName: null,
    },
};
