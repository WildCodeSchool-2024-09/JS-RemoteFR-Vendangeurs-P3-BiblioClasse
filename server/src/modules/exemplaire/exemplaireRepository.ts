import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Exemplaire = {
  id_exemplaire?: number;
  ISBN: string;
  isAvailable: boolean;
};

type borrowedExemplaireByISBN = {
  nom: string;
  prenom: string;
  date_retour: string;
  id_exemplaire: number;
  id_eleve: number;
};

class ExemplaireRepository {
  async create(userId: number, exemplaire: Exemplaire) {
    const [result] = await databaseClient.query<Result>(
      `
    INSERT INTO exemplaire (ISBN, isAvailable, user_id) 
    VALUES (?, ?, ?)
  `,
      [exemplaire.ISBN, exemplaire.isAvailable, userId],
    );
    return result.insertId;
  }

  async read(userId: number, id_exemplaire: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM exemplaire 
    WHERE user_id = ? AND id_exemplaire = ?
  `,
      [userId, id_exemplaire],
    );
    return rows[0] as Exemplaire;
  }

  async readAll(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM exemplaire 
    WHERE user_id = ?
  `,
      [userId],
    );
    return rows as Exemplaire[];
  }
  async readAllByISBN(
    userId: number,
    ISBN: string,
  ): Promise<Array<Exemplaire>> {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM exemplaire 
    WHERE user_id = ? AND ISBN = ?
  `,
      [userId, ISBN],
    );
    return rows as Exemplaire[];
  }

  async readAvailableExemplaire(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT 
      l.titre, 
      e.id_exemplaire 
    FROM 
      exemplaire AS e 
    JOIN 
      livre AS l 
    ON 
      e.ISBN = l.ISBN 
    WHERE 
      e.user_id = ? 
      AND e.isAvailable = true 
    ORDER BY 
      l.titre
  `,
      [userId],
    );
    return rows as Exemplaire[];
  }

  async readBorrowedExemplaireByISBN(
    userId: number,
    ISBN: string,
  ): Promise<Array<borrowedExemplaireByISBN>> {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT 
      el.nom, 
      el.prenom, 
      el.id_eleve, 
      em.date_retour, 
      ex.id_exemplaire 
    FROM 
      emprunt AS em 
    JOIN 
      eleve AS el 
    ON 
      em.id_eleve = el.id_eleve 
    JOIN 
      exemplaire AS ex 
    ON 
      em.id_exemplaire = ex.id_exemplaire 
    WHERE 
      em.user_id = ? 
      AND ex.ISBN = ? 
      AND ex.isAvailable = 0 
      AND em.date_retour_effectif IS NULL 
    ORDER BY 
      em.date_retour, 
      el.nom, 
      el.prenom
  `,
      [userId, ISBN],
    );
    return rows as borrowedExemplaireByISBN[];
  }

  async update(exemplaire: Exemplaire, userId: number, id_exemplaire: number) {
    await databaseClient.query(
      `
    UPDATE exemplaire 
    SET ISBN = ?, isAvailable = ? 
    WHERE user_id = ? AND id_exemplaire = ?
  `,
      [exemplaire.ISBN, exemplaire.isAvailable, userId, id_exemplaire],
    );
    return this.read(userId, id_exemplaire);
  }

  async updateAvailability(userId: number, id_exemplaire: number) {
    await databaseClient.query(
      `
    UPDATE exemplaire 
    SET isAvailable = TRUE 
    WHERE user_id = ? AND id_exemplaire = ?
  `,
      [userId, id_exemplaire],
    );
  }

  async delete(userId: number, id_exemplaire: number) {
    await databaseClient.query(
      `
    DELETE FROM exemplaire 
    WHERE user_id = ? AND id_exemplaire = ?
  `,
      [userId, id_exemplaire],
    );
  }
}

export default new ExemplaireRepository();
