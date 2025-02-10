CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE parametre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  loanDuration INT,
  borrowLimit INT,
  user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE livre (
    ISBN VARCHAR(255) PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    couverture_img VARCHAR(255),
    livre_resume TEXT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE exemplaire (
    id_exemplaire INT PRIMARY KEY AUTO_INCREMENT,
    ISBN VARCHAR(255) NOT NULL,
    isAvailable BOOLEAN DEFAULT TRUE, 
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (ISBN) REFERENCES livre(ISBN) ON DELETE CASCADE
);

CREATE TABLE eleve (
    id_eleve INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);

CREATE TABLE emprunt (
    id_emprunt INT PRIMARY KEY AUTO_INCREMENT,
    date_emprunt TIMESTAMP NOT NULL,
    date_retour DATE,
    date_retour_effectif DATE,
    id_exemplaire INT NOT NULL,
    id_eleve INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE    ,
    FOREIGN KEY (id_exemplaire) REFERENCES exemplaire(id_exemplaire) ON DELETE CASCADE,
    FOREIGN KEY (id_eleve) REFERENCES eleve(id_eleve) ON DELETE CASCADE
);

