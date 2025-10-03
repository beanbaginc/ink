import beanbag from '@beanbag/eslint-plugin';
import {
    defineConfig,
    globalIgnores,
} from 'eslint/config';
import storybook from 'eslint-plugin-storybook';
import globals from 'globals';


export default defineConfig([
    globalIgnores([
        'src/@types/**/*',
    ]),
    beanbag.configs.recommended,
    ...storybook.configs['flat/recommended'],
    {
        languageOptions: {
            globals: {
                ...beanbag.globals.backbone,
                ...beanbag.globals.django,
                ...globals.browser,
                ...globals.jquery,
                Ink: 'writable',
            },
            sourceType: 'module',
        },
        plugins: {
            '@beanbag': beanbag,
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
]);
