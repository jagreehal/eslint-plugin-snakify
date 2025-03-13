/**
 * ESLint Plugin: snakify
 * ========================
 * Enforces snake_case naming convention for variables and functions.
 * Automatically fixes camelCase and PascalCase identifiers to snake_case.
 *
 * @author Jag Reehal [@jagreehal] <jag@jagreehal.com>
 * @license MIT
 */

import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';
import type { TSESLint, TSESTree } from '@typescript-eslint/utils';

/** Default list of identifiers to ignore */
const defaultWhitelist: readonly string[] = [];

/** Default list of AST node types to ignore */
const defaultFilter: readonly string[] = ['ClassDeclaration', 'NewExpression'];

/** Regular expression for validating snake_case format */
const SNAKE_CASE_REGEX = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)*$/;

/** Enhanced default converter from camelCase/PascalCase to snake_case */
function defaultCamelToSnake(str: string): string {
  return str
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replaceAll(/([A-Z])([A-Z][a-z])/g, '$1_$2')
    .toLowerCase();
}

/** Configuration options for the snakify rule */
export interface RuleOptions {
  /** List of identifiers to ignore */
  whitelist?: string[];
  /** List of AST node types to ignore */
  filter?: string[];
  /** Whether to ignore object property names */
  ignoreProperties?: boolean;
  /** Whether to ignore destructured variable names */
  ignoreDestructuring?: boolean;
  /** Custom function to convert identifiers to snake_case */
  customConverter?: (str: string) => string;
}

type MessageIds = 'notSnake';
type Options = [RuleOptions?];

const createRule = ESLintUtils.RuleCreator(
  () => 'https://github.com/jagreehal/eslint-plugin-snakify#readme'
);

export const rule = createRule<Options, MessageIds>({
  name: 'snakify',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce snake_case naming convention for identifiers',
    },
    fixable: 'code',
    schema: [{
      type: 'object',
      properties: {
        whitelist: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of identifiers to ignore',
        },
        filter: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of AST node types to ignore',
        },
        ignoreProperties: {
          type: 'boolean',
          description: 'Whether to ignore object property names',
        },
        ignoreDestructuring: {
          type: 'boolean',
          description: 'Whether to ignore destructured variable names',
        },
      },
      additionalProperties: false,
    }],
    messages: {
      notSnake: "Identifier '{{name}}' must use snake_case.",
    }
  },
  defaultOptions: [{}],

  create(context: TSESLint.RuleContext<MessageIds, Options>, [options = {}]) {
    const whitelist = new Set([...defaultWhitelist, ...(options.whitelist ?? [])]);
    const filter = new Set([...defaultFilter, ...(options.filter ?? [])]);
    const ignoreProperties = options.ignoreProperties ?? false;
    const ignoreDestructuring = options.ignoreDestructuring ?? false;
    const customConverter = typeof options.customConverter === 'function' ? options.customConverter : null;

    const camelToSnake = customConverter || defaultCamelToSnake;

    /**
     * Checks if an identifier should be ignored based on its context
     * @param node The identifier node to check
     * @returns Whether the identifier should be ignored
     */
    function shouldIgnoreIdentifier(node: TSESTree.Identifier): boolean {
      // Skip if identifier is whitelisted
      if (whitelist.has(node.name)) return true;

      // Skip if the parent node's type is in the filter list
      if (node.parent && filter.has(node.parent.type)) return true;

      // Skip if it's a property key and ignoreProperties is true
      if (
        ignoreProperties &&
        node.parent &&
        node.parent.type === AST_NODE_TYPES.Property &&
        node.parent.key === node &&
        !node.parent.computed
      ) {
        return true;
      }

      // Skip if it's a destructured identifier and ignoreDestructuring is true
      if (
        ignoreDestructuring &&
        node.parent &&
        node.parent.type === AST_NODE_TYPES.ObjectPattern
      ) {
        return true;
      }

      return false;
    }

    return {
      Identifier(node: TSESTree.Identifier) {
        const name = node.name;

        // Skip if the identifier should be ignored based on context
        if (shouldIgnoreIdentifier(node)) return;

        // Skip if the identifier already matches snake_case
        if (SNAKE_CASE_REGEX.test(name)) return;

        // Report error and provide an autofix
        context.report({
          node,
          messageId: 'notSnake',
          data: { name },
          fix(fixer: TSESLint.RuleFixer) {
            const newName = camelToSnake(name);
            return fixer.replaceText(node, newName);
          },
        });
      },
    };
  },
});

/** Plugin configuration */
const plugin = {
  rules: {
    'snakify': rule
  },
  meta: {
    name: 'eslint-plugin-snakify',
    version: '1.0.0'
  }
} as const;

export default plugin;
