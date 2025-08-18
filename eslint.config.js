// eslint.config.js
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginNx from "@nx/eslint-plugin";
import eslintPluginImport from "eslint-plugin-import";

export default tseslint.config(
  {
    ignores: ["node_modules", "dist", "build", ".vite", "out", "eslint.config.{js,cjs,mjs}"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        projectService: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "@nx": eslintPluginNx,
      prettier: eslintPluginPrettier,
      import: eslintPluginImport,
    },
    rules: {
      ...tseslint.plugin.configs["recommended-type-checked"].rules,
      ...tseslint.plugin.configs["strict-type-checked"].rules,
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/restrict-template-expressions": "error",
      "@typescript-eslint/restrict-plus-operands": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/prefer-nullish-coalescing": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-redundant-type-constituents": "error",
      "@typescript-eslint/no-duplicate-type-constituents": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-imports": "error",
      "no-console": [
        "error",
        {
          allow: ["error", "warn"],
        },
      ],
      "no-empty": "error",
      "no-empty-function": "error",
      "no-inline-comments": "error",
      "no-nested-ternary": "error",
      "no-plusplus": [
        "error",
        {
          allowForLoopAfterthoughts: true,
        },
      ],
      "no-redeclare": "error",
      "no-unused-vars": "error",
      "prefer-const": "error",
      "no-irregular-whitespace": "error",
      "no-trailing-spaces": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "eol-last": "error",
      camelcase: "error",
      complexity: ["error", { max: 10 }],
      eqeqeq: "error",
      "max-lines": ["error", 300],
      "max-params": ["error", 4],
      "max-depth": ["error", 4],
      quotes: ["error", "double"],
      "max-len": ["error", { code: 100, ignoreUrls: true }],
      "import/no-unresolved": "off",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "import/no-duplicates": "error",
      "import/order": [
        "error",
        { groups: ["builtin", "external", "internal", "parent", "sibling"] },
      ],
      "prettier/prettier": "error",
    },
  }
);
