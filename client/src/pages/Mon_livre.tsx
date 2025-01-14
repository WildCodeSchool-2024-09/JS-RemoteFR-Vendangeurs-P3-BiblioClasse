// import "./BiblioClasse.css";

import Header from "../components/Header";

function Mon_livre() {
  return (
    <div>
      <Header />
      <div>
        <figure className="bookCover_container">
          <img src="/src/assets/images/QRCode.png" alt="QRCode" />
        </figure>
      </div>
    </div>
  );
}

export default Mon_livre;
