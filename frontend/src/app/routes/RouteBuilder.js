import React from "react";
import { Route } from "react-router-dom";

export function renderRoutes(nodes) {
  return nodes.map((node) => {
    if (!node) return null;

    if (node.route === "") {
      return <Route index element={node.component} key={node.key} />;
    }

    if (node.children && node.children.length) {
      const element = node.component ?? <React.Fragment />;
      return (
        <Route path={node.route} element={element} key={node.key}>
          {renderRoutes(node.children)}
        </Route>
      );
    }

    if (node.route) {
      return <Route path={node.route} element={node.component} key={node.key} />;
    }

    return null;
  });
}
