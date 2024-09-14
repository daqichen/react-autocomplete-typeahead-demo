import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import TypeaheadExample from "./TypeaheadExample";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <TypeaheadExample />
  </StrictMode>
);
