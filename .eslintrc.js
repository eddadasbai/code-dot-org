// This is the primary JavaScript linting rules for the entire
// project.  In a few places, some of these rules are extended
// or overridden for a particular subset of the project.  See
// other .eslintrc.js files for those rules.
module.exports = {
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },
  "rules": {
    "comma-dangle": "off",
    "curly": "error",
    "no-console": "off",
    "no-empty": "off",
    "no-undef": "error",
    "no-unused-vars": "off",
    "semi": "error"
  }
};
