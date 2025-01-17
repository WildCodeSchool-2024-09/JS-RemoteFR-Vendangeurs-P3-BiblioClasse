import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import BiblioClasse from "./pages/BiblioClasse";
import Ma_bibliotheque from "./pages/Ma_bibliotheque";
import Ma_classe from "./pages/Ma_classe";
import Mon_eleve from "./pages/Mon_eleve";
import Mon_livre from "./pages/Mon_livre";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <BiblioClasse /> },
      { path: "/bibliotheque", element: <Ma_bibliotheque /> },
      { path: "/classe", element: <Ma_classe /> },
      { path: "/eleve/:id", element: <Mon_eleve /> },
      { path: "/livre/:ISBN", element: <Mon_livre /> },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
