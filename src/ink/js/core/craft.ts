/**
 * Support for crafting instances and trees of components.
 *
 * Version Added:
 *     1.0
 */

import htm from 'htm/mini';

import {
    type Component,
    type ComponentChild,
    type ComponentCtr,
    type ComponentProps,
} from './components';
import {
    type CraftedComponent,
    craftComponent,
} from './_craftAndPaint';


/**
 * An item to craft, when crafting a tree of components.
 *
 * Version Added:
 *     1.0
 */
export interface CraftComponentItem {
    /**
     * The name of the component or HTML element to craft.
     *
     * Either this or ``component`` must be provided.
     */
    name?: string;

    /**
     * The class of the component to craft.
     *
     * Either this or ``name`` must be provided.
     */
    component?: ComponentCtr;

    /**
     * Properties to pass to the component constructor, or Element attributes.
     *
     * If crafting an Ink component, these will be passed to the constructor.
     *
     * If crafting an HTML element, these will be set as attributes on the
     * DOM Element object.
     */
    props?: ComponentProps;

    /**
     * Any children to nest within the crafted component.
     *
     * If crafting a component, then children will not be painted
     * automatically. It's up to the component to handle each item.
     *
     * If crafting an HTML element, then children will be painted
     * automatically.
     *
     * This is not supported for all components or HTML tags.
     */
    children?: ComponentChild[];
}


/**
 * Utility interface for typing craft functions.
 *
 * This is used internally by :js:func:`craft`.
 *
 * Version Added:
 *     1.0
 */
interface CraftFunction {
    <TResult extends (CraftedComponent<HTMLElement, Component> |
                      CraftedComponent<HTMLElement, Component>[])>(
        strings: TemplateStringsArray | string[],
        ...values: unknown[]
    ): TResult;
}


/**
 * Template tag for crafting components using an HTML-like language.
 *
 * See https://github.com/developit/htm for details on usage.
 *
 * Results will be component or :js:class:`HTMLElement` instances. Callers
 * can specify a more precise type as a generic.
 *
 * Version Added:
 *     1.0
 */
export const craft: CraftFunction = htm.bind(craftComponent) as CraftFunction;


/**
 * Craft an array of components.
 *
 * This will craft each component item, returning an array with each
 * resulting populated component in the order specified.
 *
 * Version Added:
 *     1.0
 *
 * Args:
 *     items (Array of object):
 *         The component information items.
 *
 * Returns:
 *     Array:
 *     The resulting crafted components.
 */
export function craftComponents(
    items: CraftComponentItem[],
): CraftedComponent<HTMLElement, Component>[] {
    return items.map(item => craftComponent(item.name ?? item.component,
                                            item.props || {},
                                            ...(item.children || [])));
}


/*
 * Export the types and functions from _craftAndPaint.ts that we want public.
 */
export {
    type CraftedComponent,
    craftComponent,
};
