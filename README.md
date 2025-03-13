# eslint-plugin-snakify

An ESLint plugin that enforces snake_case naming convention for variables and functions. This plugin helps maintain consistent naming conventions in your JavaScript/TypeScript codebase by automatically detecting and fixing camelCase or PascalCase identifiers to snake_case.

## Features

- 🔍 Detects variables and functions not following snake_case convention
- 🛠 Provides automatic fixes to convert identifiers to snake_case
- ⚙️ Highly configurable with options to:
  - Whitelist specific identifiers
  - Filter specific AST node types
  - Ignore object properties
  - Ignore destructured variables
  - Use custom conversion functions

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```bash
# npm
npm install eslint --save-dev

# pnpm
pnpm add -D eslint

# bun
bun add -D eslint
```

Next, install `eslint-plugin-snakify`:

```bash
# npm
npm install eslint-plugin-snakify --save-dev

# pnpm
pnpm add -D eslint-plugin-snakify

# bun
bun add -D eslint-plugin-snakify
```

## Usage

Add `snakify` to the plugins section of your ESLint configuration. You can do this in either your `.eslintrc.json` file or in the ESLint configuration within your `package.json`.

### ESLint Flat Config (recommended for ESLint 9+)

```js
// eslint.config.js
import snakify from 'eslint-plugin-snakify';

export default [
  {
    plugins: {
      'snakify': snakify,
    },
    rules: {
      'snakify/snakify': ['error', {
        // options (all optional)
        whitelist: [], // identifiers to ignore
        filter: ['ClassDeclaration', 'NewExpression'], // AST node types to ignore
        ignoreProperties: false, // whether to ignore object property names
        ignoreDestructuring: false, // whether to ignore destructured variable names
      }],
    },
  },
];
```

### Traditional ESLint Config

```json
{
  "plugins": ["snakify"],
  "rules": {
    "snakify/snakify": ["error", {
      "whitelist": [],
      "filter": ["ClassDeclaration", "NewExpression"],
      "ignoreProperties": false,
      "ignoreDestructuring": false
    }]
  }
}
```

## Rule Options

The rule accepts an options object with the following properties:

- `whitelist`: Array of identifiers to ignore (default: `[]`)
- `filter`: Array of AST node types to ignore (default: `["ClassDeclaration", "NewExpression"]`)
- `ignoreProperties`: Whether to ignore object property keys (default: `false`)
- `ignoreDestructuring`: Whether to ignore destructured identifiers (default: `false`)
- `customConverter`: Custom function to convert identifiers to snake_case (optional)

## Examples

### Valid Code Examples

```js
// Valid snake_case
const my_variable = 5;
function my_function() {}

// Class names are ignored by default
class MyClass {}

// With ignoreProperties: true
const obj = { myProperty: 5 };

// With ignoreDestructuring: true
const { myProp } = obj;

// With whitelist: ["mySpecialCase"]
const mySpecialCase = 5;
```

### Invalid Code Examples

```js
// ❌ Invalid
const myVariable = 5;
// ✅ Valid after fix
const my_variable = 5;

// ❌ Invalid
const MyVariable = 5;
// ✅ Valid after fix
const my_variable = 5;

// ❌ Invalid
const myComplexVariableName = 5;
// ✅ Valid after fix
const my_complex_variable_name = 5;
```

## Using with TypeScript

This plugin works seamlessly with TypeScript. Just make sure you have `@typescript-eslint/parser` configured:

```js
// eslint.config.js
import snakify from 'eslint-plugin-snakify';
import typescript from '@typescript-eslint/parser';

export default [
  {
    languageOptions: {
      parser: typescript,
    },
    plugins: {
      'snakify': snakify,
    },
    rules: {
      'snakify/snakify': 'error',
    },
  },
];
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build the plugin
pnpm build

# Lint the code
pnpm lint
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
