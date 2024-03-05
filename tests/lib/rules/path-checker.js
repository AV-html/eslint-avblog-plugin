/**
 * @fileoverview module relative path checker
 * @author Alexander Volkov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("path-checker", rule, {
  valid: [
    {
      filename: './/src/ui/icon/icon-component',
      code: "import { IconProps } from './icon-types'",
      errors: [],
    },
    {
      filename: './/src/modules/profile/profile-component',
      code: "import { IconProps } from 'ui/icon/icon-types'",
      errors: [],
    },
    {
      filename: './/src/modules/profile/profile-component',
      code: "import { IconProps } from '@/ui/icon/icon-types'",
      errors: [],
      options: [{ alias: '@' }]
    },
  ],

  invalid: [
    {
      filename: './/src/ui/icon/icon-component',
      code: "import { IconProps } from 'ui/icon/icon-types'",
      errors: [{ message: 'в пределах одного слоя все пути должны быть относительными' }],
    },
  ],
});
