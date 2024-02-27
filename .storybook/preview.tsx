import 'jquery';
import { Preview, HtmlRenderer } from '@storybook/html';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import '../src/ink/js/index';

import '../src/ink/ink.less';
import '../src/ink/less/auto/index.less';
import './theme.css';


window['IS_STORYBOOK'] = true;


/*
 * Babel won't transform our JavaScript within the context of Storybook, so
 * we're going to need to put together some stubs for some tagged template
 * literals we use.
 */
window['gettext'] = (str) => str;
window['ngettext'] = (singular, plural, count) => (count === 1
                                                   ? singular
                                                   : plural);
window['interpolate'] = (fmt, obj, named) => {
    if (named) {
        return fmt.replace(/%\(\w+\)s/g, m => String(obj[m.slice(2, -2)]));
    } else {
        return fmt.replace(/%s/g, match => String(obj.shift()));
    }
};


const preview: Preview = {
    decorators: [
        Story => {
            const el = document.createElement('div');
            el.setAttribute('class', 'bg-white dark:bg-black');
            el.appendChild(Story());

            return el;
        },

        withThemeByDataAttribute<HtmlRenderer>({
            themes: {
                light: 'light',
                dark: 'dark',
            },
            defaultTheme: 'light',
            attributeName: 'data-theme',
        }),
    ],
    parameters: {
        actions: {
            argTypesRegex: '^on[A-Z].*',
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
