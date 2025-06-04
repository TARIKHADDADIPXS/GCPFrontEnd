module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "style", "refactor", "test", "chore", "customtype"]
    ],
    "subject-case": [2, "never", ["sentence-case"]]
  }
};