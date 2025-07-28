/**
 * Babel plugin that compiles ``paint`` and ``craft`` tagged template literals.
 *
 * This Babel plugin will convert any painting or crafting template literals
 * into their compiled forms, reducing the runtime of the application. It's
 * recommended for any projects using Ink.
 *
 * Version Added:
 *     0.5
 */
export default function inkPreset(api, options={}) {
    api.cache(true);

    return {
        plugins: [
            [
                'htm',
                {
                    'import': {
                        'export': 'craftComponent',
                        'module': '@beanbag/ink',
                    },
                    'pragma': 'craftComponent',
                    'tag': 'craft',
                    'useBuiltins': true,
                    'useNativeSpread': true,
                },
                'ink-htm-craft',
            ],
            [
                'htm',
                {
                    'import': {
                        'export': 'paintComponent',
                        'module': '@beanbag/ink',
                    },
                    'pragma': 'paintComponent',
                    'tag': 'paint',
                    'useBuiltins': true,
                    'useNativeSpread': true,
                },
                'ink-htm-paint',
            ],
        ],
    };
}
