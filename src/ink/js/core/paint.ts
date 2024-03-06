/**
 * Support for painting components into DOM elements.
 *
 * Version Added:
 *     1.0
 */

import htm from 'htm/mini';

import {
    ComponentChild,
    ComponentProps,
    SubcomponentInfo,
    isSubcomponentInfo,
} from './components';
import {
    CraftComponentItem,
    CraftedComponent,
    craftComponent,
    craftComponents,
} from './craft';


/**
 * An item that can be painted to an element.
 *
 * Version Added:
 *     1.0
 */
export type PaintableItem = (
    CraftedComponent |
    ComponentChild |
    Node |
    false
);


/**
 * Utility interface for typing paint functions.
 *
 * This is used internally by :js:func:`paint`.
 *
 * Version Added:
 *     1.0
 */
interface PaintFunction {
    <TResult extends (HTMLElement | HTMLElement[])>(
        strings: TemplateStringsArray | string[],
        ...values: unknown[]
    ): TResult;
}


/* Type stubs for paintComponent(). */
export function paintComponent<
    TTag extends keyof HTMLElementTagNameMap,
>(
    name: TTag,
    props: ComponentProps,
    ...children: ComponentChild[]
): HTMLElementTagNameMap[TTag];


export function paintComponent<
    TElement extends HTMLElement,
>(
    name: string,
    props?: ComponentProps,
    ...children: ComponentChild[]
): TElement;


/**
 * Paint a component or HTML element.
 *
 * This will craft and then paint a component or HTML element, returning an
 * element that can be inserted into the DOM.
 *
 * If painting a component, the component instance will be instantiated (if
 * not already an instance), rendered to an element, and returned.
 *
 * If painting an HTML element, the Element instance will be returned.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     name (string):
 *         The name of the component or HTML element to craft.
 *
 *     props (object):
 *         Properties to pass to the component constructor, or Element
 *         attributes.
 *
 *         If painting an Ink component, these will be passed to the
 *         constructor.
 *
 *         If painting an HTML element, these will be set as attributes on the
 *         DOM Element object.
 *
 *     ...children (ComponentChild[]):
 *         Any children to nest within the crafted component.
 *
 *         If painting a component, then children will not be painted
 *         automatically. It's up to the component to handle each item.
 *
 *         If painting an HTML element, then children will be painted
 *         automatically.
 *
 *         This is not supported for all components or HTML tags.
 *
 * Returns:
 *     HTMLElement:
 *     The HTML Element instance.
 */
export function paintComponent<
    TElement extends HTMLElement,
    TTag extends keyof HTMLElementTagNameMap,
    TChild extends ComponentChild,
>(
    name: string | TTag,
    props: ComponentProps,
    ...children: TChild[]
): TElement | HTMLElementTagNameMap[TTag] | SubcomponentInfo {
    const component = craftComponent(name, props, ...children);

    return (isSubcomponentInfo(component)
            ? component
            : paintCraftedElements([component])[0] as TElement);
}


/**
 * Template tag for painting components using an HTML-like language.
 *
 * See https://github.com/developit/htm for details on usage.
 *
 * Results will :js:class:`HTMLElement` instances. Callers can specify a
 * more precise type as a generic.
 *
 * Version Added:
 *     1.0
 */
export const paint: PaintFunction = htm.bind(paintComponent) as PaintFunction;


export function paintComponents(
    items: CraftComponentItem[],
): Node[] {
    return paintCraftedElements(craftComponents(items));
}


/**
 * Paint an array of crafted components/elements or children to DOM nodes.
 *
 * This will loop through the items and convert each to an element using the
 * following rules:
 *
 * 1. If it's an element already, it will be used as-is.
 * 2. If it's a string, it will be converted to a :js:class:`Text` node.
 * 3. If it's a component instance, it will be rendered and its element
 *    returned.
 *
 * Note:
 *     This will not craft components to instances.
 *
 *     It's the responsibility of the caller to ensure these are already
 *     instantiated.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     items (PaintableItem or PaintableItem[]):
 *         The item or items to paint.
 *
 * Returns:
 *     Node[]:
 *     The painted nodes to insert into the DOM.
 */
export function paintCraftedElements(
    items: PaintableItem | PaintableItem[],
): Node[] {
    if (!Array.isArray(items)) {
        items = [items];
    }

    const nodes: Node[] = [];

    for (const item of items) {
        if (item === null || item === undefined || item === false) {
            continue;
        }

        if (item instanceof Node) {
            nodes.push(item);
        } else if (typeof item === 'string') {
            nodes.push(document.createTextNode(item));
        } else if (Array.isArray(item)) {
            /*
             * This is the result of an inner paintCraftedElements() call for
             * children of a node. We should have a 1-element array of nodes
             * that we can inline.
             */
            nodes.push(...paintCraftedElements(item));
        } else if (item['el']) {
            nodes.push(item['el']);
        } else {
            console.assert(false, 'Unsupported render item %o', item);
        }
    }

    return nodes;
}
