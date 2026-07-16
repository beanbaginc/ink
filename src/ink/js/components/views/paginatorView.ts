/**
 * A component for navigating through pages of content.
 *
 * Version Added:
 *     0.10
 */

import {
    type BaseModel,
    spina,
} from '@beanbag/spina';

import {
    inkComponent,
    paint,
    renderInto,
} from '../../core';
import {
    type BaseComponentViewOptions,
    BaseComponentView,
} from './baseComponentView';


/**
 * Options for PaginatorView.
 *
 * Version Added:
 *     0.10
 */
export interface PaginatorViewOptions extends BaseComponentViewOptions {
    /**
     * A label describing the paginator for screen readers.
     *
     * This defaults to "Pagination".
     */
    ariaLabel?: string;

    /**
     * Whether the paginator should be disabled.
     */
    disabled?: boolean;

    /**
     * The label for the "first page" navigation control.
     *
     * This is used for both the tooltip and screen readers. It defaults to
     * "First page".
     */
    firstPageText?: string;

    /**
     * Whether to stretch the paginator to the width of its container.
     *
     * When set, the first/previous controls are pinned to the left edge,
     * the next/last controls to the right edge, and the page numbers stay
     * centered.
     */
    fullWidth?: boolean;

    /**
     * The label for the "last page" navigation control.
     *
     * This is used for both the tooltip and screen readers. It defaults to
     * "Last page".
     */
    lastPageText?: string;

    /**
     * The label for the "next page" navigation control.
     *
     * This is used for both the tooltip and screen readers. It defaults to
     * "Next page".
     */
    nextPageText?: string;

    /**
     * Handler to invoke when a new page is selected.
     */
    onPageSelect?: (page: number) => void;

    /**
     * The current 1-based page number.
     *
     * This defaults to 1.
     */
    page?: number;

    /**
     * The number of page buttons shown on each side of the current page.
     *
     * This defaults to 2.
     */
    pageRange?: number;

    /**
     * The total number of pages.
     *
     * This defaults to 1.
     */
    pages?: number;

    /**
     * The label for a page number button, for screen readers.
     *
     * Any ``{page}`` in this will be replaced with the page number. This
     * defaults to "Page {page}".
     */
    pageText?: string;

    /**
     * The label for the "previous page" navigation control.
     *
     * This is used for both the tooltip and screen readers. It defaults to
     * "Previous page".
     */
    previousPageText?: string;
}


/**
 * Component for navigating through pages of content.
 *
 * Paginators show buttons for the page numbers around the current page,
 * along with previous/next navigation controls. When there are more pages
 * than can be shown, the page numbers are truncated with ellipses, and
 * dedicated first/last controls handle jumping to the edges.
 *
 * Consumers can listen for page selection either through the
 * ``onPageSelect`` option or the ``pageSelected`` event. The current page
 * and total number of pages can be changed at runtime.
 *
 * Custom sizing:
 *     The paginator scales with its font size. To show a smaller or larger
 *     paginator, pass a ``class`` or inline ``style`` when crafting the
 *     paginator and override the ``--ink-c-paginator-font-size`` CSS
 *     variable.
 *
 * Version Added:
 *     0.10
 */
@inkComponent('Ink.Paginator')
@spina
export class PaginatorView<
    TModel extends BaseModel = BaseModel,
    TOptions extends PaginatorViewOptions = PaginatorViewOptions,
> extends BaseComponentView<
    TModel,
    HTMLElement,
    TOptions
