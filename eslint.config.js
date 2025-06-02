import js from '@eslint/js'
import globals from 'globals'
import pluginReact from 'eslint-plugin-react'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },
  {
    files: ['**/*.{jsx}'],
    ...pluginReact.configs.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
