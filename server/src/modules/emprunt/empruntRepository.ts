import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Emprunt = {
  id_emprunt?: number;
  date_emprunt: string;
  date_retour: string;
  date_retour_effectif: string;
  id_exemplaire: number;
  id_eleve: number;
};

class EmpruntRepository {
  async create(emprunt: Emprunt) {
    const [result] = await databaseClient.query(
      "INSERT INTO emprunt (date_emprunt, date_retour, date_retour_effectif, id_exemplaire, id_eleve) VALUES (?, ?, ?, ?, ?)",
      [
        emprunt.date_emprunt,
        emprunt.date_retour,
        emprunt.date_retour_effectif,
        emprunt.id_exemplaire,
        emprunt.id_eleve,
      ],
    );
  }

  async read(id_emprunt: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM emprunt WHERE id_emprunt = ?",
      [id_emprunt],
    );
    return rows[0] as Emprunt;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM emprunt");
    return rows as Emprunt[];
  }

  async update(id_emprunt: number, emprunt: Emprunt) {
    await databaseClient.query(
      "UPDATE emprunt SET date_emprunt = ?, date_retour = ?, date_retour_effectif = ?, id_exemplaire = ?, id_eleve = ? WHERE id_emprunt = ?",
      [
        emprunt.date_emprunt,
        emprunt.date_retour,
        emprunt.date_retour_effectif,
        emprunt.id_exemplaire,
        emprunt.id_eleve,
        id_emprunt,
      ],
    );
    return this.read(id_emprunt);
  }

  async delete(id_emprunt: number) {
    await databaseClient.query("DELETE FROM emprunt WHERE id_emprunt = ?", [
      id_emprunt,
    ]);
  }
}

export default new EmpruntRepository();
