/**
 * @fileoverview public-api
 * @author Alexander Volkov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/public-api-imports"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: { ecmaVersion: 6, sourceType: 'module' }
});
ruleTester.run("public-api-imports", rule, {
  valid: [
    {
      code: "import { getUserName } from 'core/user/user-selectors'",
      errors: []
    },
    {
      code: "import { Registration } from './components/registration'",
      errors: [],
    },
    {
      code: "import { setError, setIsTimeUp } from '../../auth-slice'",
      errors: [],
    },
    {
      code: "import { SkeletonListNotifications } from '../../profile-notifications/skeleton-list-notifications'",
      errors: [],
    },
  ],

  invalid: [
    {
      code: "import { getUserName } from 'components/registration/registration-component'",
      errors: [{ message: "абсолютный импорт разрешён только из public-api (index.ts)" }],
    },
    {
      code: "import { ContainerComponent } from 'ui/container/container-component'",
      errors: [{ message: "абсолютный импорт разрешён только из public-api (index.ts)" }],
    },
    {
      code: "import { getUserName } from '@/components/registration/registration-component'",
      errors: [{ message: "абсолютный импорт разрешён только из public-api (index.ts)" }],
      options: [{ alias: '@' }]
    },
  ],
});
