module.exports = function plugin(snowpackConfig, {}) {
  return {
    name: "hmr-decline",
    async transform({ contents }) {
      if (/createContext\(/.test(contents)) {
        return (contents += `\nimport.meta.hot?.decline()`)
      }
    },
  }
}
