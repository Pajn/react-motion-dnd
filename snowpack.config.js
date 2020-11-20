/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: "/",
    src: "/src",
    examples: "/examples",
  },
  plugins: ["@snowpack/plugin-react-refresh", "@snowpack/plugin-typescript"],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    port: 3075,
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    "@examples": "./examples",
    "@lib": "./src",
  },
}
