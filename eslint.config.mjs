// @ts-check

import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig(
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      prettierConfig,
    ],
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",

      "no-console": ["warn", { allow: ["error"] }],

      "@typescript-eslint/no-explicit-any": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/no-empty-object-type": "warn",

      "prefer-const": "error",
      "no-var": "error",
    },
    ignores: [
      "node_modules/**",
      "dist/**",
      ".angular/**",
      ".vscode/**",
      "scripts/stamp-version.js",
    ],
  },

  {
    files: ["projects/examples/**/*"],
    rules: {
      "no-console": "off",
    },
  },
);
