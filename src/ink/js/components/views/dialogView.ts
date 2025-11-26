/**
 * A component for dialogs.
 *
 * Version Added:
 *     0.6
 */

import {
    BaseModel,
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
    /** Trigger a callback. */
    CALLBACK = 'callback',

    /** Close the dialog. */
    CLOSE = 'close',

    /** Trigger a callback and then close the dialog. */
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
    action?: DialogActionType;

    /** The function to call, if the action type is callback. */
    callback?: () => Promise<unknown> | void;
}


/**
 * A component for dialog actions.
 *
 * This is a specialization of ButtonView, which can be used to handle common
 * patterns with actions in a dialog.
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

        this.#action = options.action || DialogActionType.CALLBACK;
        this.#callback = options.callback;

        super.initialize(options);
    }

    /**
     * Handle a click on the button.
     */
    protected async onClick() {
        const action = this.#action;
        const dialog = this.dialog;
        console.assert(dialog !== undefined);

        if (action === DialogActionType.CALLBACK ||
            action === DialogActionType.CALLBACK_AND_CLOSE) {
            console.assert(this.#callback !== undefined);

            const result = this.#callback();

            if (result instanceof Promise) {
                dialog.setBusy({
                    activeAction: this,
                    busy: true,
                });

                await result;

                dialog.setBusy({
                    activeAction: this,
                    busy: false,
                });
            }
        }

        if (action === DialogActionType.CLOSE ||
            action === DialogActionType.CALLBACK_AND_CLOSE) {
            this.dialog.close();
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

    /** A function to call when the dialog is closed. */
    onClose?: () => void;

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
    title: string | null;

    static tagName = 'dialog';
    static className = 'ink-c-dialog';
    static subcomponents = {
        'PrimaryActions': 'recordOneSubcomponent',
        'SecondaryActions': 'recordOneSubcomponent',
        'Body': 'recordOneSubcomponent',
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
     * Close the dialog.
     */
    close() {
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

        if (state.options.onClose) {
            this.el.addEventListener('close', () => {
                state.options.onClose();
            });
        }
    }

    /**
     * Handle when the dialog is removed.
     */
    protected onRemove() {
        if (this.isOpen) {
            this.close();
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
}
