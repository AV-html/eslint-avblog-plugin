/**
 * @fileoverview layer-imports
 * @author Alexander Volkov
 */
"use strict";
const path = require('path');
const { isPathRelative } = require('../helpers');
const { stringify } = require('querystring');

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */

module.exports = {
  meta: {

    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "layer-imports",
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
    const layers = {
      'app': ['pages', 'modules', 'components', 'ui', 'core'],
      'pages': ['modules', 'components', 'ui', 'core'],
      'modules': ['modules', 'components', 'ui', 'core'],
      'components': ['components', 'ui', 'core'],
      'ui': ['ui', 'core'],
      'core': ['core']
    }

    const availableLayers = {
      'app': 'app',
      'pages': 'pages',
      'modules': 'modules',
      'components': 'components',
      'ui': 'ui',
      'core': 'core',
    }

    const alias = context.options[0]?.alias || '';

    const getCurrentFileLayer = () => {
      const currentFilename = context.filename;

      const normalizedPath = path.toNamespacedPath(currentFilename)
      const fromPath = normalizedPath?.split('src')[1];
      const segments = fromPath?.split(path.sep);

      return segments?.[1];
    }

    const getImportLayer = (value) => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath?.split('/');
      return segments?.[0];
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFileLayer = getCurrentFileLayer()
        const importLayer = getImportLayer(importPath)

        if (isPathRelative(importLayer)) {
          return
        }

        if (importPath.includes('-types') ||
          importPath.importPath('-configs') ||
          importPath.importPath('-config')
        ) {
          return
        }

        // Если импорты являются типов
        if (node.text === 'type') {
          return
        }

        // Если импорты являются библиотечными
        if (!availableLayers[importLayer] || !availableLayers[currentFileLayer]) {
          return
        }

        if (!layers[currentFileLayer]?.includes(importLayer)) {
          context.report(node, 'разрешено импортировать только из нижестоящих слоёв. ИСКЛ файлы из папок types, configs, config')
        }
      }
    };
  },
};
