import {
    type BadgeView,
    craft,
} from '../../ink/js';


export default {
    title: 'Ink/Components/Badge',
    tags: ['autodocs'],
    render: ({
        label,
        link,
        ...options
    }) => {
        const badge = craft<BadgeView>`
            <Ink.Badge ...${options}>${label}</>
        `;

        if (link) {
            const linkEl = document.createElement('a');
            linkEl.href = '#';
            linkEl.append(badge.el);

            return linkEl;
        }

        return badge.el;
    },
    argTypes: {
        iconStart: {
            control: 'text',
            description: 'The icon class name to show before the label.',
        },
        iconEnd: {
            control: 'text',
            description: 'The icon class name to show after the label.',
        },
        label: {
            control: 'text',
            description: 'The label to show on the badge.',
        },
        link: {
            control: 'boolean',
            description: 'Whether to wrap the badge in a link.',
        },
        type: {
            control: 'radio',
            description: 'The type of badge.',
            options: [
                'standard',
                'info',
                'success',
                'warning',
                'error',
            ],
        },
    },
    args: {
        type: 'standard',
    },
};


export const Standard = {
    args: {
        label: 'Standard',
    },
};


export const Info = {
    args: {
        label: 'Info',
        type: 'info',
    },
};


export const Success = {
    args: {
        label: 'Success',
        type: 'success',
    },
};


export const Warning = {
    args: {
        label: 'Warning',
        type: 'warning',
    },
};


export const Error = {
    args: {
        label: 'Error',
        type: 'error',
    },
};


export const IconLabelStart = {
    args: {
        iconStart: 'ink-i-success',
        label: 'Success',
        type: 'success',
    },
};


export const IconLabelEnd = {
    args: {
        iconEnd: 'ink-i-external-link',
        label: 'Go elsewhere',
        type: 'warning',
    },
};


export const CustomColor = {
    args: {
        label: 'Custom',
        style:
            '--_ink-c-badge-bg: rebeccapurple; ' +
            '--_ink-c-badge-fg: white; ' +
            '--_ink-c-badge-border-color: rebeccapurple',
    },
};


export const Link = {
    args: {
        label: 'Linked',
        link: true,
        type: 'info',
    },
};
