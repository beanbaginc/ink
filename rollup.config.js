import path from 'path';
import resolve from 'resolve/sync';

import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import rollupResolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import dts from 'rollup-plugin-dts';
import execute from 'rollup-plugin-shell';


const extensions = ['.ts'];

const globalsMap = {
    '@beanbag/spina': 'Spina',
    backbone: 'Backbone',
    'htm/mini': 'htm',
    underscore: '_',
};


const inkPath = path.resolve(__dirname, 'src', 'ink');
const tablerPath =
    path.dirname(
        resolve('@tabler/icons/icons.json',
                { basedir: __dirname })
        .replace('@', '\\@')
    );
const lessArgs = [
    '--source-map',
    '--include-path=src:node_modules',
    '--quiet',
    `--modify-var="ink-path=${inkPath}"`,
    `--modify-var="tabler-path=${tablerPath}"`,
].join(' ');
const cleanCSSArgs = [
    '-O2',
    '--source-map',
].join(' ');


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
                file: 'lib/ink.js',
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
                        replacement: path.resolve(inkPath, 'js'),
                    },
                ],
            }),
            babel({
                babelHelpers: 'external',
                extensions: extensions,
            }),
            rollupResolve({
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
        input: './_build/dts/index.d.ts',
        output: [
            {
                file: 'lib/index.d.ts',
                format: 'es',
            },
            {
                file: 'lib/index.d.mts',
                format: 'es',
            },
        ],
        plugins: [
            dts.default(),
            copy({
                targets: [
                    {
                        dest: 'lib/esm',
                        src: 'src/ink/js/index-all.js',
                    },
                    {
                        dest: 'lib',
                        src: [
                            'src/ink/less',
                            'src/ink/images',
                            'src/ink/ink.less',
                        ],
                    },
                ],
            }),

            /*
             * We'll piggy-back off this build, so we only run it once (for the
             * one output.
             *
             * We can't create a build target just for CSS, so this is our
             * best option right now.
             */
            execute({
                commands: [
                    `lessc ${lessArgs}` +
                    ' lib/less/index.less' +
                    ' lib/ink.css',

                    `cd lib && cleancss ${cleanCSSArgs}` +
                    ' --format beautify' +
                    ' -o ink.css' +
                    ' ink.css',

                    `cd lib && cleancss ${cleanCSSArgs}` +
                    ' -o ink.min.css' +
                    ' ink.css',

                    `lessc ${lessArgs}` +
                    ' lib/less/auto/index.less' +
                    ' lib/ink-auto.css',

                    `cd lib && cleancss ${cleanCSSArgs}` +
                    ' --format beautify' +
                    ' -o ink-auto.css' +
                    ' ink-auto.css',

                    `cd lib && cleancss ${cleanCSSArgs}` +
                    ' -o ink-auto.min.css' +
                    ' ink-auto.css',
                ],
                sync: true,
            }),
        ],
    },
];
