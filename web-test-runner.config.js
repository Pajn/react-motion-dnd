// NODE_ENV=test - Needed by "@snowpack/web-test-runner-plugin"
process.env.NODE_ENV = "test"

/** @type {import("@web/test-runner").TestRunnerConfig } */
module.exports = {
  plugins: [require("@snowpack/web-test-runner-plugin")()],
}