> {
    static tagName = 'nav';
    static className = 'ink-c-paginator';

    /**********************
     * Instance variables *
     **********************/

    /** The label for the "first page" navigation control. */
    #firstPageText = 'First page';

    /** The label for the "last page" navigation control. */
    #lastPageText = 'Last page';

    /** The label for the "next page" navigation control. */
    #nextPageText = 'Next page';

    /** The handler to invoke when a new page is selected. */
    #onPageSelect: ((page: number) => void) | null = null;

    /** The current 1-based page number. */
    #page = 1;

    /** The number of page buttons shown on each side of the current page. */
    #pageRange = 2;

    /** The total number of pages. */
    #pages = 1;

    /** The label template for a page number button. */
    #pageText = 'Page {page}';

    /** The label for the "previous page" navigation control. */
    #previousPageText = 'Previous page';

    /**
     * Return whether the paginator is disabled.
     *
     * Returns:
     *     boolean:
     *     ``true`` if the paginator is disabled. ``false`` if it is not.
     */
    get disabled(): boolean {
        return this.el.classList.contains('-is-disabled');
    }

    /**
     * Set whether the paginator is disabled.
     *
     * Args:
     *     newDisabled (boolean):
     *         ``true`` if the paginator should be disabled. ``false``
     *         if it should not.
     */
    set disabled(newDisabled: boolean) {
        const el = this.el;

        el.classList.toggle('-is-disabled', newDisabled);
        el.toggleAttribute('inert', newDisabled);

        if (newDisabled) {
            el.setAttribute('aria-disabled', 'true');
        } else {
            el.removeAttribute('aria-disabled');
        }
    }

    /**
     * Return the current page number.
     *
     * Returns:
     *     number:
     *     The current 1-based page number.
     */
    get page(): number {
        return this.#page;
    }

    /**
     * Set the current page number.
     *
     * This will be clamped to the range of available pages. It won't
     * trigger a ``pageSelected`` event.
     *
     * Args:
     *     newPage (number):
     *         The new 1-based page number.
     */
    set page(newPage: number) {
        newPage = Math.min(Math.max(newPage, 1), this.#pages);

        if (newPage !== this.#page) {
            this.#page = newPage;
            this.#renderInterior();
        }
    }

    /**
     * Return the total number of pages.
     *
     * Returns:
     *     number:
     *     The total number of pages.
     */
    get pages(): number {
        return this.#pages;
    }

    /**
     * Set the total number of pages.
     *
     * If the current page is past the new total, it will be clamped to the
     * last page. Like setting ``page``, this won't trigger a
     * ``pageSelected`` event, so callers are responsible for reloading any
     * content if the page changes.
     *
     * Args:
     *     newPages (number):
     *         The new total number of pages.
     */
    set pages(newPages: number) {
        newPages = Math.max(newPages, 1);

        if (newPages !== this.#pages) {
            this.#pages = newPages;
            this.#page = Math.min(this.#page, newPages);
            this.#renderInterior();
        }
    }

    /**
     * Handle the initial rendering of the component.
     *
     * This will set up the paginator's state and event handlers, and
     * perform an initial render of the controls.
     */
    protected onComponentInitialRender() {
        const el = this.el;
        const options = this.initialComponentState.options;

        /*
         * These use || rather than ?? so that an empty label falls back to
         * the default. A blank label would leave the control unusable for
         * screen readers.
         */
        this.#firstPageText = options.firstPageText || this.#firstPageText;
        this.#lastPageText = options.lastPageText || this.#lastPageText;
        this.#nextPageText = options.nextPageText || this.#nextPageText;
        this.#pageText = options.pageText || this.#pageText;
        this.#previousPageText = options.previousPageText ||
                                 this.#previousPageText;

        this.#onPageSelect = options.onPageSelect ?? null;
        this.#pageRange = Math.max(options.pageRange ?? 2, 0);
        this.#pages = Math.max(options.pages ?? 1, 1);
        this.#page = Math.min(Math.max(options.page ?? 1, 1), this.#pages);

        el.setAttribute('aria-label', options.ariaLabel || 'Pagination');
        el.classList.toggle('-is-full-width', !!options.fullWidth);
        this.disabled = !!options.disabled;

        el.addEventListener('click', evt => {
            const itemEl = (evt.target as Element)
                .closest('.ink-c-paginator__item');
            const page = itemEl?.getAttribute('data-page');

            if (page) {
                evt.preventDefault();
                evt.stopPropagation();

                this.#selectPage(parseInt(page, 10));
            }
        });

        this.#renderInterior();
    }

    /**
     * Return the label of the item that currently has keyboard focus.
     *
     * Returns:
     *     string:
     *     The ``aria-label`` of the focused item, or ``null`` if focus is
     *     not on an item within the paginator.
     */
    #getFocusedItemLabel(): string | null {
        const el = this.el;
        const activeEl = el.ownerDocument.activeElement;

        return (activeEl && activeEl !== el && el.contains(activeEl))
               ? activeEl.getAttribute('aria-label')
               : null;
    }

    /**
     * Paint an ellipsis marking truncated page numbers.
     *
     * Returns:
     *     HTMLSpanElement:
     *     The new ellipsis element.
     */
    #paintEllipsis(): HTMLSpanElement {
        return paint<HTMLSpanElement>`
            <span class="ink-c-paginator__ellipsis" aria-hidden="true">…</span>
        `;
    }

    /**
     * Paint a first/previous/next/last navigation control.
     *
     * Args:
     *     iconName (string):
     *         The icon class name to show on the control.
     *
     *     label (string):
     *         The label describing the control, used for both the tooltip
     *         and screen readers.
     *
     *     targetPage (number):
     *         The page to navigate to when clicked.
     *
     *     disabled (boolean):
     *         Whether the control is disabled.
     *
     * Returns:
     *     HTMLButtonElement:
     *     The new navigation control element.
     */
    #paintNavItem(
        iconName: string,
        label: string,
        targetPage: number,
        disabled: boolean,
    ): HTMLButtonElement {
        const itemEl = paint<HTMLButtonElement>`
            <button class="ink-c-paginator__item -is-nav"
                    type="button"
                    title="${label}"
                    aria-label="${label}"
                    data-page="${targetPage}">
             <span class="ink-c-paginator__icon ${iconName}"
                   aria-hidden="true"></span>
            </button>
        `;

        itemEl.disabled = disabled;

        return itemEl;
    }

    /**
     * Paint a page number button.
     *
     * Args:
     *     page (number):
     *         The page number to show.
     *
     *     isCurrent (boolean):
     *         Whether this is the current page.
     *
     * Returns:
     *     HTMLButtonElement:
     *     The new page button element.
     */
    #paintPageItem(
        page: number,
        isCurrent: boolean,
    ): HTMLButtonElement {
        const label = this.#pageText.replace('{page}', String(page));
        const itemEl = paint<HTMLButtonElement>`
            <button class="ink-c-paginator__item"
                    type="button"
                    aria-label="${label}">${String(page)}</button>
        `;

        if (isCurrent) {
            itemEl.classList.add('-is-current');
            itemEl.setAttribute('aria-current', 'page');
        } else {
            itemEl.setAttribute('data-page', String(page));
        }

        return itemEl;
    }

    /**
     * Render the interior of the paginator.
     *
     * This will rebuild the navigation controls and page numbers based on
     * the current state.
     */
    #renderInterior() {
        const el = this.el;
        const page = this.#page;
        const pageRange = this.#pageRange;
        const pages = this.#pages;

        const atStart = (page <= 1);
        const atEnd = (page >= pages);

        /*
         * Page numbers can only be truncated when there are more pages than
         * fit in the window around the current page. Base this on the total
         * number of pages so the first/last controls don't come and go
         * while navigating.
         */
        const truncatable = (pages > 2 * pageRange + 1);
        const start = (truncatable ? Math.max(page - pageRange, 1) : 1);
        const end = (truncatable ? Math.min(page + pageRange, pages) : pages);

        const pageEls: HTMLElement[] = [];

        if (start > 1) {
            pageEls.push(this.#paintEllipsis());
        }

        for (let pageNum = start; pageNum <= end; pageNum++) {
            pageEls.push(this.#paintPageItem(pageNum, pageNum === page));
        }

        if (end < pages) {
            pageEls.push(this.#paintEllipsis());
        }

        const firstEl = truncatable &&
            this.#paintNavItem('ink-i-chevrons-left', this.#firstPageText,
                               1, atStart);
        const prevEl = this.#paintNavItem('ink-i-chevron-left',
                                          this.#previousPageText,
                                          page - 1, atStart);
        const nextEl = this.#paintNavItem('ink-i-chevron-right',
                                          this.#nextPageText,
                                          page + 1, atEnd);
        const lastEl = truncatable &&
            this.#paintNavItem('ink-i-chevrons-right', this.#lastPageText,
                               pages, atEnd);

        /*
         * Re-rendering replaces every item, which would drop keyboard focus
         * to the document body and strand keyboard users mid-navigation.
         * Note what had focus so it can be restored afterward.
         */
        const focusLabel = this.#getFocusedItemLabel();

        renderInto(el, paint`
            ${firstEl}
            ${prevEl}
            <div class="ink-c-paginator__pages">${pageEls}</div>
            ${nextEl}
            ${lastEl}
        `, {
            empty: true,
        });

        if (focusLabel !== null) {
            this.#restoreFocus(focusLabel);
        }
    }

    /**
     * Restore keyboard focus to an item after a re-render.
     *
     * If the item is gone or is now disabled, such as "Next page" after
     * landing on the last page, focus falls back to the current page. This
     * keeps focus within the paginator so navigation can continue.
     *
     * Args:
     *     label (string):
     *         The ``aria-label`` of the item that had focus.
     */
    #restoreFocus(label: string) {
        const el = this.el;
        const itemEls = Array.from(
            el.querySelectorAll<HTMLButtonElement>('.ink-c-paginator__item'));

        let focusEl = itemEls.find(
            itemEl => itemEl.getAttribute('aria-label') === label);

        if (!focusEl || focusEl.disabled) {
            focusEl = el.querySelector<HTMLButtonElement>('.-is-current');
        }

        if (focusEl) {
            focusEl.focus();
        }
    }

    /**
     * Select a new page.
     *
     * This will re-render the paginator, invoke any ``onPageSelect``
     * handler, and trigger a ``pageSelected`` event.
     *
     * Args:
     *     page (number):
     *         The new 1-based page number.
     */
    #selectPage(page: number) {
        page = Math.min(Math.max(page, 1), this.#pages);

        if (page === this.#page) {
            return;
        }

        this.#page = page;
        this.#renderInterior();

        if (this.#onPageSelect) {
            this.#onPageSelect(page);
        }

        this.trigger('pageSelected', page);
    }
}
