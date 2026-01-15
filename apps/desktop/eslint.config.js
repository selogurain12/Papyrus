const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const importPlugin = require("eslint-plugin-import");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules", ".vite", "dist", "build", "out"],
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        // Electron globals
        MAIN_WINDOW_VITE_DEV_SERVER_URL: "readonly",
        MAIN_WINDOW_VITE_NAME: "readonly",
        // React types
        React: "readonly",
        JSX: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      "import": importPlugin,
    },
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",

      // General JavaScript/TypeScript rules
      "no-await-in-loop": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-imports": "error",
      "no-console": [
        "error",
        {
          allow: ["error"]
        }
      ],
      "no-empty": "error",
      "no-empty-function": "error",
      "no-inline-comments": "error",
      "no-nested-ternary": "error",
      "no-plusplus": [
        "error",
        {
          allowForLoopAfterthoughts: true
        }
      ],
      "no-redeclare": "error",
      "prefer-const": "error",
      "no-irregular-whitespace": "error",
      "camelcase": "error",
      "complexity": ["error", { max: 10 }],
      "eqeqeq": "error",
      "max-lines": ["error", 300],
      "quotes": ["error", "double"],
      "max-len": ["error", { code: 100, ignoreUrls: true }],

      // Import rules - no-unresolved turned off as TypeScript handles this
      "import/no-unresolved": "off",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
  },
  {
    files: ["**/*.{js,jsx}"],
    rules: {
      // JavaScript-specific rules
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // TypeScript-specific rules
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
    },
  },
];
