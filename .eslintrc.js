module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2017
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended",
    "plugin:import/errors"
  ],
  plugins: ["@typescript-eslint", "prettier", "promise", "import"],
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "new-cap": ["error", { newIsCap: false, capIsNew: false }]
  }
};
