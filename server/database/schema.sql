CREATE TABLE livre (
    ISBN VARCHAR(255) PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(255) NOT NULL,
    couverture_img VARCHAR(255),
    livre_resume TEXT NOT NULL
);

CREATE TABLE exemplaire (
    id_exemplaire INT PRIMARY KEY AUTO_INCREMENT,
    ISBN VARCHAR(255) NOT NULL,
    FOREIGN KEY (ISBN) REFERENCES livre(ISBN) ON DELETE CASCADE
);

CREATE TABLE eleve (
    id_eleve INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL
);

CREATE TABLE emprunt (
    id_emprunt INT PRIMARY KEY AUTO_INCREMENT,
    date_emprunt TIMESTAMP NOT NULL,
    date_retour DATE,
    date_retour_effectif DATE,
    id_exemplaire INT NOT NULL,
    id_eleve INT NOT NULL,    
    FOREIGN KEY (id_exemplaire) REFERENCES exemplaire(id_exemplaire) ON DELETE CASCADE,
    FOREIGN KEY (id_eleve) REFERENCES eleve(id_eleve) ON DELETE CASCADE
);