import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

const eslintIgnorePatterns = [
  '**/.git',
  '**/node_modules',
  '**/dist',
  '**/build',
  '**/coverage',
  '**/out',
  '**/package.json',
  '**/package-lock.json',
  '*.md',
];

const baseConfig = {
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      project: ['tsconfig.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    '@typescript-eslint': typescriptEslint,
    'import': importPlugin,
    'simple-import-sort': simpleImportSort,
    'unused-imports': unusedImports,
    'tsdoc': tsdocPlugin,
    'prettier': prettierPlugin,
    '@stylistic': stylistic,
  },
  rules: {
    // General TS best practices
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'warn',

    // Clean code
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'prefer-const': 'warn',
    'no-debugger': 'warn',

    // Prettier integration
    'prettier/prettier': 'warn',

    // Import sorting and organization
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          // Node.js builtins (fs, path)
          ['^node:'],
          ['^\\u0000'], // Side effect imports
          ['^@?\\w'], // External packages
          ['^(@|components|utils|lib|services)(/.*|$)'], // Internal aliases
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'], // Parent imports
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'], // Sibling & index
        ],
      },
    ],
    'simple-import-sort/exports': 'warn',

    // TSDoc
    'tsdoc/syntax': 'warn',

    // TypeScript best practices
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-inferrable-types': [
      'error',
      { ignoreParameters: false },
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: false },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { accessibility: 'explicit' },
    ],
    'eqeqeq': ['error', 'always', { null: 'ignore' }],
    'no-irregular-whitespace': 'error',
    '@stylistic/js/arrow-parens': ['error', 'always'],
    '@stylistic/js/linebreak-style': ['error', 'unix'],
    '@stylistic/js/new-parens': 'error',
    '@stylistic/ts/no-extra-semi': 'error',
    '@stylistic/ts/space-before-blocks': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
    'func-style': ['error', 'expression'],

    // Strict type checking
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: false },
    ],
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      { allowNumber: true, allowBoolean: false, allowNullish: false },
    ],
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
    '@typescript-eslint/prefer-readonly': 'warn',
    '@typescript-eslint/no-confusing-void-expression': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/consistent-type-assertions': [
      'error',
      { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
    ],

    // Code structure
    'complexity': ['warn', { max: 10 }],
    'max-lines': ['warn', 300],
    'max-lines-per-function': ['warn', 75],
    'max-depth': ['warn', 4],
    'max-nested-callbacks': ['warn', 3],

    // Code style
    '@stylistic/js/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/js/semi': ['error', 'always'],
    '@stylistic/js/comma-dangle': ['error', 'always-multiline'],
    '@stylistic/js/indent': ['error', 2, { SwitchCase: 1 }],
    '@stylistic/js/space-infix-ops': 'error',

    // Deprecated API usage
    '@typescript-eslint/no-deprecated': 'error',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'tsconfig.json',
      },
    },
  },
};

const testConfig = {
  files: ['**/__tests__/**/*.ts', '**/*.test.ts', '**/*.spec.ts'],
  rules: {
    'max-lines': ['warn', 500],
    'max-lines-per-function': ['warn', 250], // Integration tests need more room
  },
};

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.ts'],
    ...baseConfig,
  },
  testConfig,
  prettier,
  globalIgnores(eslintIgnorePatterns),
];
