module.exports = {
  'extends': 'stylelint-config-sass-guidelines',
  'rules': {
    'selector-no-qualifying-type': [
      true,
      {'ignore': ['attribute', 'class']},
    ],
    'property-no-vendor-prefix': null,
    'value-no-vendor-prefix': null,
    'block-closing-brace-empty-line-before': 'never',
    'block-opening-brace-newline-after': 'always',
    'max-empty-lines': 1,
    'declaration-empty-line-before': 'never',
    'number-leading-zero': 'never',
    'max-nesting-depth': 2,
  },
};
