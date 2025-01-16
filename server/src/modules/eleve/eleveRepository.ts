import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Eleve = {
  id_eleve: string;
  nom: string;
  prenom: string;
};

class eleveRepository {
  async create(eleve: Eleve) {
    const [result] = await databaseClient.query(
      "INSERT INTO eleve (id_eleve, nom, prenom) VALUES (?, ?, ?)",
      [eleve.id_eleve, eleve.nom, eleve.prenom],
    );
  }

  async read(id_eleve: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM eleve WHERE id_eleve = ?",
      [id_eleve],
    );

    return rows[0] as Eleve;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM eleve");
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
}

export default new eleveRepository();
