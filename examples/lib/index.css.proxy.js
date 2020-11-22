// [snowpack] add styles to the page (skip if no document exists)
if (typeof document !== 'undefined') {
  const code = "html,\nbody,\n#root {\n  height: 100%;\n}\n\nbody {\n  margin: 0;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", \"Roboto\", \"Oxygen\",\n    \"Ubuntu\", \"Cantarell\", \"Fira Sans\", \"Droid Sans\", \"Helvetica Neue\",\n    sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n\n  color: white;\n  background-color: #151515;\n}\n\ncode {\n  font-family: source-code-pro, Menlo, Monaco, Consolas, \"Courier New\",\n    monospace;\n}\n\n#root {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: 100%;\n}\n\n.sidemenu {\n  display: grid;\n  grid-auto-rows: 48px;\n  align-items: stretch;\n  background-color: #333333;\n}\n\n.sidemenu > a {\n  position: relative;\n  display: grid;\n  align-items: center;\n  padding-left: 16px;\n  color: white;\n  text-decoration: none;\n  outline: none;\n}\n\n.sidemenu > a.active {\n  background-color: hotpink;\n}\n\n.sidemenu > a.focus-visible::after,\n.sidemenu > a:hover::after {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(255, 255, 255, 0.2);\n}\n";

  const styleEl = document.createElement("style");
  const codeEl = document.createTextNode(code);
  styleEl.type = 'text/css';

  styleEl.appendChild(codeEl);
  document.head.appendChild(styleEl);
}