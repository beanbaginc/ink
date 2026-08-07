import 'jquery';
import { Preview, HtmlRenderer } from '@storybook/html-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../src/ink/js/index';

import '../src/ink/ink.less';
import '../src/ink/less/auto/index.less';
import './theme.css';


window['IS_STORYBOOK'] = true;


const preview: Preview = {
    decorators: [
        Story => {
            const el = document.createElement('div');
            el.setAttribute('class', 'bg-white dark:bg-black');
            el.appendChild(Story() as Node);

            return el;
        },

        withThemeByDataAttribute<HtmlRenderer>({
            attributeName: 'data-ink-color-scheme',
            defaultTheme: 'light',
            themes: {
                dark: 'dark',
                'high-contrast': 'high-contrast',
                light: 'light',
                system: 'system',
            },
        }),
    ],
    parameters: {
        a11y: {
            config: {},
            context: 'body',
            options: {},
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;
