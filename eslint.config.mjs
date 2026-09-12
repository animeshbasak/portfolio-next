import reactHooks from 'eslint-plugin-react-hooks'
import tsParser from '@typescript-eslint/parser'

export default [
  { ignores: ['.next/**', '.next-dev/**', '.vercel/**', 'node_modules/**', 'docs/**', 'public/**', 'graphify-out/**'] },
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    plugins: {'react-hooks':reactHooks},
    linterOptions:{reportUnusedDisableDirectives:'off'},
    languageOptions: { parser: tsParser, ecmaVersion: 'latest', sourceType: 'module' },
    rules: {
      'constructor-super': 'error',
      'no-constant-binary-expression': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'no-self-assign': 'error',
      'no-unreachable': 'error',
      'valid-typeof': 'error',
    },
  },
]
