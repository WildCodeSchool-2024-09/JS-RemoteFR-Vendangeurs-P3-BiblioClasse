import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Emprunt {
  date_emprunt: string;
  date_retour: string | null;
  date_retour_effectif: string | null;
  id_exemplaire: number;
  id_eleve: number;
}

class EmpruntRepository {
  async create(emprunt: Omit<Emprunt, "id_emprunt">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO emprunt (date_emprunt, date_retour, date_retour_effectif, id_exemplaire, id_eleve) VALUES (?, ?, ?, ?, ?)",
      [
        emprunt.date_emprunt,
        emprunt.date_retour,
        emprunt.date_retour_effectif,
        emprunt.id_exemplaire,
        emprunt.id_eleve,
      ],
    );
    return result.insertId;
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

  async countLoansByStatus(loanDuration: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT SUM(CASE WHEN date_retour_effectif IS NULL THEN 1 ELSE 0 END) AS inProgress, SUM(CASE WHEN date_retour_effectif IS NULL AND date_retour <= DATE_ADD(NOW(), INTERVAL ? DAY) THEN 1 ELSE 0 END) AS dueSoon, SUM(CASE WHEN date_retour_effectif IS NULL AND date_retour < NOW() THEN 1 ELSE 0 END) AS overdue FROM emprunt;",
      [loanDuration],
    );
    return rows[0];
  }

  async getEmpruntsByEleve(id_eleve: number) {
    const [rows] = await databaseClient.query(
      "SELECT e.id_exemplaire, l.titre, l.auteur, l.livre_resume, l.couverture_img, l.ISBN, e.date_retour FROM emprunt e JOIN exemplaire ex ON e.id_exemplaire = ex.id_exemplaire JOIN livre l ON ex.ISBN = l.ISBN WHERE e.id_eleve = ?",
      [id_eleve],
    );
    return rows;
  }
}

export default new EmpruntRepository();
