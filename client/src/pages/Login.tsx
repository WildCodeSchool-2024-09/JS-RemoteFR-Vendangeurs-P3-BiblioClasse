import Header from "../components/Header";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/accueil");
  };
  return (
    <div>
      <Header />
      <div className="login-container">
        <h1 className="welcome-text">Bienvenue !</h1>
        <p className="subtitle">Vous êtes déjà utilisateur ?</p>
        <form className="login-form">
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="input-field"
          />
          <button
            type="submit"
            className="login-button"
            onClick={handleLoginClick}
          >
            Se connecter
          </button>
        </form>
        <p className="forgot-password">Mot de passe oublié ?</p>
        <div className="divider" />
        <button
          type="button"
          className="create-account-button"
          onClick={() => navigate("/register")}
        >
          Créer un compte
        </button>
      </div>
    </div>
  );
}

export default Login;
