import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Eleve = {
  nom: string;
  prenom: string;
};

class eleveRepository {
  async create(eleve: Omit<Eleve, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO eleve (nom, prenom) VALUES (?, ?)",
      [eleve.nom, eleve.prenom],
    );
    return result.insertId;
  }

  async read(id_eleve: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM eleve WHERE id_eleve = ?",
      [id_eleve],
    );

    return rows[0] as Eleve;
  }

  /*Student avec nbOfBooksBorrowed et date_retour*/
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT e.id_eleve, e.prenom, e.nom, MIN(em.date_retour) AS date_retour, COUNT(em.id_exemplaire) AS nbOfBooksBorrowed FROM eleve e LEFT JOIN emprunt em ON e.id_eleve = em.id_eleve GROUP BY e.id_eleve ORDER BY date_retour ASC;",
    );
    return rows as Eleve[];
  }

  async update(id_eleve: string, eleve: Eleve) {
    await databaseClient.query(
      "UPDATE eleve SET nom = ?, prenom = ? WHERE id_eleve = ?",
      [eleve.nom, eleve.prenom, id_eleve],
    );
  }

  async delete(id_eleve: string) {
    await databaseClient.query("DELETE FROM eleve WHERE id_eleve = ?", [
      id_eleve,
    ]);
  }

  async search(searchTerm: string) {
    const [rows] = await databaseClient.query(
      "SELECT * FROM eleve WHERE prenom LIKE ? OR nom LIKE ?",
      [`%${searchTerm}%`, `%${searchTerm}%`],
    );
    return rows as Eleve[];
  }
}

export default new eleveRepository();
