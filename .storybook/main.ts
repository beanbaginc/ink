import { StorybookConfig } from '@storybook/html-vite';


const config: StorybookConfig = {
    addons: [
        '@storybook/addon-a11y',
        '@storybook/addon-docs',
        '@storybook/addon-links',
        '@storybook/addon-themes',
    ],
    core: {
        disableTelemetry: true,
    },
    docs: {},
    framework: {
        name: '@storybook/html-vite',
        options: {},
    },
    stories: [
        '../src/stories/*/*.mdx',
        '../src/stories/**/*.mdx',
        '../src/stories/*/*.stories.@(js|jsx|mjs|ts|tsx)',
        '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
    ],
};

export default config;
