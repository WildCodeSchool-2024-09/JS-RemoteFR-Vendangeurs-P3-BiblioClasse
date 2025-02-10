import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import BiblioClasse from "./pages/BiblioClasse";
// import Register from "./pages/Register";
import Login from "./pages/Login";
import Ma_bibliotheque from "./pages/Ma_bibliotheque";
import Ma_classe from "./pages/Ma_classe";
import Mon_eleve from "./pages/Mon_eleve";
import Mon_livre from "./pages/Mon_livre";
import Register from "./pages/Register";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: "/accueil", element: <BiblioClasse /> },
          { path: "/bibliotheque", element: <Ma_bibliotheque /> },
          { path: "/classe", element: <Ma_classe /> },
          { path: "/eleve/:id", element: <Mon_eleve /> },
          { path: "/livre/:ISBN", element: <Mon_livre /> },
        ],
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
