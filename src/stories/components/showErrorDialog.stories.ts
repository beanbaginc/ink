import { dedent } from 'babel-plugin-dedent';

import {
    type MessageDialogBody,
    craft,
    paint,
    showErrorDialog,
} from '../../ink/js';


export default {
    title: 'Ink/Components/Error Dialog',
    tags: ['autodocs'],
    render: ({
        bodyAs,
        title,
        ...args
    }) => {
        let body: MessageDialogBody;

        if (bodyAs === 'array') {
            body = [
                paint<HTMLElement>`
                    <p>
                     <s>Abort</s>, <s>Retry</s>, Fail.
                    </p>
                `,

                "There's probably no recovering from this.",
            ];
        } else if (bodyAs === 'string') {
            body = dedent`
                There's probably no recovering from this.
            `;
        } else if (bodyAs === 'HTMLElement') {
            body = paint`
                <p>
                 <s>Abort</s>, <s>Retry</s>, Fail.
                </p>
            `;
        }

        async function open() {
            await showErrorDialog({
                error: body,
                title: title,
            });
        }

        return paint`
            <Ink.Button onClick=${open}>
             Show
            </>
        `;
    },
    argTypes: {
        bodyAs: {
            description: 'Test with different body content',
            control: 'radio',
            options: [
                'array',
                'string',
                'HTMLElement',
            ],
        },
        title: {
            description: 'Title for the dialog',
            control: 'text',
        },
    },
    args: {
        bodyAs: 'array',
        title: 'Demo error dialog',
    },
};


export const Standard = {};
