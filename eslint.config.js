// @ts-check
import antfu from '@antfu/eslint-config'
import nuxt from './.nuxt/eslint.config.mjs'

export default nuxt(
  antfu(
    {
      unocss: true,
      formatters: true,
      vue: {
        overrides: {
          'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            registeredComponentsOnly: false,
          }],
        },
      },
    },
  ),
)
