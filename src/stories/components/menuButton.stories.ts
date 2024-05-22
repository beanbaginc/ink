import {
    MenuItemType,
    MenuItemsCollection,
    paint,
} from '../../ink/js';


export default {
    title: 'Ink/Components/MenuButton',
    tags: ['autodocs'],
    render: args => {
        return paint`
            <div style="height: 200px">
             <Ink.MenuButton ...${args}>
              <Ink.MenuButton.Item iconName="ink-i-success">
               Item 1
              </Ink.MenuButton.Item>
              <Ink.MenuButton.Item iconName="ink-i-warning"
                                   href="#">
               Item 2
              </Ink.MenuButton.Item>
              <Ink.MenuButton.Item shortcut="Control-G">
               Item 3
              </Ink.MenuButton.Item>
             </Ink.MenuButton>
            </>
        `;
    },
    argTypes: {
        hasActionButton: {
            description:
                'Whether the menu button has its own distinct action button.',
            control: 'boolean',
        },
        disabled: {
            description: 'Whether the menu button is disabled.',
            control: 'boolean',
        },
        label: {
            description: 'The label for the button.',
            control: 'text',
        },
        menuIconName: {
            description: 'The icon class for the dropdown handle button.',
            control: 'text',
        },
        menuLabel: {
            description: 'The ARIA label for the dropdown handle button.',
            control: 'text',
        },
        onActionButtonClick: {
            description: 'Click handler for the action button.',
            control: 'action',
        },
        type: {
            description: 'The type of buttons.',
            control: 'radio',
            options: [
                'standard',
                'primary',
                'submit',
                'danger',
                'reset',
            ],
        },
    },
    args: {
        label: 'Menu Button',
        menuLabel: 'Open Menu',
    },
};


export const Standard = {};


export const Primary = {
    args: {
        type: 'primary',
    },
};


export const Danger = {
    args: {
        type: 'danger',
    },
};


export const WithActionButton = {
    args: {
        hasActionButton: true,
    },
};


export const PrimaryWithActionButton = {
    args: {
        hasActionButton: true,
        type: 'primary',
    },
};


export const DangerWithActionButton = {
    args: {
        hasActionButton: true,
        type: 'danger',
    },
};
