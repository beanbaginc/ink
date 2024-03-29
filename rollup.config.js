import path from 'path';

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';


const extensions = ['.ts'];

const globalsMap = {
    backbone: 'Backbone',
    spina: 'Spina',
    underscore: '_',
};


export default [
    {
        external: [
            '@beanbag/spina',
            'babel-plugin-dedent',
            'babel-plugin-django-gettext',
            'backbone',
            'htm',
            'htm/mini',
            'underscore',
        ],
        input: './src/ink/js/index.ts',
        output: [
            {
                esModule: false,
                exports: 'named',
                file: `lib/ink.js`,
                format: 'umd',
                globals: globalsMap,
                name: 'Ink',
                sourcemap: true,
            },
            {
                dir: 'lib/esm',
                exports: 'named',
                format: 'esm',
                globals: globalsMap,
                sourcemap: true,
            },
            {
                dir: 'lib/cjs',
                exports: 'named',
                format: 'cjs',
                globals: globalsMap,
                sourcemap: true,
            },
        ],
        plugins: [
            alias({
                entries: [
                    {
                        find: '@beanbag/ink',
                        replacement: path.resolve(
                            __dirname, 'src', 'ink', 'js'),
                    },
                ],
            }),
            babel({
                babelHelpers: 'external',
                extensions: extensions,
            }),
            copy({
                targets: [
                    {
                        dest: 'lib/esm',
                        src: 'src/ink/js/index-all.js',
                    },
                ],
            }),
            resolve({
                extensions: extensions,
                modulePaths: [],
            }),
        ],

        /* Don't risk our components disappearing. */
        treeshake: false,
    },
    {
        input: './src/babel-preset/index.js',
        output: [
            {
                esModule: false,
                file: 'lib/babel-preset/index.js',
                format: 'cjs',
                sourcemap: true,
            },
        ],
        plugins: [
            babel({
                babelHelpers: 'external',
                extensions: extensions,
            }),
        ],
    },
    {
        input: './_build/_ts/index.d.ts',
        output: [
            {
                file: 'lib/index.d.ts',
                format: 'es',
            },
        ],
        plugins: [
            dts.default(),
        ],
    },
];
