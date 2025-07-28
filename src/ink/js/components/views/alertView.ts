/**
 * A component for an informational alert panel.
 *
 * Version Added:
 *     0.5
 */

import {
    type BaseModel,
    type EventsHash,
    spina,
} from '@beanbag/spina';

import {
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';


/**
 * The type of an alert.
 *
 * Version Added:
 *     0.5
 */
export enum AlertType {
    /** An alert showing an error. */
    ERROR = 'error',

    /** An alert representing an informational display. */
    INFO = 'info',

    /** A standard alert. */
    STANDARD = 'standard',

    /** An alert showing an operation was successful. */
    SUCCESS = 'success',

    /** An alert showing a warning. */
    WARNING = 'warning',
}


/**
 * Options for AlertView.
 *
 * Version Added:
 *     0.5
 */
export interface AlertViewOptions extends BaseComponentViewOptions {
    /**
     * Whether to show a close button on the alert.
     */
    canClose?: boolean;

    /**
     * The text used to describe the "Close" button.
     *
     * This is used for ARIA labels and tooltips.
     *
     * It defaults to "Close".
     */
    closeText?: string;

    /**
     * Whether this alert is considered important enough to notify a user.
     *
     * When set, this will set ``role="alert"`` on the element, which will
     * notify screen readers of the alert.
     *
     * This should not be used if the alert is more passive/informational,
     * or displayed as part of page load. Use this only if it's in reaction
     * to a dynamic operation.
     */
    important?: boolean;

    /**
     * Handler to invoke when the alert is closed.
     */
    onClose?: (() => void);

    /**
     * The type of the alert.
     *
     * This defaults to :js:class:`AlertType.STANDARD`.
     */
    type?: AlertType;
}


/**
 * Component for showing an alert panel for communicating status or information.
 *
 * Alerts are used to show helpful information or communicate status of an
 * operation. They provide an icon, color, and title to represent the summary,
 * and an optional description providing further detail.
 *
 * Version Added:
 *     0.5
 */
@inkComponent('Ink.Alert')
@spina
export class AlertView<
    T extends BaseModel = BaseModel,
    OptionsT extends AlertViewOptions = AlertViewOptions,
> extends BaseComponentView<
    T,
    HTMLDivElement,
    OptionsT
> {
    static className = 'ink-c-alert';

    static subcomponents = {
        'Content': 'recordOneSubcomponent',
        'Heading': 'recordOneSubcomponent',
        'Actions': 'recordOneSubcomponent',
    };

    static events: EventsHash = {
        'click .ink-c-alert__close': '_onClose',
    };

    /**********************
     * Instance variables *
     **********************/

    /**
     * The handler to invoke when the alert is closed.
     */
    #onClose: (() => void) | null;

    /**
     * Initialize the alert component.
     *
     * Args:
     *     options (AlertViewOptions):
     *         The options for the view.
     */
    initialize(options: OptionsT) {
        super.initialize(options);

        if (options) {
            this.#onClose = options.onClose;
        }
    }

    /**
     * Handle the initial rendering of the component.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;
        const options = state.options;
        const closeText = options.closeText || 'Close';

        const subcomponents = state.subcomponents || {};
        const actions = subcomponents['Actions'];
        const content = subcomponents['Content'];
        const heading = subcomponents['Heading'];

        el.setAttribute('data-type', options.type || 'standard');
        el.setAttribute('role', options.important ? 'alert' : 'status');

        renderInto(el, paint`
            ${options.canClose && paint`
             <span class="ink-c-alert__close"
                   role="button"
                   title="${closeText}"
                   aria-label="${closeText}"
                   tabindex="0"/>
            `}
            <div class="ink-c-alert__content">
             <h3 class="ink-c-alert__heading">
              ${heading && paint`${heading[0].children}`}
             </h3>
             ${content && paint`
              <div class="ink-c-alert__body">
               ${content[0].children}
              </div>
             `}
             ${actions && paint`
              <div class="ink-c-alert__actions">
               ${actions[0].children}
              </div>
             `}
            </div>
        `);
    }

    /**
     * Handle clicking the close event.
     *
     * This will close the alert, and then call a close handler if provided
     * by the consumer.
     */
    private _onClose() {
        this.remove();

        if (this.#onClose) {
            this.#onClose();
        }
    }
}
