/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <AuthProvider>
      <App />
    </AuthProvider>
  ),
  root!
);
