/**
 * Support for painting components into DOM elements.
 *
 * Version Added:
 *     0.5
 */

import htm from 'htm/mini';

import {
    type CraftComponentItem,
    craftComponents,
} from './craft';
import {
    type PaintableItem,
    paintComponent,
    paintCraftedElements,
} from './_craftAndPaint';


/**
 * Utility interface for typing paint functions.
 *
 * This is used internally by :js:func:`paint`.
 *
 * Version Added:
 *     0.5
 */
interface PaintFunction {
    <TResult extends (HTMLElement | HTMLElement[])>(
        strings: TemplateStringsArray | string[],
        ...values: unknown[]
    ): TResult;
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
 *     0.5
 */
export const paint: PaintFunction = htm.bind(paintComponent) as PaintFunction;


/**
 * Paint an array of components.
 *
 * This will paint each component item, returning an array with each resulting
 * populated element in the order specified.
 *
 * Version Added:
 *     0.5
 *
 * Args:
 *     items (Array of object):
 *         The component information items.
 *
 * Returns:
 *     Array:
 *     The resulting painted elements.
 */
export function paintComponents(
    items: CraftComponentItem[],
): Node[] {
    return paintCraftedElements(craftComponents(items));
}


/*
 * Export the types and functions from _craftAndPaint.ts that we want public.
 */
export {
    type PaintableItem,
    paintComponent,
    paintCraftedElements,
};
