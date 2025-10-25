import {
    type Meta,
    type StoryObj,
} from '@storybook/html';

import {
    paint,
} from '../../../ink/js';


type TextFormFieldArgs = {
    disabled: boolean;
    label: string;
    hasErrors: boolean;
    helpHTML: string | null;
    placeholder: string;
    required: boolean;
    value: string;
};


const meta: Meta<TextFormFieldArgs> = {
    title: 'Ink/Components/Forms/TextFormField',
    tags: ['autodocs'],
    render: ({
        hasErrors,
        ...options
    }) => {
        const errors = (
            hasErrors
            ? ['This is some error text.']
            : null
        );

        return paint`
            <Ink.TextFormField
                label="Field Label"
                errors=${errors}
                ...${options}>
            </Ink.TextFormField>
        `;
    },
    argTypes: {
        disabled: {
            description: 'Whether the field is disabled.',
            control: 'boolean',
        },
        hasErrors: {
            description: 'Whether the field has errors.',
            control: 'boolean',
        },
        placeholder: {
            description: 'The placeholder text.',
            control: 'text',
        },
        required: {
            description: 'Whether the field is required.',
            control: 'boolean',
        },
        value: {
            description: 'The current value of the input.',
            control: 'text',
        },
    },
    args: {
        disabled: false,
        label: 'Field Label:',
        helpHTML: '',
        hasErrors: false,
        placeholder: null,
        required: false,
        value: null,
    },
};
export default meta;


type Story = StoryObj<TextFormFieldArgs>;


export const Standard: Story = {};

export const WithErrors: Story = {
    args: {
        hasErrors: true,
    },
};

export const WithHelp: Story = {
    args: {
        helpHTML: `
            The name of the organization. This is the &lt;org_name&gt; in
            <code>http://github.com/&lt;org_name&gt;/&lt;repo_name&gt;/</code>
        `,
    },
};
