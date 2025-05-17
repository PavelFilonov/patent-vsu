module.exports = {
    env: {
        browser: true,
        node: true,
        es2020: true
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    plugins: ['@typescript-eslint', 'react', 'prettier', 'react-hooks'],
    extends: [
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:react-hooks/recommended',
        'prettier',
        'prettier/@typescript-eslint',
        'prettier/react'
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-buffer-constructor': 0,
        'global-require': 0,
        'no-use-before-define': ['error', {functions: false}],
        'import/no-named-as-default': 0,
        'no-console': ['error', {allow: ['warn', 'error', 'info']}],
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/no-unused-vars': [1, {argsIgnorePattern: 'store|action'}],
        'import/no-extraneous-dependencies': [
            'error',
            {devDependencies: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.ts', '**/mockStore.ts', '**/tests/setup.ts', '*.config.js']}
        ],
        'react/require-default-props': ['error', {forbidDefaultForRequired: false, ignoreFunctionalComponents: true}],
        'no-param-reassign': ['error', {props: false}],
        'import/prefer-default-export': 0,
        'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
        'react/jsx-filename-extension': [1, {extensions: ['.ts', '.tsx']}],
        'import/extensions': 'off',
        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 0,
        'prettier/prettier': 'error',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'react/no-unescaped-entities': 'off',
        'jsx-a11y/accessible-emoji': 'off',
        'no-underscore-dangle': 'off'
    }
}
