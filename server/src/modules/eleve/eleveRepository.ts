import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Eleve = {
  nom: string;
  prenom: string;
};

class eleveRepository {
  async create(
    userId: number,
    nom: string,
    prenom: string,
  ): Promise<{ insertId: number }> {
    const [result] = await databaseClient.query<Result>(
      `
      INSERT INTO eleve (nom, prenom, user_id) 
      VALUES (?, ?, ?)
    `,
      [nom, prenom, userId],
    );
    return { insertId: result.insertId };
  }

  async read(userId: number, id_eleve: string) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM eleve 
    WHERE id_eleve = ? AND user_id = ?
  `,
      [id_eleve, userId],
    );

    return rows[0] as Eleve;
  }
  async readAll(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
        e.id_eleve, 
        e.prenom, 
        e.nom, 
        MIN(em.date_retour) AS date_retour, 
        COUNT(em.id_exemplaire) AS nbOfBooksBorrowed 
      FROM 
        eleve e 
      LEFT JOIN 
        emprunt em 
      ON 
        e.id_eleve = em.id_eleve 
      WHERE 
        e.user_id = ? 
      GROUP BY 
        e.id_eleve 
      ORDER BY 
        date_retour ASC;`,
      [userId],
    );
    return rows as Eleve[];
  }

  /*Student avec nbOfBooksBorrowed et date_retour*/
  async readAllStudentsWithBorrowsInProgress(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
  SELECT 
    e.id_eleve, 
    e.prenom, 
    e.nom, 
    MIN(em.date_retour) AS date_retour, 
    COUNT(em.id_exemplaire) AS nbOfBooksBorrowed 
  FROM 
    eleve e 
  INNER JOIN 
    emprunt em 
  ON 
    e.id_eleve = em.id_eleve 
  WHERE 
    e.user_id = ? 
    AND em.date_retour_effectif IS NULL 
  GROUP BY 
    e.id_eleve 
  ORDER BY 
    date_retour ASC;
`,
      [userId],
    );
    return rows as Eleve[];
  }

  /*Student avec nbOfBooksBorrowed et date_retour*/
  async readAllStudentsWithBorrowsInformation(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
  SELECT 
    e.id_eleve, 
    e.prenom, 
    e.nom, 
    CASE WHEN COUNT(em.id_exemplaire) = 0 THEN '2600-01-01' ELSE MIN(em.date_retour) END AS date_retour, 
    COUNT(em.id_exemplaire) AS nbOfBooksBorrowed 
  FROM 
    eleve e 
  LEFT JOIN 
    emprunt em 
  ON 
    e.id_eleve = em.id_eleve 
    AND em.date_retour_effectif IS NULL 
  WHERE 
    e.user_id = ? 
  GROUP BY 
    e.id_eleve, 
    e.nom, 
    e.prenom 
  ORDER BY 
    date_retour ASC, 
    nbOfBooksBorrowed DESC;
`,
      [userId],
    );
    return rows as Eleve[];
  }

  async update(userId: number, id_eleve: string, eleve: Eleve) {
    await databaseClient.query(
      `
    UPDATE eleve 
    SET nom = ?, prenom = ? 
    WHERE user_id = ? AND id_eleve = ?
  `,
      [eleve.nom, eleve.prenom, id_eleve, userId],
    );
  }

  async delete(userId: number, id_eleve: string) {
    await databaseClient.query(
      `
    DELETE FROM eleve 
    WHERE user_id = ? AND id_eleve = ?
  `,
      [userId, id_eleve],
    );
  }

  async search(userId: number, searchTerm: string) {
    const [rows] = await databaseClient.query(
      `
    SELECT * 
    FROM eleve 
    WHERE user_id = ? 
    AND (prenom LIKE ? OR nom LIKE ?)
  `,
      [`%${searchTerm}%`, `%${searchTerm}%`, userId],
    );
    return rows as Eleve[];
  }
}

export default new eleveRepository();
