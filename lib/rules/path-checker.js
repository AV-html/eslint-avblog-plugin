/**
 * @fileoverview module relative path checker
 * @author Alexander Volkov
 */
"use strict";
const path = require('path');
const { isPathRelative } = require('../helpers');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "module relative path checker",
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

    return {
      ImportDeclaration(node) {
        const value = node.source.value
        const importTo = alias ? value.replace(`${alias}/`, '') : value;
        const fromFilename = context.filename

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'в пределах одного слоя все пути должны быть относительными')
        }
      }
    };
  },
};

const layers = {
  'pages': 'pages',
  'modules': 'modules',
  'components': 'components',
  'ui': 'ui',
  'core': 'core',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false
  }
  const toArray = to?.split('/')
  const toLayer = toArray[0];
  const toSlice = toArray[1];
  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false
  }

  const fromNormalizedPath = path.toNamespacedPath(from);
  const fromPath = fromNormalizedPath?.split('src')[1];
  const fromArray = fromPath?.split(path.sep);

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false
  }

  return fromSlice === toSlice && toLayer === fromLayer
}
