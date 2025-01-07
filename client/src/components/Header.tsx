import { useLocation } from "react-router-dom";
import "../styles/Header.css";

function Header() {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/bibliotheque":
        return "Ma bibliothèque";
      case "/classe":
        return "Ma classe";
      case "/eleve":
        return "Mon élève";
      case "/livre":
        return "Mon livre";
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
