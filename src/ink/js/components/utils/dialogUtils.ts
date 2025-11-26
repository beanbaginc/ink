/**
 * Common dialog utilities.
 *
 * This provides functions that can help create common types of dialogs
 * with minimal code.
 *
 * Version Added:
 *     0.9
 */

import {
    craft,
    paint,
} from '../../core';
import {
    type ButtonView,
    ButtonType,
} from '../views/buttonView';
import {
    type DialogView,
    DialogActionType,
    DialogActionView,
} from '../views/dialogView';


/**
 * The type for a confirm dialog's body content.
 *
 * Version Added:
 *     0.9
 */
export type MessageDialogBody = string |
                                HTMLElement |
                                (string | HTMLElement)[];


/**
 * Options for :js:func:`Ink.showErrorDialog`.
 *
 * Version Added:
 *     0.9
 */
export interface ShowErrorDialogOptions {
    /**
     * The error to show.
     *
     * This can be one of the following:
     *
     * 1. A plain text string
     * 2. An HTML element
     * 3. An array of paragraphs of one or more plain text strings or
     *    HTML elements.
     * 4. An :js:class:`Error` instance.
     */
    error: MessageDialogBody | Error;

    /**
     * Optional title for a dialog showing an error.
     *
     * This defaults to :guilabel:`Something went wrong`.
     */
    title?: string;
}


/**
 * Options for :js:func:`Ink.showConfirmDialog`.
 *
 * Version Added:
 *     0.9
 */
export interface ShowConfirmDialogOptions {
    /**
     * The body contents for the dialog.
     *
     * This can be one of the following:
     *
     * 1. A plain text string
     * 2. An HTML element
     * 3. An array of paragraphs of one or more plain text strings or
     *    HTML elements.
     */
    body: MessageDialogBody;

    /**
     * The title for the dialog.
     */
    title: string;

    /**
     * Whether to show a suppress checkbox.
     *
     * This defaults to ``false``.
     */
    canSuppress?: boolean;

    /**
     * Optional text for the Cancel button.
     *
     * This defaults to :guilabel:`Cancel`.
     */
    cancelButtonText?: string;

    /**
     * Optional text for the Confirm button.
     *
     * This defaults to :guilabel:`Okay`.
     */
    confirmButtonText?: string;

    /**
     * Whether the operation being confirmed is dangerous.
     *
     * This will dictate the type of confirmation button used.
     */
    isDangerous?: boolean;

    /**
     * Asynchronous handler for the Confirm button.
     *
     * If provided, the dialog will remain open with the Confirm button set
     * to a busy state until the handler's promise resolves.
     */
    onConfirm?: (result: ShowConfirmDialogResult) => Promise<boolean | void>;

    /**
     * Optional text for the suppress checkbox.
     *
     * This defaults to :guilabel:`Do not ask again`.
     */
    suppressText?: string;
}


/**
 * The result from the confirmation dialog.
 *
 * This will be returned from :js:func:`Ink.showConfirmDialog` if the user has
 * confirmed the choice. It functions as a truthy value and contains state
 * to help further process the confirmation choice.
 *
 * Version Added:
 *     0.9
 */
export interface ShowConfirmDialogResult {
    /**
     * The displayed dialog.
     *
     * This can be used in a confirmation handler to get access to the
     * dialog for any special needs.
     */
    dialog: DialogView;

    /**
     * The confirmation button.
     *
     * This can be used by a confirmation handler to update button text as
     * needed.
     */
    confirmButton: ButtonView;

    /**
     * Whether the suppress was checked.
     *
     * This will always be ``false`` if the checkbox was not added to the
     * dialog.
     */
    suppressed: boolean;
}


/**
 * Prompt the user for confirmation before performing an action.
 *
 * This will display a dialog with the provided title and body, asking the
 * user to confirm an action or operation.
 *
 * The result of this call is a Promise, which will resolve only when the
 * dialog has been closed. This makes it easy for a caller to request
 * confirmation and wait until a choice is made before continuing on.
 *
 * If the caller provides a confirmation callback, and the user has clicked
 * the Confirm button, the dialog's confirmation button will be in a busy
 * state until that callback completes.
 *
 * Once a choice is made, the caller will receive a result through the
 * Promise. If Cancel was clicked, the resulting promise will contain a
 * ``null`` result. If Confirm was clicked, the caller will receive a
 * :js:class:`ShowConfirmDialogResult`.
 *
 * Version Added:
 *     0.9
 *
 * Args:
 *     options (ShowConfirmDialogOptions):
 *         Options for controlling the text and behavior of the dialog.
 *
 * Returns:
 *     Promise<ShowConfirmDialogResult | null>:
 *     The promise resolved once a choice is made.
 */
