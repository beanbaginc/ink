/**
 * Utilities for working with the DOM.
 *
 * Version Added:
 *     1.0
 */

import * as _ from 'underscore';
import {
    CraftedComponent,
} from './craft';
import {
    paintCraftedElements,
} from './paint';


/**
 * Options for a renderInto() call.
 *
 * Version Added:
 *     1.0
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
 * A mapping of attribute names to their Element counterparts for setProps().
 *
 * Version Added:
 *     1.0
 */
const _SetPropsAliases = {
    'class': 'className',
};


/**
 * Render one or more elements or crafted components into a DOM element.
 *
 * This is a replacement for using :js:func:`Element.append` or
 * :js:func:`Element.insertBefore`, and automatically takes care of painting
 * anything that's not already an :js:class:`Element`.
 *
 * Version Added:
 *     1.0
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
 *     1.0
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


/**
 * Recursively set properties on a DOM element.
 *
 * This is a convenience for setting multiple attributes on a DOM element,
 * recursing into any nested objects (such as ``style``).
 *
 * While most attributes are set directly via :js:`Element` attributes, some
 * will be normalized or set via :js:class:`Element.setAttribute`:
 *
 * ``aria-*``:
 *     These will be normalized to :js:class:`Element.setAttribute` calls.
 *
 * ``class``:
 *     This will be normalized as ``className``.
 *
 * ``data-*``:
 *     These will be normalized to :js:class:`Element.setAttribute` calls.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     el (Element):
 *         The element to set properties on.
 *
 *     props (object):
 *         The properties to set.
 *
 * Returns:
 *     Element:
 *     The element, for chaining purposes.
 */
export function setProps(
    el: Element,
    props: Record<string, unknown>,
): typeof el {
    /* First, handle the outer properties. */
    for (const [key, value] of Object.entries(props)) {
        if (key.startsWith('aria-') || key.startsWith('data-')) {
            el.setAttribute(
                key,
                typeof value === 'string' ? value : String(value));
        } else if (typeof value === 'object' && el[key] !== undefined) {
            _mergeInnerProps(el[key], value);
        } else {
            el[_SetPropsAliases[key] || key] = value;
        }
    }

    return el;
}


/**
 * Merge properties inside an object.
 *
 * This will recursively merge properties from one object into another.
 * It's used internally by :js:func:`setProps`.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     el (object):
 *         The object to merge properties into.
 *
 *     props (object):
 *         The properties to merge.
 */
function _mergeInnerProps(
    mergeObj: object,
    mergeProps: Record<string, any>,
) {
    for (const [key, value] of Object.entries(mergeProps)) {
        if (typeof value === 'object' && mergeObj[key] !== undefined) {
            _mergeInnerProps(mergeObj[key], value);
        } else {
            mergeObj[key] = value;
        }
    }
}
