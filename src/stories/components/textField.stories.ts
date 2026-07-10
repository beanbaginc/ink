import {
    type TextFieldView,
    craft,
} from '../../ink/js';


export default {
    title: 'Ink/Components/TextField',
    tags: ['autodocs'],
    render: (options: Record<string, unknown>) => {
        const textField = craft<TextFieldView>`
            <Ink.TextField ...${options}/>
        `;

        return textField.el;
    },
    argTypes: {
        ariaLabel: {
            description: 'ARIA label for the field.',
            control: 'text',
        },
        disabled: {
            description: 'Whether the field is disabled.',
            control: 'boolean',
        },
        iconName: {
            description: 'The icon class name to show in front of the input.',
            control: 'text',
        },
        placeholder: {
            description: 'Placeholder text shown when the field is empty.',
            control: 'text',
        },
        type: {
            description: 'The type of the input.',
            control: 'radio',
            options: [
                'email',
                'password',
                'search',
                'tel',
                'text',
                'url',
            ],
        },
        value: {
            description: 'The value of the field.',
            control: 'text',
        },
    },
    args: {
        type: 'text',
    },
};


export const Standard = {
    args: {
        placeholder: 'Type something...',
    },
};


export const WithValue = {
    args: {
        value: 'A value',
    },
};


export const Disabled = {
    args: {
        disabled: true,
        value: 'A disabled field',
    },
};


export const Search = {
    args: {
        ariaLabel: 'Search',
        iconName: 'ink-i-search',
        placeholder: 'Search...',
        type: 'search',
    },
};
