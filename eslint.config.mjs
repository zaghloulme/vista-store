import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["components/**/*.tsx", "components/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "sanity",
              message: "Please use the CMSService abstraction in @/lib/cms instead of importing Sanity directly.",
            },
            {
              name: "payload",
              message: "Please use the CMSService abstraction in @/lib/cms instead of importing Payload directly.",
            },
          ],
          patterns: [
            {
              group: ["@sanity/*", "payload/*"],
              message: "Please use the CMSService abstraction in @/lib/cms instead of importing CMS libraries directly.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
