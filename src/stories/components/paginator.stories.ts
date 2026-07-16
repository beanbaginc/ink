import {
    type PaginatorView,
    craft,
} from '../../ink/js';


export default {
    title: 'Ink/Components/Paginator',
    tags: ['autodocs'],
    render: options => {
        const paginator = craft<PaginatorView>`
            <Ink.Paginator ...${options}/>
        `;

        return paginator.el;
    },
    argTypes: {
        ariaLabel: {
            control: 'text',
            description:
                'A label describing the paginator for screen readers.',
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the paginator is disabled.',
        },
        firstPageText: {
            control: 'text',
            description: 'The label for the "first page" control.',
        },
        fullWidth: {
            control: 'boolean',
            description:
                'Whether to stretch the paginator to the width of its ' +
                'container, pinning the edge controls to the sides.',
        },
        lastPageText: {
            control: 'text',
            description: 'The label for the "last page" control.',
        },
        nextPageText: {
            control: 'text',
            description: 'The label for the "next page" control.',
        },
        page: {
            control: 'number',
            description: 'The current 1-based page number.',
        },
        pageRange: {
            control: 'number',
            description:
                'The number of page buttons shown on each side of the ' +
                'current page.',
        },
        pages: {
            control: 'number',
            description: 'The total number of pages.',
        },
        pageText: {
            control: 'text',
            description:
                'The label for a page number button, for screen readers. ' +
                'Any "{page}" will be replaced with the page number.',
        },
        previousPageText: {
            control: 'text',
            description: 'The label for the "previous page" control.',
        },
    },
    args: {
        page: 7,
        pages: 24,
    },
};


export const Standard = {};


export const FewPages = {
    args: {
        page: 2,
        pages: 5,
    },
};


export const FirstPage = {
    args: {
        page: 1,
    },
};


export const LastPage = {
    args: {
        page: 24,
    },
};


export const FullWidth = {
    args: {
        fullWidth: true,
    },
};


export const CustomSize = {
    args: {
        style: '--ink-c-paginator-font-size: var(--ink-u-font-s)',
    },
};


export const Disabled = {
    args: {
        disabled: true,
    },
};
