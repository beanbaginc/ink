/**
 * A typeahead buffer for tracking keys typed for UI navigation purposes.
 *
 * Version Added:
 *     0.5
 */

import {
    BaseModel,
    spina,
} from '@beanbag/spina';


/**
 * Options for :js:func:`TypeaheadBuffer.helpFindItemWithPrefix`.
 *
 * Version Added:
 *     0.5
 */
export interface HelpFindItemWithPrefixOptions<TItem> {
    /** The first item to search for a match. */
    firstItem: TItem;

    /** The last item to search for a match. */
    lastItem: TItem | null;

    /** A function for returning text to match for an item. */
    getItemText: ((item: TItem) => string);

    /** A function for returning the next item to search. */
    getNextItem: ((item: TItem) => TItem);
}


/**
 * Attributes for TypeaheadBuffer.
 *
 * Version Added:
 *     0.5
 */
export interface TypeaheadBufferAttrs {
    /**
     * Time to wait between key presses before clearing the buffer.
     *
     * This defaults to 3 seconds.
     */
    autoClearDelayMS: number;
}


/**
 * A typeahead buffer for tracking keys typed for UI navigation purposes.
 *
 * This tracks a sequence of keys entered within a short window of time, for
 * the purpose of navigating or selecting items in a UI. It helps with
 * navigating items, matching text, and automatically clearing the buffer
 * once enough time has passed.
 *
 * Version Added:
 *     0.5
 */
@spina
export class TypeaheadBuffer extends BaseModel<TypeaheadBufferAttrs> {
    static defaults: TypeaheadBufferAttrs = {
        autoClearDelayMS: 3 * 1000,
    };

    /**********************
     * Instance variables *
     **********************/

    /**
     * The type-ahead buffer, for navigating within the sidebar.
     *
     * This is cleared after ``autoClearDelayMS`` has passed since the last
     * key was typed.
     */
    buffer: string = '';

    /**
     * A timeout handle for tracking when to clear the type-ahead buffer.
     */
    #clearTimeout: ReturnType<typeof setTimeout> = null;

    /**
     * Return whether there is content in the buffer.
     *
     * Returns:
     *     boolean:
     *     ``true`` if there's content in the buffer. ``false`` if there is
     *     not.
     */
    hasContent(): boolean {
        return this.buffer.length > 0;
    }

    /**
     * Match text in the buffer against a provided string.
     *
     * The provided string will be normalized for comparison purposes. Only
     * alphanumeric Latin characters will be considered.
     *
     * Args:
     *     text (string):
     *         The text to check for a match.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the text matches. ``false`` if it does not.
     */
    matchesText(
        text: string,
    ): boolean {
        return this.#normalizeText(text).startsWith(this.buffer);
    }

    /**
     * Helper to find an item matching the buffer.
     *
     * Args:
     *     options (HelpFindItemWithPrefixOptions):
     *         Options for performing the match.
     *
     * Returns:
     *     any:
     *     A matched item if found, or ``null`` if not found.
     */
    helpFindItemWithPrefix<TItem>(
        options: HelpFindItemWithPrefixOptions<TItem>,
    ): TItem | null {
        const lastItem = (options.lastItem !== undefined
                          ? options.lastItem
                          : null);
        const getNextItem = options.getNextItem;
        const getItemText = options.getItemText;

        for (let item = options.firstItem; ; item = getNextItem(item)) {
            if (this.matchesText(getItemText(item))) {
                return item;
            }

            if (item === lastItem || item === null || item === undefined) {
                /* We're done. */
                break;
            }
        }

        return null;
    }

    /**
     * Clear the buffer.
     *
     * This will reset the buffer and auto-clear timeout.
     */
    clearBuffer() {
        this.#setBuffer('');
    }

    /**
     * Handle a keydown event.
     *
     * This should be called by the consumer on ``keydown`` events. Depending
     * on the key, this will add to the buffer, clear the buffer, or ignore
     * the event.
     *
     * If this results in any change to the buffer, a ``bufferChanged`` event
     * will be emitted with the buffer contents.
     *
     * Args:
     *     evt (KeyboardEvent):
     *         The keyboard event to handle.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the event was handled. ``false`` if it was not.
     */
    handleKeyDown(
        evt: KeyboardEvent,
    ): boolean {
        const key = evt.key;

        if (key.length === 1 &&
            (key.match(/[A-Za-z0-9]/) ||
            this.buffer.length > 0)) {
            /* Record the key and notify the consumer. */
            evt.preventDefault();
            evt.stopPropagation();

            this.#setBuffer(this.buffer + key.toLowerCase());

            return true;
        } else if (key === 'Backspace') {
            /* Backspace the typeahead buffer. */
            evt.preventDefault();
            evt.stopPropagation();

            const bufLen = this.buffer.length;

            if (bufLen > 0) {
                this.#setBuffer(this.buffer.substring(0, bufLen - 1));
            }

            return true;
        } else if (key === 'Escape') {
            /* Clear the typeahead buffer. */
            evt.preventDefault();
            evt.stopPropagation();

            this.#setBuffer('');

            return true;
        }

        return false;
    }

    /**
     * Set the current buffer contents.
     *
     * This will clear any current auto-clear timeout, set the buffer, emit
     * a ``bufferChanged`` event, and then set up a new timeout (if there's
     * content in the buffer).
     *
     * Args:
     *     text (string):
     *         The buffer text to set.
     */
    #setBuffer(text: string) {
        text = this.#normalizeText(text);

        if (text === this.buffer) {
            return;
        }

        if (this.#clearTimeout !== null) {
            clearTimeout(this.#clearTimeout);
            this.#clearTimeout = null;
        }

        this.buffer = text;
        this.trigger('bufferChanged', text);

        if (text.length > 0) {
            this.#clearTimeout = setTimeout(
                () => this.clearBuffer(),
                this.get('autoClearDelayMS'));
        }
    }

    /**
     * Normalize text for comparison.
     *
     * This is used for normalizing both the buffer contents and when
     * normalizing text for comparison purposes.
     *
     * Args:
     *     text (string):
     *         The text to normalize
     *         .
     * Returns:
     *     string:
     *     The normalized text.
     */
    #normalizeText(
        text: string,
    ): string {
        return text
            .trim()
            .replace(/[^A-Za-z0-9]/g, '')
            .toLowerCase();
    }
}
