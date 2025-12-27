import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  //  Ignore heavy / generated paths
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "out/**",
      ".vercel/**",
      "**/*.config.js",
      "**/*.config.mjs",
      "next.config.js",
    ],
  },

  //  Base Next + TS config
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  //  OVERRIDES — this is the important part
  {
    rules: {
      // Downgrade noisy rules
      "no-console": "off",

      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",

      "react-hooks/exhaustive-deps": "warn",

      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-sync-scripts": "off",
    },
  },
];
