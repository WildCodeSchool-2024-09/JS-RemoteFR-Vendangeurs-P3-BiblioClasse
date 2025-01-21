import Header from "../components/Header";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleAlreadyAccount = () => {
    navigate("/login");
  };

  return (
    <div>
      <Header />
      <div className="register-container">
        <h1 className="title">Créer un compte</h1>
        <form className="register-form">
          <input type="text" placeholder="Nom" className="input-field" />
          <input type="text" placeholder="Prénom" className="input-field" />
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="input-field"
          />
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            className="input-field"
          />
          <button type="submit" className="register-button">
            S'inscrire
          </button>
        </form>
        <p
          onClick={handleAlreadyAccount}
          onKeyDown={handleAlreadyAccount}
          className="already-account"
        >
          Vous avez déjà un compte ?
        </p>
      </div>
    </div>
  );
}

export default Register;
