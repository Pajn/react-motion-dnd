import __SNOWPACK_ENV__ from '../../__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import "../../web_modules/focus-visible.js";
import React, {Suspense, lazy} from "../../web_modules/react.js";
import ReactDOM from "../../web_modules/react-dom.js";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes
} from "../../web_modules/react-router-dom.js";
import "./index.css.proxy.js";
const ExampleSimple = lazy(() => import("../simple.js"));
const ExampleSortList = lazy(() => import("../sort-list.js"));
const ExampleTwoLists = lazy(() => import("../two-lists.js"));
const SidebarItem = (props) => {
  return /* @__PURE__ */ React.createElement(NavLink, {
    ...props,
    activeClassName: "active"
  });
};
ReactDOM.render(/* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(BrowserRouter, null, /* @__PURE__ */ React.createElement("div", {
  className: "sidemenu"
}, /* @__PURE__ */ React.createElement(SidebarItem, {
  to: "/simple"
}, "Simple"), /* @__PURE__ */ React.createElement(SidebarItem, {
  to: "/sort-list"
}, "Sort List"), /* @__PURE__ */ React.createElement(SidebarItem, {
  to: "/two-lists"
}, "Two Lists")), /* @__PURE__ */ React.createElement(Suspense, {
  fallback: null
}, /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, {
  path: "/simple"
}, /* @__PURE__ */ React.createElement(ExampleSimple, null)), /* @__PURE__ */ React.createElement(Route, {
  path: "/sort-list"
}, /* @__PURE__ */ React.createElement(ExampleSortList, null)), /* @__PURE__ */ React.createElement(Route, {
  path: "/two-lists"
}, /* @__PURE__ */ React.createElement(ExampleTwoLists, null)))))), document.getElementById("root"));
if (import.meta.hot) {
  import.meta.hot.accept();
}
