/**
 * A component for connected groups of buttons.
 *
 * Version Added:
 *     0.5
 */

import {
    type BaseModel,
    spina,
} from '@beanbag/spina';

import {
    Orientation,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';


/**
 * Options for ButtonGroupView.
 *
 * Version Added:
 *     0.5
 */
export interface ButtonGroupViewOptions extends BaseComponentViewOptions {
    /**
     * The orientation used for button layout.
     *
     * This allows for either horizontal or vertical layout.
     *
     * The default is :js:class:`Orientation.HORIZONTAL`.
     */
    orientation?: Orientation;
}


/**
 * Component for showing a group of buttons either horizontally or vertically.
 *
 * This allows a group of buttons that are closely related to be grouped
 * together without visual separation.
 *
 * This is not meant to be used as a toolbar, but more of a menu of buttons.
 *
 * Version Added:
 *     0.5
 */
@inkComponent('Ink.ButtonGroup')
@spina
export class ButtonGroupView<
    T extends BaseModel = BaseModel,
    TOptions extends ButtonGroupViewOptions = ButtonGroupViewOptions,
> extends BaseComponentView<
    T,
    HTMLDivElement,
    TOptions
> {
    static tagName = 'div';
    static className = 'ink-c-button-group';
    static allowComponentChildren = true;

    /**
     * Set the orientation for the group layout.
     *
     * Args:
     *     newOrientation (Orientation):
     *         The new orientation.
     */
    set orientation(newOrientation: Orientation) {
        this.el.setAttribute('aria-orientation',
                             (newOrientation === Orientation.VERTICAL
                              ? 'vertical'
                              : 'horizontal'));
    }

    /**
     * Return the orientation for the group layout.
     *
     * Returns:
     *     Orientation:
     *     The current group layout orientation.
     */
    get orientation(): Orientation {
        return this.el.getAttribute('aria-orientation') === 'vertical'
               ? Orientation.VERTICAL
               : Orientation.HORIZONTAL;
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will perform a render of the buttons in the group.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const state = this.initialComponentState;

        el.setAttribute('role', 'group');
        this.orientation = state.options.orientation;

        renderInto(el, paint`${state.children}`);
    }
}
