import { dedent } from 'babel-plugin-dedent';

import {
    type ButtonView,
    type MessageDialogBody,
    type ShowConfirmDialogResult,
    craft,
    paint,
    showConfirmDialog,
} from '../../ink/js';


export default {
    title: 'Ink/Components/Confirm Dialog',
    tags: ['autodocs'],
    render: ({
        bodyAs,
        canSuppress,
        cancelButtonText,
        confirmButtonText,
        isDangerous: isDangerous,
        suppressText,
        title,
        ...args
    }) => {
        let body: MessageDialogBody;

        if (bodyAs === 'array') {
            body = [
                paint<HTMLElement>`
                    <p>
                     If you <strong>confirm</strong> this dialog, it may
                     save the world from complete destruction, or it might
                     be what dooms it.
                    </p>
                `,

                "Who can say really. Let's roll the dice.",
            ];
        } else if (bodyAs === 'string') {
            body = dedent`
                If you confirm this <dialog>, it may save the world from
                complete destruction, or it might be what dooms it.
                Who can say really. Let's roll the dice.
            `;
        } else if (bodyAs === 'HTMLElement') {
            body = paint`
                <p>
                 If you <strong>confirm</strong> this dialog, it may save
                 the world from complete destruction, or it might be what
                 dooms it. Who can say really. <em>Let's roll the dice.</em>
                </p>
            `;
        }

        function onConfirm(
            result: ShowConfirmDialogResult,
        ): Promise<void> {
            return new Promise(done => {
                let countDown = 3;

                function updateLabel() {
                    result.confirmButton.label = `${countDown}...`;
                }

                updateLabel();

                const timerID = setInterval(() => {
                    countDown--;
                    updateLabel();

                    if (countDown === 0) {
                        clearInterval(timerID);
                        done();
                    }
                }, 400);
            });
        }

        async function open() {
            const result = await showConfirmDialog({
                body: body,
                canSuppress: canSuppress,
                cancelButtonText: cancelButtonText,
                confirmButtonText: confirmButtonText,
                isDangerous: isDangerous,
                onConfirm: onConfirm,
                suppressText: suppressText,
                title: title,
            });

            if (result) {
                if (result.suppressed) {
                    button.label = 'Confirmed, suppressed';
                } else {
                    button.label = 'Confirmed';
                }
            } else {
                button.label = 'Canceled';
            }
        }

        const button = craft<ButtonView>`
            <Ink.Button onClick=${open}>
             Show
            </>
        `;

        return button.el;
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
        canSuppress: {
            description: 'Whether a suppress checkbox is added.',
            control: 'boolean',
        },
        cancelButtonText: {
            description: 'Custom text for the Cancel button.',
            control: 'text',
        },
        confirmButtonText: {
            description: 'Custom text for the Confirm button.',
            control: 'text',
        },
        isDangerous: {
            description: 'Whether the dialog action is dangerous.',
            control: 'boolean',
        },
        suppressText: {
            description: 'Custom text for the suppression checkbox.',
            control: 'text',
        },
        title: {
            description: 'Title for the dialog',
            control: 'text',
        },
    },
    args: {
        bodyAs: 'array',
        canSuppress: true,
        isDangerous: true,
        title: 'Demo confirm dialog',
    },
};


export const Standard = {};
