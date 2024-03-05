/**
 * @fileoverview layer-imports
 * @author Alexander Volkov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/layer-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("layer-imports", rule, {
  valid: [
    {
      options: [{ alias: '@' }],
      filename: './/src/modules/profile',
      code: "import { IconProps } from '@/ui/icon/icon-types'",
      errors: [],
    },
    {
      filename: './/src/modules/profile',
      code: "import { IconProps } from 'ui/icon/icon-types'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: './/src/ui/input',
      code: "import { IconProps } from 'modules/profile/profile-types'",
      errors: [{ message: 'разрешено импортировать только из нижестоящих слоёв' }],
    },
    {
      filename: './/src/modules/profile',
      code: "import { IconProps } from 'app/app-router'",
      errors: [{ message: 'разрешено импортировать только из нижестоящих слоёв' }],
    },
    {
      options: [{ alias: '@' }],
      filename: './/src/modules/profile',
      code: "import { IconProps } from '@/app/app-router'",
      errors: [{ message: 'разрешено импортировать только из нижестоящих слоёв' }],
    },
    {
      options: [{ alias: '@' }],
      filename: './/src/components/form/form-item-upload-components.tsx',
      code: "import { Auth } from '@/modules/auth'",
      errors: [{ message: 'разрешено импортировать только из нижестоящих слоёв' }],
    },
    {
      filename: './/src/components/form/form-item-upload-components.tsx',
      code: "import { Auth } from 'modules/auth'",
      errors: [{ message: 'разрешено импортировать только из нижестоящих слоёв' }],
    },
  ],
});
