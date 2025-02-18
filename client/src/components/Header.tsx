import { useLocation } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const location = useLocation();

  /*Permet de déterminer le titre de la page en fonction de l'URL :-)*/
  const getTitle = () => {
    const path = location.pathname;

    if (path.includes("/eleve/")) {
      return "Mon élève";
    }
    if (path.includes("livre/")) {
      return "Mon livre";
    }

    switch (path) {
      case "/bibliotheque":
        return "Ma bibliothèque";
      case "/classe":
        return "Ma classe";
      default:
        return "BiblioClasse";
    }
  };

  return (
    <header className="Header">
      <p>{getTitle()}</p>
    </header>
  );
}

export default Header;
