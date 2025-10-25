import {
    paint,
} from '../../../ink/js';


enum InputType {
    CHECKBOX = 'checkbox',
    COLOR = 'color',
    CUSTOM = 'custom',
    DATE = 'date',
    RADIOGROUP = 'radiogroup',
    READONLY_VALUE = 'readonly-value',
    TEXT = 'text',
    TEXTAREA = 'textarea',
}


export default {
    title: 'Ink/Components/Forms/FormField',
    tags: ['autodocs'],
    render: ({
        disabled,
        hasError,
        hasHelp,
        inputType,
        required,
    }) => {
        const componentProps = {
            label: 'Field Label:',
            disabled: disabled,
            required: required,
        };

        if (hasHelp) {
            componentProps['helpHTML'] = 'Help text';
        }

        if (hasError) {
            componentProps['errors'] = ['Error message'];
        }

        switch (inputType) {
            case InputType.CHECKBOX:
                componentProps['label'] = 'Field Label';

                return paint`
                    <Ink.CheckBoxFormField ...${componentProps} />
                `;

            case InputType.COLOR:
                return paint`
                    <Ink.ColorFormField ...${componentProps} />
                `;

            case InputType.DATE:
                return paint`
                    <Ink.DateFormField ...${componentProps} />
                `;

            case InputType.RADIOGROUP:
                componentProps['choices'] = {
                    'option1': 'Option 1',
                    'option2': 'Option 2',
                    'option3': 'Option 3',
                };

                return paint`
                    <Ink.RadioFormField ...${componentProps} />
                `;

            case InputType.TEXTAREA:
                return paint`
                    <Ink.TextAreaFormField ...${componentProps} />
                `;

            case InputType.READONLY_VALUE:
                // Fall through.

            case InputType.CUSTOM:
                // Fall through.

            case InputType.TEXT:
                // Fall through.

            default:
                return paint`
                    <Ink.InputFormField ...${componentProps} />
                `;
        }
    },
    argTypes: {
        disabled: {
            description: 'Whether the element is disabled.',
            control: 'boolean',
        },
        required: {
            description: 'Whether the element is required.',
            control: 'boolean',
        },
        hasHelp: {
            description: 'Whether the input has help text.',
            control: 'boolean',
        },
        hasError: {
            description: 'Whether the input has an error.',
            control: 'boolean',
        },
        inputType: {
            description: 'The type of input to show.',
            control: 'radio',
            options: [
                InputType.TEXT,
                InputType.TEXTAREA,
                InputType.DATE,
                InputType.CHECKBOX,
                InputType.RADIOGROUP,
                InputType.COLOR,
                InputType.READONLY_VALUE,
                InputType.CUSTOM,
            ],
        },
    },
    args: {
        disabled: false,
        required: false,
        hasHelp: false,
        hasError: false,
        inputType: InputType.TEXT,
    },
};


export const Standard = {
    args: {
    },
};
