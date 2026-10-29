// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";

// const container = document.getElementById("app");
// createRoot(container).render(<App />);

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

async function prepare() {
  if (process.env.NODE_ENV === "development" && process.env.REACT_APP_USE_MSW === "true") {
    const { worker } = await import("mocks/browser");
    await worker.start({
      serviceWorker: { url: "/mockServiceWorker.js" }, // el que se generó en /public
      onUnhandledRequest: "bypass", // ignora requests no mockeadas
    });
  }
}

const container = document.getElementById("app");

prepare().then(() => {
  createRoot(container).render(<App />);
});
