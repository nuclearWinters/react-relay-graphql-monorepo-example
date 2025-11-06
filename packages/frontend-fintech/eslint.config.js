import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import relay from "eslint-plugin-relay";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        process: "readonly",
        ...globals.browser,
      },
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      relay,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...relay.configs.recommended.rules,
      // Custom rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off", // not needed in React 17+
      "relay/graphql-syntax": "error", // validate graphql tags
    },
    settings: {
      react: {
        version: "detect",
      },
      relay: {
        // Ensure this points to your Relay compiler output
        artifactDirectory: "./__generated__",
        schema: "./schema.graphql",
      },
    },
  },
];