export function showConfirmDialog(
    options: ShowConfirmDialogOptions,
): Promise<ShowConfirmDialogResult | null> {
    return new Promise(done => {
        async function onConfirm() {
            let result: ShowConfirmDialogResult = {
                confirmButton: confirmButton,
                dialog: dialogView,
                suppressed: dialogView.isSuppressChecked,
            };

            if (options.onConfirm) {
                /* Let any errors bubble up, if not handled by onConfirm. */
                const success = await options.onConfirm(result);

                if (success === false) {
                    result = null;
                }
            }

            done(result);
        }

        const confirmButton = craft<DialogActionView>`
              <Ink.DialogAction
                type=${options.isDangerous
                       ? ButtonType.DANGER
                       : ButtonType.PRIMARY}
                action=${DialogActionType.CALLBACK_AND_CLOSE}
                callback=${async () => await onConfirm()}>
               ${options.confirmButtonText || `Okay`}
              </Ink.DialogAction>
        `;

        const body = buildMessageDialogBody(options.body);

        const dialogView = craft<DialogView>`
            <Ink.Dialog canSuppress=${options.canSuppress}
                        suppressText=${options.suppressText}
                        title=${options.title}>
             <Ink.Dialog.Body>
              ${body}
             </Ink.Dialog.Body>
             <Ink.Dialog.PrimaryActions>
              <Ink.DialogAction
                action=${DialogActionType.CALLBACK_AND_CLOSE}
                callback=${() => done(null)}>
               ${options.cancelButtonText || `Cancel`}
              </Ink.DialogAction>
              ${confirmButton}
             </Ink.Dialog.PrimaryActions>
            </Ink.Dialog>
        `;

        dialogView.open();
    });
}


/**
 * Display an error dialog containing a message and a Close button.
 *
 * This is useful for basic errors that demand a user's attention.
 *
 * The result of this call is a Promise, which will resolve only when the
 * dialog has been closed. This makes it easy for a caller to display an
 * error and wait until it's closed to continue on.
 *
 * Version Added:
 *     0.9
 *
 * Args:
 *     options (ShowErrorDialogOptions):
 *         Options for controlling the text and behavior of the dialog.
 *
 * Returns:
 *     Promise<void>:
 *     The promise resolved once the dialog is closed.
 */
export function showErrorDialog(
    options: ShowErrorDialogOptions,
): Promise<void> {
    return new Promise(done => {
        const error = options.error;
        let body: MessageDialogBody;

        if (error instanceof Error) {
            body = error.message;
        } else {
            body = buildMessageDialogBody(error);
        }

        const dialogView = craft<DialogView>`
            <Ink.Dialog title=${options.title ?? 'Something went wrong'}>
             <Ink.Dialog.Body>
              ${body}
             </Ink.Dialog.Body>
             <Ink.Dialog.PrimaryActions>
              <Ink.DialogAction
                action=${DialogActionType.CALLBACK_AND_CLOSE}
                type=${ButtonType.PRIMARY}
                callback=${() => done()}>
               ${`Close`}
              </Ink.DialogAction>
             </Ink.Dialog.PrimaryActions>
            </Ink.Dialog>
        `;

        dialogView.open();
    });
}


/**
 * Return HTML elements for a message dialog's body.
 *
 * This takes a string, HTMLElement, or array containing any number of either
 * and returns HTML elements that can be used for a message dialog.
 *
 * Version Added:
 *     0.9
 *
 * Args:
 *     rawBody (MessageDialogBody):
 *         The body to process.
 *
 * Returns:
 *     Array of HTMLElement:
 *     The resulting body contents.
 */
function buildMessageDialogBody(
    rawBody: MessageDialogBody,
): HTMLElement[] {
    let body: HTMLElement[];

    if (rawBody) {
        if (typeof rawBody === 'string') {
            body = paint`<p>${rawBody}</p>`;
        } else if (rawBody instanceof HTMLElement) {
            body = [rawBody];
        } else if (typeof rawBody[Symbol.iterator] === 'function') {
            body = [];

            for (const item of rawBody) {
                if (typeof item === 'string') {
                    body.push(paint`<p>${item}</p>`);
                } else if (item instanceof HTMLElement) {
                    body.push(item);
                }
            }
        } else {
            console.error('Invalid message dialog body: %o', rawBody);
        }
    }

    return body || [];
}
