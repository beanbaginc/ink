export default {
    title: 'Ink/Utilities/Deprecations',
    tags: ['autodocs'],
    render: ({
        html,
    }) => {
        const wrapperEl = document.createElement('div');
        wrapperEl.classList.add('ink-show-deprecations');
        wrapperEl.innerHTML = html;

        for (const childEl of wrapperEl.children) {
            childEl.classList.add('ink-deprecated');
        }

        return wrapperEl;
    },
    argTypes: {
        html: {
            description: 'HTML for an element to show as deprecated.',
            control: 'text',
        },
    },
    args: {
        html: '<button>Deprecated</button>',
    },
};


export const Standard = {};
