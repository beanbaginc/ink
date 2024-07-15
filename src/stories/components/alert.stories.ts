import { dedent } from 'babel-plugin-dedent';

import { paint } from '../../ink/js';


export default {
    title: 'Ink/Components/Alert',
    tags: ['autodocs'],
    render: ({
        canClose,
        content,
        heading,
        showActions,
        type,
        ...args
    }) => {
        return paint`
            <Ink.Alert canClose=${canClose} type="${type}">
             <Ink.Alert.Heading>
              ${paint([heading])}
             </Ink.Alert.Heading>
             ${content && paint`
              <Ink.Alert.Content>
               ${paint([content])}
              </Ink.Alert.Content>
             `}
             ${showActions && paint`
              <Ink.Alert.Actions>
               <Ink.Button type="primary">Save</Ink.Button>
               <Ink.Button type="danger">Destroy</Ink.Button>
               <Ink.Button>Cancel</Ink.Button>
              </Ink.Alert>
             `}
            </Ink.Alert>
        `;
    },
    argTypes: {
        canClose: {
            description: 'Whether to show a close button on the alert.',
            control: 'boolean',
        },
        content: {
            description: 'HTML content to include in the alert.',
            control: 'text',
        },
        heading: {
            description: 'The heading text shown for the alert.',
            control: 'text',
        },
        showActions: {
            description: 'Whether to show sample actions.',
            control: 'boolean',
        },
        type: {
            description: 'The type of the alert.',
            control: 'radio',
            options: [
                'standard',
                'info',
                'success',
                'warning',
                'error',
            ],
        },
        onClose: {
            action: 'clicked',
        },
    },
};


export const Standard = {
    args: {
        type: 'standard',
        canClose: true,
        heading: 'Alert Heading',
        content: dedent`
            <p>Here is a line of content!</p>
            <p>We'll do a list:</p>
            <ul>
             <li>Item</li>
             <li>Item</li>
             <li>Item</li>
            </ul>
        `,
    }
};


export const Simple = {
    args: {
        heading: 'Alert Heading',
        type: 'standard',
    },
};


export const Info = {
    args: {
        type: 'info',
        canClose: true,
        heading: 'Info Alert Heading',
        content: dedent`
            <p>Here is a line of content!</p>
            <p>We'll do a list:</p>
            <ul>
             <li>Item</li>
             <li>Item</li>
             <li>Item</li>
            </ul>
        `,
    },
};


export const Success = {
    args: {
        type: 'success',
        canClose: true,
        heading: 'Success Alert Heading',
        content: dedent`
            <p>Here is a line of content!</p>
            <p>We'll do a list:</p>
            <ul>
             <li>Item</li>
             <li>Item</li>
             <li>Item</li>
            </ul>
        `,
    },
};


export const Warning = {
    args: {
        type: 'warning',
        canClose: true,
        heading: 'Warning Alert Heading',
        content: dedent`
            <p>Here is a line of content!</p>
            <p>We'll do a list:</p>
            <ul>
             <li>Item</li>
             <li>Item</li>
             <li>Item</li>
            </ul>
        `,
    },
};


export const Error = {
    args: {
        type: 'error',
        canClose: true,
        heading: 'Error Alert Heading',
        content: dedent`
            <p>Here is a line of content!</p>
            <p>We'll do a list:</p>
            <ul>
             <li>Item</li>
             <li>Item</li>
             <li>Item</li>
            </ul>
        `,
    },
};


export const Actions = {
    args: {
        type: 'warning',
        heading: 'Gonna do this thing?',
        content: dedent`
            <p>Might be dangerous!</p>
            <p>Choose wisely.</p>
        `,
        showActions: true,
    },
};
