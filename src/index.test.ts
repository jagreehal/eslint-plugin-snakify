import { RuleTester } from '@typescript-eslint/rule-tester';
import { afterAll, describe, it } from 'vitest';
import * as parser from '@typescript-eslint/parser';
import plugin from './index';

// Configure RuleTester to use Vitest
RuleTester.afterAll = afterAll;
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  }
});

describe('snakify', () => {
  it('validates with the rule tester', () => {
    ruleTester.run('snakify', plugin.rules['snakify'], {
      valid: [
        // Valid snake_case identifiers
        { code: 'const my_variable = 5;' },
        { code: 'function my_function() {}' },
        { code: 'const { my_prop } = obj;' },
        { code: 'class MyClass {}' }, // Class names are filtered by default

        // Whitelisted identifiers
        {
          code: 'const myVariable = 5;',
          options: [{ whitelist: ['myVariable'] }],
        },

        // Ignored property keys
        {
          code: 'const obj = { myProperty: 5 };',
          options: [{ ignoreProperties: true }],
        },

        // Ignored destructuring
        {
          code: 'const { myProp } = obj;',
          options: [{ ignoreDestructuring: true }],
        },
      ],
      invalid: [
        // Basic camelCase to snake_case conversion
        {
          code: 'const myVariable = 5;',
          output: 'const my_variable = 5;',
          errors: [{ messageId: 'notSnake' }],
        },

        // PascalCase to snake_case conversion
        {
          code: 'const MyVariable = 5;',
          output: 'const my_variable = 5;',
          errors: [{ messageId: 'notSnake' }],
        },

        // Complex camelCase to snake_case conversion
        {
          code: 'const myComplexVariableName = 5;',
          output: 'const my_complex_variable_name = 5;',
          errors: [{ messageId: 'notSnake' }],
        },

        // Property keys (when not ignored)
        {
          code: 'const obj = { myProperty: 5 };',
          output: 'const obj = { my_property: 5 };',
          errors: [{ messageId: 'notSnake' }],
        },

        // Destructuring (when not ignored)
        {
          code: 'const { myProp } = obj;',
          output: 'const { my_prop } = obj;',
          errors: [{ messageId: 'notSnake' }],
        },
      ],
    });
  });
});
