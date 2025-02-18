import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

interface Emprunt {
  date_emprunt: string;
  date_retour: string | null;
  date_retour_effectif: string | null;
  id_exemplaire: number;
  id_eleve: number;
  userId: number;
}

class EmpruntRepository {
  async create(userId: number, emprunt: Omit<Emprunt, "id_emprunt">) {
    const [result] = await databaseClient.query<Result>(
      `
    INSERT INTO emprunt (date_emprunt, date_retour, date_retour_effectif, id_exemplaire, id_eleve, user_id) 
    VALUES (?, ?, ?, ?, ?, ?)
  `,
      [
        emprunt.date_emprunt,
        emprunt.date_retour,
        emprunt.date_retour_effectif,
        emprunt.id_exemplaire,
        emprunt.id_eleve,
        userId,
      ],
    );
    return result.insertId;
  }

  async read(userId: number, id_emprunt: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM emprunt 
    WHERE user_id = ? AND id_emprunt = ?
  `,
      [userId, id_emprunt],
    );
    return rows[0] as Emprunt;
  }

  async readAll(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM emprunt 
    WHERE user_id = ?
  `,
      [userId],
    );
    return rows as Emprunt[];
  }

  async update(userId: number, id_emprunt: number, emprunt: Emprunt) {
    await databaseClient.query(
      `
    UPDATE emprunt 
    SET date_emprunt = ?, date_retour = ?, date_retour_effectif = ?, id_exemplaire = ?, id_eleve = ? 
    WHERE user_id = ? AND id_emprunt = ?
  `,
      [
        userId,
        emprunt.date_emprunt,
        emprunt.date_retour,
        emprunt.date_retour_effectif,
        emprunt.id_exemplaire,
        emprunt.id_eleve,
        id_emprunt,
      ],
    );
    return this.read(userId, id_emprunt);
  }

  async updateReturnDate(
    date_retour_effectif: string,
    userId: number,
    id_exemplaire: number,
    id_eleve: number,
  ) {
    const [rows] = await databaseClient.query<Rows>(
      `
    UPDATE emprunt 
    SET date_retour_effectif = ? 
    WHERE user_id = ? 
    AND id_exemplaire = ? 
    AND id_eleve = ? 
    AND date_retour_effectif IS NULL
  `,
      [date_retour_effectif, userId, id_exemplaire, id_eleve],
    );
    return rows;
  }

  async delete(userId: number, id_emprunt: number) {
    await databaseClient.query(
      `
    DELETE FROM emprunt 
    WHERE user_id = ? AND id_emprunt = ?
  `,
      [userId, id_emprunt],
    );
  }

  async countStudentsWithLoansInProgress(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT COUNT(DISTINCT id_eleve) AS nb_eleves_emprunt_en_cours 
    FROM emprunt 
    WHERE user_id = ? AND date_retour_effectif IS NULL
  `,
      [userId],
    );
    return rows[0].nb_eleves_emprunt_en_cours;
  }
  async countStudentsWithLoansDueSoon(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT COUNT(DISTINCT id_eleve) AS nb_eleves_a_rendre_dans_7_jours 
    FROM emprunt 
    WHERE user_id = ? 
    AND date_retour_effectif IS NULL 
    AND date_retour <= CURDATE() + INTERVAL 7 DAY
  `,
      [userId],
    );
    return rows[0].nb_eleves_a_rendre_dans_7_jours;
  }
  async countStudentsWithOverdueLoans(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT COUNT(DISTINCT id_eleve) AS nb_eleves_en_retard 
    FROM emprunt 
    WHERE user_id = ? 
    AND date_retour_effectif IS NULL 
    AND date_retour < CURDATE()
  `,
      [userId],
    );
    return rows[0].nb_eleves_en_retard;
  }

  async LoansInProgress(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT SUM(CASE WHEN date_retour_effectif IS NULL THEN 1 ELSE 0 END) AS inProgress 
    FROM emprunt 
    WHERE user_id = ?
  `,
      [userId],
    );
    return rows[0].inProgress;
  }

  async getEmpruntsByEleve(userId: number, id_eleve: number) {
    const [rows] = await databaseClient.query(
      `
    SELECT 
      e.id_exemplaire, 
      l.titre, 
      l.auteur, 
      l.livre_resume, 
      l.couverture_img, 
      l.ISBN13, 
      e.date_retour 
    FROM 
      emprunt e 
    JOIN 
      exemplaire ex ON e.id_exemplaire = ex.id_exemplaire 
    JOIN 
      livre l ON ex.ISBN13 = l.ISBN13 
    WHERE 
      e.user_id = ? 
      AND e.id_eleve = ? 
      AND e.date_retour_effectif IS NULL 
    ORDER BY 
      l.titre
  `,
      [userId, id_eleve],
    );
    return rows;
  }
}

export default new EmpruntRepository();
