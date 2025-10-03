/* Vite configuration used to compile assets for Storyboard. */
import path from 'path';
import resolve from 'resolve/sync';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


const srcPath = path.resolve(__dirname, 'src');
const tablerPath = path.dirname(
    resolve('@tabler/icons/icons.json', { basedir: __dirname }));


export default defineConfig({
    build: {
        target: 'esnext',
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    'ink-path': path.resolve(srcPath, 'ink'),
                    'tabler-path': tablerPath.replace('@', '\\@'),
                },
                paths: [
                    srcPath,
                ],
            },
        },
    },
    esbuild: {
        target: 'esnext',
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext',
        },
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
                    [
                        '@babel/plugin-proposal-decorators',
                        {
                            'version': 'legacy',
                        },
                    ],
                    'babel-plugin-dedent',
                    'babel-plugin-django-gettext',
                ],
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
    },
});
