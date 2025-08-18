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
        project: ["./tsconfig.json", "./apps/*/tsconfig.json", "./packages/tsconfig.json"],
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
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-imports": "error",
      "no-console": [
        "error",
        {
          allow: ["error"],
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
      "prefer-const": "error",
      "no-irregular-whitespace": "error",
      camelcase: "error",
      complexity: ["error", { max: 10 }],
      eqeqeq: "error",
      "max-lines": ["error", 300],
      quotes: ["error", "double"],
      "max-len": ["error", { code: 100, ignoreUrls: true }],
      "import/no-unresolved": "off",
      "import/named": "error",
      "import/default": "error",
      "import/namespace": "error",
      "prettier/prettier": "error",
    },
  }
);
