/* Vite configuration used to compile assets for Storyboard. */
import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                paths: [
                    path.resolve(__dirname, 'src'),
                ],
                modifyVars: {
                    'ink-path': path.resolve(__dirname, 'src', 'ink'),
                    'tabler-path': path.resolve(__dirname, 'node_modules',
                                                '\\@tabler', 'icons'),
                },
            },
        },
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
        },
    },
    esbuild: {
        target: "esnext",
    },
    build: {
        target: "esnext",
    },
    plugins: [
        react({
            babel: {
                /*
                 * This is strictly a subset of the plugins we use when
                 * building Ink through `npm run build`. We only want the
                 * ones we need for certain transforms and executions
                 * within the context of a Storybook Preview page.
                 * Anything else could lead to breakages.
                 */
                plugins: [
                    '@babel/plugin-external-helpers',
                    ['@babel/plugin-proposal-decorators', {
                        'version': 'legacy'
                    }],
                    'babel-plugin-dedent',
                    'babel-plugin-django-gettext',
                ]
            },

            /*
             * Limit this to our own code, so we don't run Storybook
             * through it.
             */
            include: /src\/.*\.(js|jsx|ts|tsx)$/,
        }),
    ],
    ssr: {
        noExternal: [
            '@beanbag/spina',
        ],
    }
});
