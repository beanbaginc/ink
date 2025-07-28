/**
 * Utilities for rendering content in the DOM.
 *
 * Version Added:
 *     0.5
 */

import * as _ from 'underscore';

import {
    type CraftedComponent,
} from '../craft';
import {
    paintCraftedElements,
} from '../paint';


/**
 * Options for a renderInto() call.
 *
 * Version Added:
 *     0.5
 */
interface RenderIntoOptions {
    /**
     * Whether to empty out the element before inserting the view's element.
     */
    empty?: boolean

    /**
     * Whether to prepend the view's element, rather than appending it.
     */
    prepend?: boolean
}


/**
 * Render one or more elements or crafted components into a DOM element.
 *
 * This is a replacement for using :js:func:`Element.append` or
 * :js:func:`Element.insertBefore`, and automatically takes care of painting
 * anything that's not already an :js:class:`Element`.
 *
 * Version Added:
 *     0.5
 *
 * Args:
 *     targetEl (HTMLElement or JQuery):
 *         The element or JQuery-wrapped element to render into.
 *
 *     items (CraftedComponent or CraftedComponent[]):
 *         The item or items to paint and render into the target element.
 *
 *     options (RenderIntoOptions, optional):
 *         Options to control rendering and where elements are placed.
 *
 * Returns:
 *     HTMLElement or JQuery:
 *     The target element or JQuery-wrapped element, for chaining.
 */
export function renderInto(
    targetEl: HTMLElement | JQuery,
    items: Node | CraftedComponent | (Node | CraftedComponent)[],
    options: RenderIntoOptions = {},
): typeof targetEl {
    return renderNodesInto(targetEl,
                           paintCraftedElements(items),
                           options);
}


/**
 * Render nodes into a DOM element.
 *
 * This is a replacement for using :js:func:`Element.append` or
 * :js:func:`Element.insertBefore`, handling batches of nodes at once.
 *
 * Version Added:
 *     0.5
 *
 * Args:
 *     targetEl (HTMLElement or JQuery):
 *         The element or JQuery-wrapped element to render into.
 *
 *     items (CraftedComponent or CraftedComponent[]):
 *         The item or items to paint and render into the target element.
 *
 *     options (RenderIntoOptions, optional):
 *         Options to control rendering and where elements are placed.
 *
 * Returns:
 *     HTMLElement or JQuery:
 *     The target element or JQuery-wrapped element, for chaining.
 */
export function renderNodesInto(
    targetEl: HTMLElement | JQuery,
    nodes: Node[],
    options: RenderIntoOptions = {},
): typeof targetEl {
    const normTargetEl: HTMLElement =
        _.isElement(targetEl)
        ? targetEl
        : targetEl[0];

    if (options.empty) {
        normTargetEl.innerHTML = '';
    }

    if (options.prepend) {
        const firstChild = normTargetEl.firstChild;

        for (const node of nodes) {
            normTargetEl.insertBefore(node, firstChild);
        }
    } else {
        normTargetEl.append(...nodes);
    }

    return targetEl;
}
