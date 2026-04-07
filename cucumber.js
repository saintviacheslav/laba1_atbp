module.exports = {
  default: [
    "--require features/steps/**/*.js",
    "--format progress",
    "--format allure-cucumberjs/reporter",
    "features/**/*.feature"
  ].join(" ")
};
