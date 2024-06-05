/**
 * Utilities for manipulating properties in the DOM.
 *
 * Version Added:
 *     1.0
 */

/**
 * A mapping of attribute names to their Element counterparts for setProps().
 *
 * Version Added:
 *     1.0
 */
const _SetPropsAliases = {
    'class': 'className',
    'tabindex': 'tabIndex',
};


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
