module.exports = {
  extends: ["standard", "next", "prettier"],
  overrides: [
    {
      files: ["*.d.ts"],
      rules: {
        // Everything from *.ts rules above applies
        // but you can add or override individual rules here for *.d.ts files
        "no-unused-vars": "off"
      }
    },
  ]
};
