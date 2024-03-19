/**
 * A component for connected groups of buttons.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';

import {
    Orientation,
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import {
    BaseComponentView,
    BaseComponentViewOptions,
} from './baseComponentView';


/**
 * Options for ButtonGroupView.
 *
 * Version Added:
 *     1.0
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
 *     1.0
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
        this.el.classList.toggle('-is-vertical',
                                 newOrientation === Orientation.VERTICAL);
    }

    /**
     * Return the orientation for the group layout.
     *
     * Returns:
     *     Orientation:
     *     The current group layout orientation.
     */
    get orientation(): Orientation {
        return this.el.classList.contains('-is-vertical')
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
