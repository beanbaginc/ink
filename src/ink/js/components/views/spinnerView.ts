/**
 * A component for a spinner.
 *
 * Version Added:
 *     1.0
 */

import {
    BaseModel,
    BaseView,
    spina,
} from '@beanbag/spina';

import { inkComponent } from '../../core';
import { BaseComponentViewOptions } from './baseComponentView';


/**
 * Options for SpinnerView.
 *
 * Version Added:
 *     1.0
 */
export type SpinnerViewOptions = BaseComponentViewOptions;


/**
 * Component for showing a spinner.
 *
 * This will show a spinner indicating that an operation is taking place, such
 * as content loading from a server.
 *
 * When using the spinner to represent content loading in a parent element,
 * it's best to set ``aria-busy="true"`` on that element in order to inform
 * screen readers that the content is still loading. It's very important to
 * remove this attribute once the load has completed.
 *
 * This should be used along with ``aria-live=`` to indicate that the
 * element will be updated.
 *
 * Alternatively, you might want to use ``aria-hidden="false"`` on this, if
 * it should not be read or seen by the screen reader, or ``aria-label="..."``
 * if it should (and does not otherwise have accompanying text).
 *
 * Version Added:
 *     1.0
 */
@inkComponent('Ink.Spinner')
@spina
export class SpinnerView<
    T extends BaseModel = BaseModel,
    OptionsT extends SpinnerViewOptions = SpinnerViewOptions,
> extends BaseView<
    T,
    HTMLSpanElement,
    OptionsT
> {
    static tagName = 'span';
    static className = 'ink-c-spinner';
}
