module.exports = {
  env: { browser: true, es6: true, jest: true, node: true },
  extends: [
    "airbnb-base",
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:jest/recommended",
    "plugin:prettier/recommended",
    "prettier",
    "prettier/vue"
  ],
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: { impliedStrict: true, jsx: true },
    ecmaVersion: 10,
    sourceType: "module"
  },
  plugins: ["babel", "jest"],
  rules: {
    // Disallow `this` keywords outside of classes or class-like objects
    // Used via `eslint-plugin-babel` to be compatible with class property.
    "babel/no-invalid-this": "error",

    // Disallow underscores in variable names
    // Used via `eslint-plugin-babel` to be compatible with optional chaining.
    "babel/camelcase": "warn",

    // Capitalise first letter of comments
    // 'capitalized-comments': [
    // 	'error',
    // 	'always',
    // 	{
    // 		ignorePattern:
    // 			'catch|console|class|const|else|export|function|if|import|let|node|pragma|prettier|return|throw|try|var'
    // 	}
    // ],

    // Enforce that class methods utilize `this` — see https://eslint.org/docs/rules/class-methods-use-this
    "class-methods-use-this": "error",

    // Disallow == and !=
    eqeqeq: ["error", "always"],

    // Disallow `.js`
    "import/extensions": ["error", { js: "never" }],

    // Require imported files to be listed as `dependencies` in `package.json`
    "import/no-extraneous-dependencies": [
      "error",
      // ...except for modules used by docs or tests
      {
        devDependencies: [
          "**/*.test.js",
          "**/*.test.jsx",
          "**/*.spec.js",
          "**/*.spec.jsx",
          "**/__tests__/**/*.js",
          "**/__tests__/**/*.jsx",
          "styleguide.config.js",
          "config/**/*.js",
          "shared/testing/**/*.js"
        ]
      }
    ],

    // Forces top level test to use `test` and all tests nested within describe
    // to use `it`.
    "jest/consistent-test-it": ["error"],

    // Ensures that there is at least one expect call made in a test.
    "jest/expect-expect": [
      "error",
      {
        assertFunctionNames: ["expect"]
      }
    ],

    // Test description (first argument to `it` and `test`) should be lowercase
    "jest/lowercase-name": ["error", { ignore: ["describe"] }],

    // Prevents `beforeAll`, `beforeEach`, `afterAll` and `afterEach`
    "jest/no-hooks": "error",

    // Max. 50 lines per snapshot to keep them more manageable and reviewable.
    "jest/no-large-snapshots": ["warn"],

    // Avoid using a callback in asynchronous tests
    "jest/no-test-callback": "error",

    // Disallow explicitly returning from tests
    "jest/no-test-return-statement": "error",

    // Suggest using `jest.spyOn()`
    "jest/prefer-spy-on": "warn",

    // Suggest using `toStrictEqual()`
    "jest/prefer-strict-equal": "error",

    // Suggest using `toBeNull()`
    "jest/prefer-to-be-null": "error",

    // Suggest using `toBeUndefined()`
    "jest/prefer-to-be-undefined": "error",

    // Suggest using `toContain()`
    "jest/prefer-to-contain": "error",

    // Suggest using `toHaveLength()`
    "jest/prefer-to-have-length": "error",

    // Suggest using inline snapshots
    // 'jest/prefer-inline-snapshots': 'warn',

    // Require a message for `toThrow()`
    "jest/require-tothrow-message": "error",

    // Enforce valid `describe()` callback
    "jest/valid-describe": "error",

    // Enforce having return statement when testing with promises
    "jest/valid-expect-in-promise": "error",

    // Enforce valid expect() usage
    "jest/valid-expect": "error",

    // Leads to problems with ? :, removes indentation for switch/case
    // indent: ['error', 4],

    // Max. 1 class per file
    "max-classes-per-file": "error",

    // 'multiline-comment-style': ['warn', 'starred-block'],

    // Allow `console.log`
    "no-console": "off",

    // Disallow deleting variables
    "no-delete-var": "error",

    // Group imports per file
    "no-duplicate-imports": "error",

    // Writing an clear comment for empty functions is a good practice
    "no-empty-function": "error",

    "no-eq-null": "warn",

    "no-eval": "error",

    // Disallow extending of native objects
    "no-extend-native": "error",

    // Convert `!!example` to `Boolean(example)` and similar
    "no-implicit-coercion": [
      "error",
      { boolean: true, number: true, string: true }
    ],

    "no-implied-eval": "error",

    // Convert `if (a) {...} else { if (b) {...} }` into `if (a) {...} else if (b) {...}`
    "no-lonely-if": "error",

    // Avoid unnecessary/redundant blocks
    "no-lone-blocks": "error",

    // Avoid using hard-coded numbers, use constants instead
    "no-magic-numbers": [
      "warn",
      { enforceConst: true, ignore: [-1, 0, 1, 2, 4], ignoreArrayIndexes: true }
    ],

    // Disallow `var a = b = c = 1`
    "no-multi-assign": "error",

    // Disallow multiline strings (single or double quote with backslash at end of line)
    "no-multi-str": "error",

    // Disallow negated conditions in ternary expressions an with `if`/`else` (when `else` is explicitly present)
    "no-negated-condition": "warn",

    // Prefer `const a = {}` to `const a = new Object()`
    "no-new-object": "error",

    "no-prototype-builtins": "warn",

    // Disallow assignment in return statement
    "no-return-assign": "error",

    // Disallows unnecessary `return await`
    "no-return-await": "error",

    // Warn against `if (a === a)`
    "no-self-compare": "error",

    // Disallow Use of the Comma Operator
    "no-sequences": "error",

    // Don’t use `undefined` as a constant name
    "no-shadow-restricted-names": "error",

    // Avoid accidentally using "${hello}" or '${hello}' instead of `${hello}` (should be redundant with syntax highlighting)
    "no-template-curly-in-string": "error",

    // Change `let a = undefined` into `let a`
    "no-undef-init": "error",

    // Convert `a ? a : b` to `a || b` and similar
    "no-unneeded-ternary": "error",

    // Disallow unnecessary `.call()` and `.apply()`
    "no-useless-call": "error",

    // `'a' + 'b'` => `'ab'`
    "no-useless-concat": "error",

    // Convert `class A { constructor() {} }` into `class A {}`
    "no-useless-constructor": "error",

    // Avoid renaming of references in import/export statements and destructuring assignments to the same name
    "no-useless-rename": "error",

    // Remove `return` at the end of a function
    "no-useless-return": "error",

    // Use `let` or `const` instead of `var`
    "no-var": "error",

    // Disallow use of the void operator
    "no-void": "error",

    // Enable when we’re ready — (cleaned up current terms & CI/CD set up)
    // 'no-warning-comments': ["error", { "terms": ["todo", "fixme", "bug"], "location": "anywhere" }],

    // Enforce { example } instead of { example: example }
    // The 'babel/object-shorthand' rule is deprecated.
    "object-shorthand": ["error", "always"],

    /**
     * `var` variables are hoisted in global & function scope, so they should be
     * grouped and placed at the top of their scope so as to avoid confusion
     * @see https://eslint.org/docs/rules/one-var
     */
    "one-var": ["error", { separateRequires: true, var: "always" }],

    // Use fat arrow notation for callback functions
    "prefer-arrow-callback": "error",

    // Change `let` to `const`
    "prefer-const": "error",

    "prefer-destructuring": [
      "warn",
      { array: false, object: true },
      { enforceForRenamedProperties: false }
    ],

    // Change parseInt('111110111', 2) into 0b111110111 and similar for octal (0o) and hexadecimal (0x)
    "prefer-numeric-literals": "error",

    // Change Object.assign({}, { a: 'a' }, b) into { a: 'a', ...b }
    "prefer-object-spread": "error",

    // Require using Error objects as Promise rejection reasons
    "prefer-promise-reject-errors": "error",

    // Avoid using `arguments` in a function, instead use the spread syntax in its signature.
    "prefer-rest-params": "error",

    // Change `Math.max.apply(Math, args)` into `Math.max(...args)`
    "prefer-spread": "error",

    // Prefer template literal notation over string concatenation
    "prefer-template": "error",

    // Disallow `async` functions which have no `await` expression
    "require-await": "error",

    // Require JSDoc comment for functions
    "require-jsdoc": [
      "warn",
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: false,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
          FunctionExpression: false
        }
      }
    ],

    // Sort variables alphabetically
    // 'sort-vars': ['error', { ignoreCase: true }],

    // Sort keys alphabetically
    // 'sort-keys': ['warn', 'asc', { caseSensitive: false, natural: true }],

    // Enforce space at the start of a comment, but allow this:
    //---------
    /******
     *
     */
    "spaced-comment": [
      "error",
      "always",
      {
        line: {
          markers: ["/"],
          exceptions: ["-", "+", "/", "="]
        },
        block: {
          markers: ["!"],
          exceptions: ["*"],
          balanced: true
        }
      }
    ],

    strict: ["error", "global"],

    // Prefer `const a = Symbol('Description')` over `const a = Symbol()`
    "symbol-description": "error",

    "valid-jsdoc": [
      "off"
      // {
      // 	prefer: {
      // 		arg: 'param',
      // 		argument: 'param',
      // 		class: 'constructor',
      // 		prop: 'property',
      // 		return: 'returns',
      // 		virtual: 'abstract'
      // 	},
      // 	preferType: {
      // 		Boolean: 'boolean',
      // 		Number: 'number',
      // 		object: 'Object',
      // 		String: 'string'
      // 	},
      // 	requireReturn: false,
      // 	requireReturnType: false,
      // 	requireReturnDescription: false
      // }
    ],

    // Require `var`s to be at the top of their scope
    "vars-on-top": "error",

    // Change `if("b" === a)` into `if(a === "b")`
    yoda: "error"
  },
  settings: { "import/resolver": { "babel-module": {} } }
};
