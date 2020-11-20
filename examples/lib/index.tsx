import "focus-visible"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import {
  BrowserRouter,
  NavLink,
  NavLinkProps,
  Route,
  Routes,
} from "react-router-dom"
import "./index.css"

const ExampleSimple = lazy(() => import("@examples/simple"))
const ExampleSortList = lazy(() => import("@examples/sort-list"))
const ExampleTwoLists = lazy(() => import("@examples/two-lists"))

const SidebarItem = (props: NavLinkProps) => {
  return <NavLink {...props} activeClassName="active" />
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="sidemenu">
        <SidebarItem to="/simple">Simple</SidebarItem>
        <SidebarItem to="/sort-list">Sort List</SidebarItem>
        <SidebarItem to="/two-lists">Two Lists</SidebarItem>
      </div>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/simple">
            <ExampleSimple />
          </Route>
          <Route path="/sort-list">
            <ExampleSortList />
          </Route>
          <Route path="/two-lists">
            <ExampleTwoLists />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root"),
)

if (import.meta.hot) {
  import.meta.hot.accept()
}
