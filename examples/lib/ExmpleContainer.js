import React from "../../web_modules/react.js";
export const ExampleContainer = ({
  columns = 1,
  ...props
}) => {
  return /* @__PURE__ */ React.createElement("div", {
    ...props,
    style: {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, fit-content(200px))`,
      gap: 100,
      alignContent: "center",
      justifyContent: "center",
      alignItems: "center",
      justifyItems: "center",
      contain: "strict",
      ...props.style
    }
  });
};
