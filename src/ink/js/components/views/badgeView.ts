/**
 * A component for a small inline status badge.
 *
 * Version Added:
 *     0.10
 */

import {
    type BaseModel,
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
 * The type of a badge.
 *
 * This controls the color scheme used for the badge.
 *
 * Version Added:
 *     0.10
 */
export enum BadgeType {
    /** A badge showing an error. */
    ERROR = 'error',

    /** A badge representing an informational display. */
    INFO = 'info',

    /** A standard, neutral badge. */
    STANDARD = 'standard',

    /** A badge showing a successful result. */
    SUCCESS = 'success',

    /** A badge showing a warning. */
    WARNING = 'warning',
}


/**
 * Options for BadgeView.
 *
 * Version Added:
 *     0.10
 */
export interface BadgeViewOptions extends BaseComponentViewOptions {
    /**
     * The name of an optional icon class to show after the label.
     *
     * This should be a registered icon class, such as ``ink-i-success``.
     */
    iconEnd?: string;

    /**
     * The name of an optional icon class to show before the label.
     *
     * This should be a registered icon class, such as ``ink-i-success``.
     */
    iconStart?: string;

    /**
     * The type of the badge.
     *
     * This defaults to :js:class:`BadgeType.STANDARD`.
     */
    type?: BadgeType;
}


/**
 * Component for a small inline badge that communicates status or labels.
 *
 * Badges are compact pills used to label or annotate content. They show a
 * short text label, optionally accompanied by an icon at the start or end,
 * in a color scheme chosen by the badge ``type``.
 *
 * Custom colors:
 *     There are no color options. To use custom colors, pass a ``class`` or
 *     inline ``style`` when crafting the badge and override the badge's
 *     private CSS variables: ``--_ink-c-badge-bg``, ``--_ink-c-badge-fg``,
 *     and ``--_ink-c-badge-border-color``.
 *
 * Links:
 *     Badges are not interactive. To make a badge act as a link, wrap it in
 *     an ``<a href>`` element.
 *
 *     For accessibility, the ``<a>`` is the focusable, interactive element,
 *     and the badge's text supplies the accessible name. The badge itself
 *     must not be made interactive.
 *
 * Version Added:
 *     0.10
 */
@inkComponent('Ink.Badge')
@spina
export class BadgeView<
    TModel extends BaseModel = BaseModel,
    TOptions extends BadgeViewOptions = BadgeViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLSpanElement,
    TOptions
> {
    static tagName = 'span';
    static className = 'ink-c-badge';
    static allowComponentChildren = true;

    /**********************
     * Instance variables *
     **********************/

    /**
     * The text label for the badge.
     */
    #label = '';

    /**
     * Set the text label for the badge.
     *
     * Args:
     *     children (Array of string):
     *         The children passed to the component. This must be a single
     *         string.
     */
    setComponentChildren(children: string[]) {
        if (children.length > 0) {
            if (children.length !== 1 ||
                typeof (children[0] || '') !== 'string') {
                throw Error(
                    'Ink.Badge can only accept a single string child as a ' +
                    'label.'
                );
            }

            this.#label = children[0];
        } else {
            this.#label = '';
        }
    }

    /**
     * Handle the initial rendering of the component.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const options = this.initialComponentState.options;
        const iconStart = options.iconStart;
        const iconEnd = options.iconEnd;

        el.setAttribute('data-type', options.type || BadgeType.STANDARD);

        renderInto(el, paint`
            ${iconStart && paint`
             <span class="ink-c-badge__icon ${iconStart}"
                   aria-hidden="true"></span>
            `}
            <span class="ink-c-badge__label">${this.#label}</span>
            ${iconEnd && paint`
             <span class="ink-c-badge__icon ${iconEnd}"
                   aria-hidden="true"></span>
            `}
        `);
    }
}
