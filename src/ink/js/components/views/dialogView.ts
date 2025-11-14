/**
 * A component for dialogs.
 *
 * Version Added:
 *     0.6
 */

import {
    BaseModel,
    EventsHash,
    spina,
} from '@beanbag/spina';
import { dedent } from 'babel-plugin-dedent';
import _ from 'underscore';

import {
    ComponentChild,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';
import {
    type ButtonViewOptions,
    ButtonView,
} from './buttonView';


/**
 * The action type for a DialogActionView.
 *
 * Version Added:
 *     0.6
 */
export enum DialogActionType {
    /**
     * Trigger a callback.
     *
     * The dialog will stay open when clicked, allowing the caller to
     * determine whether to close the dialog or keep it open.
     *
     * This is equivalent to ``null``, and will be deprecated in a future
     * release.
     */
    CALLBACK = 'callback',

    /**
     * Cancel the dialog.
     *
     * The first action set to this type will be invoked automatically if
     * the user presses Escape to close the dialog.
     *
     * Version ADded:
     *     0.9
     */
    CANCEL = 'cancel',

    /**
     * Close the dialog.
     *
     * If a callback is provided, this will close the dialog once the
     * callback has returned. If the callback returns a Promise, the dialog
     * won't be closed until the Promise is resolved.
     *
     * If the callback errors out, the dialog will stay open. The callback
     * should ideally render errors itself and not raise.
     *
     * Version Changed:
     *     0.9:
     *     This now supports running a callback before closing, if one is
     *     provided.
     */
    CLOSE = 'close',

    /**
     * Trigger a callback and then close the dialog.
     *
     * This will only close the dialog once the callback has returned. If
     * the callback returns a Promise, the dialog won't be closed until the
     * Promise is resolved.
     *
     * If the callback errors out, the dialog will stay open. The callback
     * should ideally render errors itself and not raise.
     *
     * This is equivalent to ``CLOSE``, and will be deprecated in a future
     * release.
     */
    CALLBACK_AND_CLOSE = 'callback-and-close',
}


/**
 * Options for DialogActionView.
 *
 * Version Added:
 *     0.6
 */
export interface DialogActionViewOptions extends ButtonViewOptions {
    /** The type of action to perform. */
    action?: DialogActionType | null;

    /** The function to call, if the action type is callback. */
    callback?: () => Promise<unknown> | void;
}


/**
 * A component for dialog actions.
 *
 * This is a specialization of ButtonView, which can be used to handle common
 * patterns with actions in a dialog.
 *
 * Any dialog action can trigger a callback, if provided. Along with this,
 * dialog actions can be given a type, which indicates if they will close
 * or cancel the dialog after the action concludes.
 *
 * Version Changed:
 *     0.9:
 *     Dialog action types no longer need to specify whether a callback
 *     will be provided.
 *
 * Version Added:
 *     0.6
 */
@inkComponent('Ink.DialogAction')
@spina
export class DialogActionView<
    TModel extends BaseModel = BaseModel,
    TOptions extends DialogActionViewOptions = DialogActionViewOptions
> extends ButtonView<
    TModel,
    TOptions
> {
    /**********************
     * Instance variables *
     **********************/

    /**
     * The type of action, dictating behavior when clicked.
     *
     * If ``null``, it doesn't have a specific type of action.
     *
     * Version Added:
     *     0.9
     */
    actionType: DialogActionType | null;

    /** The dialog parent. */
    dialog: DialogView;

    /** The type of action to perform. */
    #action?: DialogActionType;

    /** The function to call, if the action type is callback. */
    #callback?: () => Promise<unknown> | void;

    initialize(options: TOptions): void {
        if (options.onClick) {
            console.error(dedent`
                Ink.DialogAction was instantiated with an onClick handler.
                The "callback" attribute should be used instead.
            `);
        } else {
            options.onClick = this.onClick.bind(this);
        }

        /* Normalize the action. */
        let action = options.action;

        if (!action) {
            /*
             * Check if this is a legacy action type, and convert to a
             * modern one.
             */
            if (action === DialogActionType.CALLBACK) {
                action = null;
            } else if (action === DialogActionType.CALLBACK_AND_CLOSE) {
                action = DialogActionType.CLOSE;
            }
        }

        this.actionType = action;
        this.#callback = options.callback;

        super.initialize(options);
    }

    /**
     * Handle a click on the button.
     *
     * If a callback is set, it will be invoked. If it's asynchronous,
     * the dialog will be placed in a busy state until the action finishes.
     *
     * If the action type closes or cancels the dialog, the dialog will be
     * closed or canceled once any provided callback has finished.
     *
     * Returns:
     *     Promise<void>:
     *     The promise for the action.
     */
    protected async onClick() {
        const actionType = this.actionType;
        const dialog = this.dialog;
        console.assert(dialog !== undefined);

        const callback = this.#callback;
        let actionResult: unknown;

        if (callback) {
            const result = callback();

            if (result instanceof Promise) {
                dialog.setBusy({
                    activeAction: this,
                    busy: true,
                });

                try {
                    actionResult = await result;
                } catch (e) {
                    console.error(
                        'Dialog action callback returned an error: %s',
                        e);

                    return;
                }

                dialog.setBusy({
                    activeAction: this,
                    busy: false,
                });
            }
        }

        if (actionType === DialogActionType.CLOSE) {
            dialog.close({
                action: this,
                actionResult: actionResult,
                canceled: false,
            });
        } else if (actionType === DialogActionType.CANCEL) {
            dialog.close({
                action: this,
                actionResult: actionResult,
                canceled: true,
            });
        }
    }
}


/**
 * Values for the dialog size.
 *
 * Version Added:
 *     0.6
 */
export enum DialogSize {
    /** Custom size: user must specify width/height styles. */
    CUSTOM = 'custom',

    /** Fit to the size of the content. */
    FIT = 'fit',

    /** Medium size: 60% of the viewport width. */
    MEDIUM = 'medium',

    /** Large size: 80% of the viewport width. */
    LARGE = 'large',

    /** Max size: viewport width minus some spacing. */
    MAX = 'max',
}


/**
 * Options for DialogView.
 *
 * Version Added:
 *     0.6
 */
export interface DialogViewOptions extends BaseComponentViewOptions {
    /**
     * Whether the dialog can be suppressed in the future.
     *
     * If ``true``, a checkbox will be provided to suppress. The caller
     * is responsible for handling any suppression logic.
     *
     * This defaults to ``false``.
     *
     * Version Added:
     *     0.9
     */
    canSuppress?: boolean;

    /**
     * A function to call when the dialog is closed.
     *
     * Version Changed:
     *     0.9:
     *     This can now take a :js:class:`DialogCloseReason` as an argument.
     */
    onClose?: (DialogCloseReason) => void;

    /** The size of the dialog. */
    size?: DialogSize;

    /**
     * The text for the suppression checkbox.
     *
     * This is only used if ``canSuppress`` is ``true``.
     *
     * This defaults to "Do not ask again".
     *
     * Version Added:
     *     0.9
     */
    suppressText?: string;

    /** The title string for the dialog. */
    title?: string;
}


/**
 * Options for the DialogView.open operation.
 *
 * Version Added:
 *     0.6
 */
export interface DialogViewOpenOptions {
    /**
     * Whether to show the dialog as modal.
     *
     * This defaults to ``true``.
     */
    modal?: boolean;
}


/**
 * Options for the DialogView.setBusy operation.
 *
 * Version Added:
 *     6.0
 */
export interface DialogViewSetBusyOptions {
    /** The currently active action (or just-completed action). */
    activeAction: DialogActionView;

    /** Whether the action is active. */
    busy: boolean;
}


/**
 * A reason the dialog is closed.
 *
 * This can be set when closing the dialog in order to provide extra
 * information as to what led to the closing of the dialog.
 *
 * It's set automatically when clicking a button or when the user or browser
 * triggers a cancelation of the dialog.
 *
 * Version Added:
 *     0.9
 */
export interface DialogCloseReason {
    /** Whether the dialog was canceled. */
    canceled: boolean;

    /** The action that closed the dialog, if any. */
    action?: DialogActionView;

    /** The result of the click handler on the action. */
    actionResult?: unknown;

    /**
     * Extra state set by the specific dialog implementation.
     *
     * This allows action callbacks or other code paths to provide additional
     * state that may be useful as part of the closing of the dialog.
     */
    extraState?: unknown;
}


/**
 * The dialog component.
 *
 * Dialogs display a title and messages (or other content) along with one or
 * more action buttons (grouped into primary and secondary areas). They can
 * be modal or non-modal.
 *
 * A dialog can also be marked as suppressable, allowing users to choose
 * whether to see the dialog again in the future. If enabled, this component
 * will handle the UI, though it's up to the caller to handle and respect
 * the setting.
 *
 * Version Changed:
 *     0.9:
 *     * Added built-in support for cancelable actions.
 *     * Added the ``canSuppress`` and ``suppressText`` options.
 *     * Added max widths and heights to help dialogs size correctly.
 *     * Modal dialogs now use the ``alertdialog`` role.
 *
 * Version Added:
 *     0.6
 */
@inkComponent('Ink.Dialog')
@spina({
    prototypeAttrs: [
        'title',
    ],
})
export class DialogView<
    T extends BaseModel = BaseModel,
    TOptions extends DialogViewOptions = DialogViewOptions,
> extends BaseComponentView<
    T,
    HTMLDialogElement,
    TOptions
> {
    /** The title for the dialog */
    static title: string | null = null;
    declare title: string | null;

    static tagName = 'dialog';
    static className = 'ink-c-dialog';
    static subcomponents = {
        'PrimaryActions': 'recordOneSubcomponent',
        'SecondaryActions': 'recordOneSubcomponent',
        'Body': 'recordOneSubcomponent',
    };

    static events: EventsHash = {
        'cancel': '_onCancel',
        'close': '_onClose',
    };

    /**********************
     * Instance variables *
     **********************/

    /**
     * The set of all actions.
     *
     * This only includes actions which are subclasses of DialogActionView.
     * Regular buttons or other components will not be included in this.
     */
    #actions: DialogActionView[] = [];

    /**
     * The reason the dialog was closed.
     *
     * This is only set once :js:meth:`close` has been called.
     *
     * Version Added:
     *     0.9
     */
    #closeReason: (DialogCloseReason | null) = null;

    /**
     * The callback handler when the dialog is closed.
     *
     * Version Added:
     *     0.9
     */
    #onClose: DialogViewOptions['onClose'] = null;

    /**
     * The suppress checkbox, if added to the dialog.
     *
     * Version Added:
     *     0.9
     */
    #suppressEl: HTMLInputElement;

    /**
     * Return whether the dialog is open.
     *
     * Returns:
     *     boolean:
     *     true if the dialog is currently open.
     */
    get isOpen(): boolean {
        return this.el.open;
    }

    /**
     * Return whether the user checked the suppressed checkbox.
     *
     * Version Added:
     *     0.9
     *
     * Returns:
     *     boolean:
     *     ``true`` if the suppressed checkbox was added and checked.
     *     ``false`` otherwise.
     */
    get isSuppressChecked(): boolean {
        return !!this.#suppressEl?.checked;
    }

    /**
     * Initialize the view.
     *
     * Args:
     *     options (DialogViewOptions):
     *         The options for the view.
     */
    preinitialize(options: TOptions) {
        this.id ??= _.uniqueId('_ink-c-dialog');
        super.preinitialize(options);
    }

    /**
     * Open the dialog.
     *
     * Args:
     *     options (DialogViewOpenOptions):
     *         Whether to show the dialog as modal or not.
     */
    open(options: DialogViewOpenOptions = {}) {
        if (!this.rendered) {
            console.error(
                'DialogView.show called before view was rendered');

            return;
        }

        const el = this.el;

        if (!document.body.contains(el)) {
            document.body.append(el);
        }

        if (options.modal === false) {
            el.setAttribute('role', 'dialog');
            el.show();
        } else {
            el.setAttribute('role', 'alertdialog');
            el.showModal();
        }
    }

    /**
     * Open the dialog, returning a Promise that resolves once closed.
     *
     * This is a convenient way of opening a dialog and resolving when
     * closed, helping callers build and show dialogs in a more
     * straight-forward fashion.
     *
     * Version Added:
     *     0.9
     *
     * Args:
     *     options (DialogViewOpenOptions):
     *         Whether to show the dialog as modal or not.
     *
     * Returns:
     *     Promise<DialogCloseReason>:
     *     A promise that resolves with a close reason once closed.
     */
    async openAndWait(
        options: DialogViewOpenOptions = {},
    ): Promise<DialogCloseReason> {
        return new Promise<DialogCloseReason>(done => {
            this.listenToOnce(this, 'closed', done);

            this.open(options);
        });
    }

    /**
     * Close the dialog.
     *
     * Version Changed:
     *     0.9:
     *     Added the ``reason`` argument.
     *
     * Args:
     *     reason (DialogCloseReason, optional):
     *         The reason the dialog is closed.
     */
    close(reason?: DialogCloseReason) {
        this.#closeReason = reason ?? {
            action: null,
            canceled: false,
        };

        this.el.close();
    }

    /**
     * Set the dialog as busy.
     *
     * When the dialog is busy, all of the actions which are instances of
     * DialogActionView will be set to either busy or disabled depending on
     * whether they are the active action. This allows potentially long-running
     * responses to disable everything while the operation runs.
     *
     * Args:
     *     options (DialogViewSetBusyOptions):
     *         Options for the busy operation.
     */
    setBusy(options: DialogViewSetBusyOptions) {
        const { activeAction, busy } = options;

        for (const action of this.#actions) {
            if (action === activeAction) {
                action.busy = busy;
            } else {
                action.disabled = busy;
            }
        }
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will perform a render of the buttons in the dialog.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;
        const size = options.size;

        this.#onClose = options.onClose || null;

        if (size && size !== 'custom') {
            el.dataset.size = size as string;
        }

        const title = this.renderTitle();
        const body = this.renderBody();
        const primaryActions = this.renderPrimaryActions();
        const secondaryActions = this.renderSecondaryActions();

        const id = this.id;
        const titleID = `${id}__title`;

        el.setAttribute('aria-labelledby', titleID);

        this.#addActions(primaryActions);
        this.#addActions(secondaryActions);

        let suppressLabel: HTMLElement = null;

        if (options.canSuppress) {
            const suppressID = `ink-dialog-suppress-${this.cid}`;

            const suppressEl = paint<HTMLInputElement>`
                <input id="${suppressID}"
                       class="ink-c-dialog__suppress"
                       type="checkbox"/>
            `;

            suppressLabel = paint<HTMLElement>`
                <label class="ink-c-dialog__suppress-label"
                       for="${suppressID}">
                 ${suppressEl}
                 ${options.suppressText || 'Do not ask again'}
                </label>
            `;

            this.#suppressEl = suppressEl;
        }

        renderInto(this.el, paint`
            <div class="ink-c-dialog__inner">
             <header class="ink-c-dialog__title" id="${titleID}">
              ${title}
             </header>
             <main class="ink-c-dialog__body">${body}</main>
             <footer class="ink-c-dialog__actions">
              <div class="ink-c-dialog__actions-secondary">
               ${suppressLabel}
               ${secondaryActions}
              </div>
              <div class="ink-c-dialog__actions-primary">
               ${primaryActions}
              </div>
             </footer>
            </div>
        `);
    }

    /**
     * Handle when the dialog is removed.
     */
    protected onRemove() {
        if (this.isOpen) {
            this.close({
                canceled: true,
            });
        }

        super.onRemove();
    }

    /**
     * Render the title for the dialog.
     *
     * Returns:
     *     ComponentChild or array of ComponentChild:
     *     The elements to add for the title.
     */
    protected renderTitle(): ComponentChild | ComponentChild[] {
        return this.initialComponentState.options.title || this.title;
    }

    /**
     * Render the body for the dialog.
     *
     * Returns:
     *     ComponentChild or array of ComponentChild:
     *     The elements to add for the body.
     */
    protected renderBody(): ComponentChild | ComponentChild[] {
        const body = this.initialComponentState.subcomponents['Body'];

        return body ? body[0].children : null;
    }

    /**
     * Render the primary actions for the dialog.
     *
     * Returns:
     *     ComponentChild or Array of ComponentChild:
     *     The elements to add for the primary actions.
     */
    protected renderPrimaryActions(): ComponentChild | ComponentChild[] {
        const primaryActions =
            this.initialComponentState.subcomponents['PrimaryActions'];

        return primaryActions ? primaryActions[0].children : null;
    }

    /**
     * Render the secondary actions for the dialog.
     *
     * Returns:
     *     ComponentChild or Array of ComponentChild:
     *     The elements to add for the secondary actions.
     */
    protected renderSecondaryActions(): ComponentChild | ComponentChild[] {
        const secondaryActions =
            this.initialComponentState.subcomponents['SecondaryActions'];

        return secondaryActions ? secondaryActions[0].children : null;
    }

    /**
     * Add actions to the dialog.
     *
     * Args:
     *     actions (ComponentChild or Array of ComponentChild):
     *         The child components to add.
     */
    #addActions(actions: ComponentChild | ComponentChild[]) {
        if (_.isArray(actions)) {
            for (const action of actions) {
                this.#addAction(action);
            }
        } else {
            this.#addAction(actions);
        }
    }

    /**
     * Add an action to the dialog.
     *
     * Children of the primary or secondary actions areas may be instances of
     * DialogActionView. In this case, they are provided a reference back to
     * this dialog so that they can call methods such as :js:meth:`close` or
     * :js:meth:`setBusy`.
     *
     * Other components or elements may also be present in the actions areas.
     * These are currently ignored here, so any state must be manually managed
     * by the consumer.
     *
     * Args:
     *     action (ComponentChild):
     *         The child component to add.
     */
    #addAction(action: ComponentChild) {
        if (action instanceof DialogActionView) {
            action.dialog = this;

            this.#actions.push(action);
        }
    }

    /**
     * Handle a "cancel" event on the dialog element.
     *
     * This will attempt to locate a Cancel action, and if found, trigger it.
     *
     * If a Cancel action is not found, this will set a default cancel reason
     * for the signal handlers and close callback, and then let the event
     * bubble up, triggering :js:func:`_onClose`.
     *
     * Version Added:
     *     0.9
     *
     * Args:
     *     e (Event):
     *         The "cancel" event.
     */
    private _onCancel(
        e: Event,
    ) {
        /*
         * Look for a Cancel action. If found, prevent default behavior and
         * invoke it.
         *
         * Note that "cancel" events don't bubble up, and if not prevented
         * will trigger a "close" event.
         */
        for (const action of this.#actions) {
            if (action.actionType === DialogActionType.CANCEL) {
                e.preventDefault();

                action.el.click();
                return;
            }
        }

        /*
         * Fall back to setting a generic close reason for the _onClose()
         * handler to use.
         */
        this.#closeReason ??= {
            action: null,
            canceled: true,
        };
    }

    /**
     * Handle a "close" event on the dialog element.
     *
     * This will notify the caller-provided ``onClose`` handler and then
     * trigger a ``closed`` event on the view. Both receive a
     * :js:class:`DialogCloseReason` argument to indicate how the dialog
     * was closed.
     *
     * Version Added:
     *     0.9
     */
    private _onClose() {
        /*
         * If close() was not called and we didn't get a "cancel" event,
         * then the dialog was manually closed through another mechanism.
         * Provide a defaut, non-canceled reason.
         */
        const closeReason = this.#closeReason ??= {
            action: null,
            canceled: false,
        };

        /* If there's an onClose handler, call this. */
        const onClose = this.#onClose;

        if (onClose) {
            onClose(closeReason);
        }

        /* Trigger any event listeners. */
        this.trigger('closed', closeReason);
    }
}
