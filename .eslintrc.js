module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: ["plugin:@typescript-eslint/recommended"],
    parserOptions: {
      project: "./tsconfig.json",
    },
    ignorePatterns: ["node_modules/", "dist/", ".eslintrc.js"], 
  };
  