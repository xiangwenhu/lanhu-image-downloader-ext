// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      'no-console',
    ],
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
)
