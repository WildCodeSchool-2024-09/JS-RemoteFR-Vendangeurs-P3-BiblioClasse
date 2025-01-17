import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Exemplaire = {
  id_exemplaire?: number;
  ISBN: string;
  état: string;
};

class ExemplaireRepository {
  async create(exemplaire: Exemplaire) {
    const [result] = await databaseClient.query(
      "INSERT INTO exemplaire (ISBN, état) VALUES (?, ?)",
      [exemplaire.ISBN, exemplaire.état],
    );
  }

  async read(id_exemplaire: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM exemplaire WHERE id_exemplaire = ?",
      [id_exemplaire],
    );
    return rows[0] as Exemplaire;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM exemplaire");
    return rows as Exemplaire[];
  }

  async update(id_exemplaire: number, exemplaire: Exemplaire) {
    await databaseClient.query(
      "UPDATE exemplaire SET ISBN = ?, état = ? WHERE id_exemplaire = ?",
      [exemplaire.ISBN, exemplaire.état, id_exemplaire],
    );
    return this.read(id_exemplaire);
  }

  async delete(id_exemplaire: number) {
    await databaseClient.query(
      "DELETE FROM exemplaire WHERE id_exemplaire = ?",
      [id_exemplaire],
    );
  }
}

export default new ExemplaireRepository();
