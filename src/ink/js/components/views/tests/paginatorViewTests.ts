/**
 * Unit tests for PaginatorView.
 *
 * Version Added:
 *     0.10
 */

import { suite } from '@beanbag/jasmine-suites';
import 'jasmine';

import {
    type PaginatorView,
    craft,
} from '../../../index';


suite('components/views/PaginatorView', () => {
    function getPageLabels(paginator: PaginatorView): string[] {
        return Array.from(
            paginator.el.querySelectorAll(
                '.ink-c-paginator__pages > .ink-c-paginator__item'),
            el => el.textContent);
    }

    function getNavLabels(paginator: PaginatorView): string[] {
        return Array.from(
            paginator.el.querySelectorAll('.ink-c-paginator__item.-is-nav'),
            el => el.getAttribute('aria-label'));
    }

    function getPageAriaLabels(paginator: PaginatorView): string[] {
        return Array.from(
            paginator.el.querySelectorAll(
                '.ink-c-paginator__pages > .ink-c-paginator__item'),
            el => el.getAttribute('aria-label'));
    }

    describe('Render', () => {
        it('Default state', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=2 pages=5/>
            `;
            const el = paginator.el;

            expect(el.tagName).toBe('NAV');
            expect(el.getAttribute('aria-label')).toBe('Pagination');
            expect(getPageLabels(paginator)).toEqual(
                ['1', '2', '3', '4', '5']);
            expect(el.querySelectorAll('.ink-c-paginator__ellipsis').length)
                .toBe(0);
        });

        it('Without truncation', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=3 pages=5/>
            `;

            expect(getPageLabels(paginator)).toEqual(
                ['1', '2', '3', '4', '5']);
            expect(getNavLabels(paginator)).toEqual(
                ['Previous page', 'Next page']);
            expect(paginator.el
                   .querySelectorAll('.ink-c-paginator__ellipsis').length)
                .toBe(0);
        });

        it('With truncation', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=7 pages=24/>
            `;

            expect(getPageLabels(paginator)).toEqual(
                ['5', '6', '7', '8', '9']);
            expect(getNavLabels(paginator)).toEqual([
                'First page',
                'Previous page',
                'Next page',
                'Last page',
            ]);
            expect(paginator.el
                   .querySelectorAll('.ink-c-paginator__ellipsis').length)
                .toBe(2);
        });

        it('Current page', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=2 pages=3/>
            `;
            const currentEl = paginator.el.querySelector('.-is-current');

            expect(currentEl.textContent).toBe('2');
            expect(currentEl.getAttribute('aria-current')).toBe('page');
            expect(currentEl.hasAttribute('data-page')).toBeFalse();
        });

        it('On the first page', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=1 pages=24/>
            `;
            const el = paginator.el;

            const firstEl = el.querySelector<HTMLButtonElement>(
                '[aria-label="First page"]');
            const prevEl = el.querySelector<HTMLButtonElement>(
                '[aria-label="Previous page"]');
            const nextEl = el.querySelector<HTMLButtonElement>(
                '[aria-label="Next page"]');

            expect(firstEl.disabled).toBeTrue();
            expect(prevEl.disabled).toBeTrue();
            expect(nextEl.disabled).toBeFalse();
        });

        it('On the last page', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=24 pages=24/>
            `;
            const el = paginator.el;

            const prevEl = el.querySelector<HTMLButtonElement>(
                '[aria-label="Previous page"]');
            const nextEl = el.querySelector<HTMLButtonElement>(
                '[aria-label="Next page"]');
            const lastEl = el.querySelector<HTMLButtonElement>(
                '[aria-label="Last page"]');

            expect(prevEl.disabled).toBeFalse();
            expect(nextEl.disabled).toBeTrue();
            expect(lastEl.disabled).toBeTrue();
        });

        it('Navigation control tooltips', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=7 pages=24/>
            `;

            const titles = Array.from(
                paginator.el.querySelectorAll(
                    '.ink-c-paginator__item.-is-nav'),
                el => el.getAttribute('title'));

            expect(titles).toEqual([
                'First page',
                'Previous page',
                'Next page',
                'Last page',
            ]);
        });

        it('With custom navigation control labels', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator firstPageText="Première page"
                               lastPageText="Dernière page"
                               nextPageText="Page suivante"
                               previousPageText="Page précédente"
                               page=7
                               pages=24/>
            `;

            expect(getNavLabels(paginator)).toEqual([
                'Première page',
                'Page précédente',
                'Page suivante',
                'Dernière page',
            ]);

            const nextEl = paginator.el.querySelector(
                '[aria-label="Page suivante"]');

            expect(nextEl.getAttribute('title')).toBe('Page suivante');
        });

        it('With default page labels', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=2 pages=3/>
            `;

            expect(getPageAriaLabels(paginator)).toEqual(
                ['Page 1', 'Page 2', 'Page 3']);
        });

        it('With custom pageText', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator pageText="Seite {page}" page=2 pages=3/>
            `;

            expect(getPageAriaLabels(paginator)).toEqual(
                ['Seite 1', 'Seite 2', 'Seite 3']);
            expect(getPageLabels(paginator)).toEqual(['1', '2', '3']);
        });

        it('With ariaLabel', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator ariaLabel="Results pages" pages=5/>
            `;

            expect(paginator.el.getAttribute('aria-label'))
                .toBe('Results pages');
        });

        it('With disabled', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator disabled pages=5/>
            `;
            const el = paginator.el;

            expect(el.classList.contains('-is-disabled')).toBeTrue();
            expect(el.getAttribute('aria-disabled')).toBe('true');
            expect(el.hasAttribute('inert')).toBeTrue();
        });

        it('With fullWidth', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator fullWidth pages=5/>
            `;

            expect(paginator.el.classList.contains('-is-full-width'))
                .toBeTrue();
        });

        it('With pageRange', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=7 pageRange=1 pages=24/>
            `;

            expect(getPageLabels(paginator)).toEqual(['6', '7', '8']);
        });

        it('With pageRange of 0', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=7 pageRange=0 pages=24/>
            `;

            expect(getPageLabels(paginator)).toEqual(['7']);
            expect(paginator.el
                   .querySelectorAll('.ink-c-paginator__ellipsis').length)
                .toBe(2);
        });

        it('At the truncation boundary', () => {
            /*
             * With the default pageRange of 2, 5 pages fit exactly and 6
             * are one too many. This is where truncation kicks in.
             */
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=1 pages=6/>
            `;

            expect(getPageLabels(paginator)).toEqual(['1', '2', '3']);
            expect(getNavLabels(paginator)).toEqual([
                'First page',
                'Previous page',
                'Next page',
                'Last page',
            ]);
            expect(paginator.el
                   .querySelectorAll('.ink-c-paginator__ellipsis').length)
                .toBe(1);
        });
    });

    describe('Properties', () => {
        describe('page', () => {
            it('Set', () => {
                const paginator = craft<PaginatorView>`
                    <Ink.Paginator page=7 pages=24/>
                `;

                paginator.page = 10;

                expect(paginator.page).toBe(10);
                expect(getPageLabels(paginator)).toEqual(
                    ['8', '9', '10', '11', '12']);
            });

            it('Set past the last page', () => {
                const paginator = craft<PaginatorView>`
                    <Ink.Paginator page=7 pages=24/>
                `;

                paginator.page = 100;

                expect(paginator.page).toBe(24);
            });

            it('Set below the first page', () => {
                const paginator = craft<PaginatorView>`
                    <Ink.Paginator page=7 pages=24/>
                `;

                paginator.page = 0;

                expect(paginator.page).toBe(1);
            });
        });

        describe('pages', () => {
            it('Set', () => {
                const paginator = craft<PaginatorView>`
                    <Ink.Paginator page=3 pages=5/>
                `;

                paginator.pages = 24;

                expect(paginator.pages).toBe(24);
                expect(getNavLabels(paginator)).toEqual([
                    'First page',
                    'Previous page',
                    'Next page',
                    'Last page',
                ]);
            });

            it('Set below the current page', () => {
                const onPageSelect = jasmine.createSpy('onPageSelect');
                const paginator = craft<PaginatorView>`
                    <Ink.Paginator onPageSelect=${onPageSelect}
                                   page=7
                                   pages=24/>
                `;

                paginator.pages = 5;

                expect(onPageSelect).not.toHaveBeenCalled();
                expect(paginator.pages).toBe(5);
                expect(paginator.page).toBe(5);
            });
        });

        describe('disabled', () => {
            it('Set', () => {
                const paginator = craft<PaginatorView>`
                    <Ink.Paginator pages=5/>
                `;
                const el = paginator.el;

                paginator.disabled = true;

                expect(paginator.disabled).toBeTrue();
                expect(el.classList.contains('-is-disabled')).toBeTrue();
                expect(el.getAttribute('aria-disabled')).toBe('true');
                expect(el.hasAttribute('inert')).toBeTrue();

                paginator.disabled = false;

                expect(paginator.disabled).toBeFalse();
                expect(el.classList.contains('-is-disabled')).toBeFalse();
                expect(el.hasAttribute('aria-disabled')).toBeFalse();
                expect(el.hasAttribute('inert')).toBeFalse();
            });
        });
    });

    describe('Page selection', () => {
        it('Clicking a page number', () => {
            const onPageSelect = jasmine.createSpy('onPageSelect');
            const paginator = craft<PaginatorView>`
                <Ink.Paginator onPageSelect=${onPageSelect}
                               page=7
                               pages=24/>
            `;
            const eventSpy = jasmine.createSpy('pageSelected');
            paginator.on('pageSelected', eventSpy);

            paginator.el.querySelector<HTMLButtonElement>(
                '[data-page="9"]').click();

            expect(paginator.page).toBe(9);
            expect(onPageSelect).toHaveBeenCalledWith(9);
            expect(eventSpy).toHaveBeenCalledWith(9);
        });

        it('Clicking the navigation controls', () => {
            const paginator = craft<PaginatorView>`
                <Ink.Paginator page=7 pages=24/>
            `;
            const el = paginator.el;

            el.querySelector<HTMLButtonElement>(
                '[aria-label="Next page"]').click();

            expect(paginator.page).toBe(8);

            el.querySelector<HTMLButtonElement>(
                '[aria-label="Previous page"]').click();

            expect(paginator.page).toBe(7);

            el.querySelector<HTMLButtonElement>(
                '[aria-label="Last page"]').click();

            expect(paginator.page).toBe(24);

            el.querySelector<HTMLButtonElement>(
                '[aria-label="First page"]').click();

            expect(paginator.page).toBe(1);
        });

        it('Clicking the current page', () => {
            const onPageSelect = jasmine.createSpy('onPageSelect');
            const paginator = craft<PaginatorView>`
                <Ink.Paginator onPageSelect=${onPageSelect}
                               page=7
                               pages=24/>
            `;

            paginator.el.querySelector<HTMLButtonElement>(
                '.-is-current').click();

            expect(paginator.page).toBe(7);
            expect(onPageSelect).not.toHaveBeenCalled();
        });

        it('Clicking a disabled navigation control', () => {
            const onPageSelect = jasmine.createSpy('onPageSelect');
            const paginator = craft<PaginatorView>`
                <Ink.Paginator onPageSelect=${onPageSelect}
                               page=1
                               pages=24/>
            `;

            paginator.el.querySelector<HTMLButtonElement>(
                '[aria-label="Previous page"]').click();

            expect(paginator.page).toBe(1);
            expect(onPageSelect).not.toHaveBeenCalled();
        });

        it('Setting page does not trigger events', () => {
            const onPageSelect = jasmine.createSpy('onPageSelect');
            const paginator = craft<PaginatorView>`
                <Ink.Paginator onPageSelect=${onPageSelect}
                               page=7
                               pages=24/>
            `;

            paginator.page = 10;

            expect(onPageSelect).not.toHaveBeenCalled();
        });
    });

    describe('Keyboard focus', () => {
        /*
         * Focus only moves for elements attached to the document, so these
         * tests need the paginator in the DOM.
         */
        let paginator: PaginatorView;

        function focusItem(label: string) {
            paginator.el.querySelector<HTMLButtonElement>(
                `[aria-label="${label}"]`).focus();
        }

        function getFocusedLabel(): string | null {
            const activeEl = document.activeElement;

            return activeEl ? activeEl.getAttribute('aria-label') : null;
        }

        beforeEach(() => {
            paginator = craft<PaginatorView>`
                <Ink.Paginator page=7 pages=24/>
            `;
            document.body.appendChild(paginator.el);
        });

        afterEach(() => {
            paginator.el.remove();
        });

        it('Stays on a navigation control across pages', () => {
            focusItem('Next page');
            expect(getFocusedLabel()).toBe('Next page');

            paginator.el.querySelector<HTMLButtonElement>(
                '[aria-label="Next page"]').click();

            expect(paginator.page).toBe(8);
            expect(getFocusedLabel()).toBe('Next page');
        });

        it('Follows a page number that becomes current', () => {
            focusItem('Page 9');

            paginator.el.querySelector<HTMLButtonElement>(
                '[data-page="9"]').click();

            expect(paginator.page).toBe(9);
            expect(getFocusedLabel()).toBe('Page 9');
        });

        it('Falls back to the current page when disabled', () => {
            focusItem('Last page');

            paginator.el.querySelector<HTMLButtonElement>(
                '[aria-label="Last page"]').click();

            expect(paginator.page).toBe(24);
            expect(getFocusedLabel()).toBe('Page 24');
        });

        it('Is not stolen on an unfocused re-render', () => {
            paginator.page = 10;

            expect(document.activeElement).toBe(document.body);
        });
    });
});
