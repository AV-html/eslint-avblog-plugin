/**
 * @fileoverview public-api
 * @author Alexander Volkov
 */
"use strict";

const { isPathRelative } = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "public-api",
      category: "Fill me in",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string'
          }
        }
      }
    ], // Add a schema if the rule has options
  },

  create(context) {
    const alias = context.options[0]?.alias || '';

    const checkingLayers = {
      'pages': 'pages',
      'modules': 'modules',
      'components': 'components',
      'ui': 'ui',
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) {
          return;
        }

        const segments = importTo.split('/')
        const layer = segments[0]

        const isImportNotFromPublic = segments.length > 2

        if (!checkingLayers[layer]) {
          return
        }

        if (!importTo.includes('-component')) {
          return
        }

        if (isImportNotFromPublic) {
          context.report(node, 'абсолютный импорт компонент разрешён только из public-api (index.ts)')
        }
      }
    };
  },
};
