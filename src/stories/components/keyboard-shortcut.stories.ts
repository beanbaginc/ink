import {
    KeyboardShortcutRegistry,
    KeyboardShortcutRegistryView,
    paint,
} from '../../ink/js';


export default {
    title: 'Ink/Components/KeyboardShortcut',
    tags: ['autodocs'],
    render: options => {
        let registryEl;

        if (options.onInvoke) {
            registryEl = document.createElement('div');
            registryEl.tabIndex = 0;

            const registry = new KeyboardShortcutRegistry();
            const registryView = new KeyboardShortcutRegistryView({
                el: registryEl,
                model: registry,
            });
            registryView.render();

            options.registry = registry;
        }

        const componentEl = paint`
            <Ink.KeyboardShortcut ...${options}/>
        `;

        if (registryEl) {
            registryEl.append(componentEl);

            return registryEl;
        }

        return componentEl;
    },
    argTypes: {
        keys: {
            description: 'The descriptive keyboard shortcut to show.',
            control: 'text',
        },
        onInvoke: {
            description: 'Click handler for the button.',
            control: 'action',
        },
        showSymbols: {
            description: 'Whether symbols can be shown.',
            control: 'boolean',
        },
    },
    args: {
        keys: 'Control-Alt-Meta-Shift-Up',
    },
};


export const Standard = {};


export const NoSymbols = {
    args: {
        showSymbols: false,
    },
};
