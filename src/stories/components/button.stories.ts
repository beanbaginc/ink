import {
    KeyboardShortcutRegistry,
    KeyboardShortcutRegistryView,
    paint,
} from '../../ink/js';


export default {
    title: 'Ink/Components/Button',
    tags: ['autodocs'],
    render: ({
        label,
        ...options
    }) => {
        let registryEl;

        if (options.keyboardShortcut) {
            registryEl = document.createElement('div');
            registryEl.tabIndex = 0;

            const registry = new KeyboardShortcutRegistry();
            const registryView = new KeyboardShortcutRegistryView({
                el: registryEl,
                model: registry,
            });
            registryView.render();

            options.keyboardShortcutRegistry = registry;
        }

        const buttonEl = paint`<Ink.Button ...${options}>${label}</>`;

        if (registryEl) {
            registryEl.append(buttonEl);

            return registryEl;
        }

        return buttonEl;
    },
    argTypes: {
        busy: {
            description:
                'Whether the button represents an operation taking place.',
            control: 'boolean',
        },
        disabled: {
            description: 'Whether the button is disabled.',
            control: 'boolean',
        },
        iconName: {
            description: 'The icon class name to show.',
            control: 'text',
        },
        label: {
            description: 'The label to show on the button.',
            control: 'text',
        },
        onClick: {
            description: 'Click handler for the button.',
            control: 'action',
        },
        keyboardShortcut: {
            description: 'Keyboard shortcuts used to activate the button.',
            control: 'text',
        },
        tagName: {
            description: 'The name used for the tag.',
            control: 'radio',
            options: [
                'button',
                'a',
            ],
        },
        showKeyboardShortcut: {
            description: 'Whether to show the keyboard shortcut on the button.',
            control: 'boolean',
        },
        type: {
            description: 'The type of button.',
            control: 'radio',
            options: [
                'standard',
                'primary',
                'submit',
                'danger',
                'reset',
            ],
        },
    },
    args: {
        type: 'standard',
        tagName: 'button',
    },
};


export const Standard = {
    args: {
        label: 'Button',
    },
};


export const Primary = {
    args: {
        label: 'Primary Button',
        type: 'primary',
    },
};


export const Danger = {
    args: {
        label: 'Danger Button',
        type: 'danger',
    },
};


export const Busy = {
    args: {
        label: 'Busy Button',
        busy: true,
    },
};


export const BusyPrimary = {
    args: {
        label: 'Busy Primary Button',
        busy: true,
        type: 'primary',
    },
};


export const BusyDanger = {
    args: {
        label: 'Busy Danger Button',
        busy: true,
        type: 'danger',
    },
};


export const Disabled = {
    args: {
        label: 'Disabled Button',
        disabled: true,
    },
};


export const DisabledPrimary = {
    args: {
        label: 'Disabled Primary Button',
        disabled: true,
        type: 'primary',
    },
};


export const DisabledDanger = {
    args: {
        label: 'Disabled Danger Button',
        disabled: true,
        type: 'danger',
    },
};


export const IconLabel = {
    args: {
        label: 'Button',
        iconName: 'ink-i-success',
    },
};


export const IconOnly = {
    args: {
        iconName: 'ink-i-success',
    },
};


export const ShowKeyboardShortcut = {
    args: {
        label: 'Button',
        keyboardShortcut: 'Cmd-Enter',
        showKeyboardShortcut: true,
    },
};
