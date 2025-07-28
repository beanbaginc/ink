/**
 * DOM event utility functions for unit testing.
 *
 * Version Added:
 *     0.5
 */


/**
 * Utility function to send key events to an element.
 *
 * This accepts either a string of characters to send one-by-one, or an
 * array of strings that accept named keys (such as ``ArrowDown``).
 *
 * Each key will be sent as a keydown/keyup pair. The events will be set to
 * bubble up and be cancelable.
 *
 * Version Added:
 *     0.5
 *
 * Args:
 *     el (HTMLElement):
 *         The element to send keys to.
 *
 *     keys (string or string[]):
 *         The string of characters, or array of characters/named keys to
 *         send to the element.
 */
export function sendKeys(
    el: HTMLElement,
    keys: string | string[],
) {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        el.dispatchEvent(new window.KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: key,
        }));
        el.dispatchEvent(new window.KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            key: key,
        }));
    }
}
