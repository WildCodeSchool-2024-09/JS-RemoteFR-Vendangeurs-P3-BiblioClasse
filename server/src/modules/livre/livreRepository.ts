import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

type Livre = {
  ISBN: string;
  titre: string;
  auteur: string;
  couverture_img: string;
  livre_resume: string;
};

type TopBooks = {
  ISBN: string;
  couverture_img: string;
  titre: string;
  nb_emprunts: number;
  auteur: string;
};

class livreRepository {
  // The C of CRUD - Create operation
  async create(userId: number, livre: Livre) {
    const [result] = await databaseClient.query(
      `INSERT INTO livre (user_id, ISBN, titre, auteur, couverture_img, livre_resume) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        livre.ISBN,
        livre.titre,
        livre.auteur,
        livre.couverture_img,
        livre.livre_resume,
      ],
    );

    console.info("Insert result:", result);
    if (result && "insertId" in result) {
      return result.insertId;
    }
    throw new Error("Failed to insert livre");
  }

  // The Rs of CRUD - Read operations
  async read(userId: number, ISBN: string) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM livre 
    WHERE user_id = ? AND ISBN = ?
  `,
      [userId, ISBN],
    );

    return rows[0] as Livre;
  }

  async readAll(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT * 
    FROM livre 
    WHERE user_id = ?
  `,
      [userId],
    );
    return rows as Livre[];
  }

  async readAllWithExemplaires(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
      l.ISBN,
      l.titre,
      l.auteur,
      l.couverture_img,
      l.livre_resume,
      COUNT(e.id_exemplaire) AS nombre_exemplaires,
      SUM(CASE WHEN e.isAvailable = TRUE THEN 1 ELSE 0 END) AS nombre_exemplaires_disponibles
    FROM 
      livre l
    LEFT JOIN 
      exemplaire e ON l.ISBN = e.ISBN
    WHERE 
      l.user_id = ?
    GROUP BY 
      l.ISBN, l.titre, l.auteur, l.couverture_img, l.livre_resume;`,
      [userId],
    );
    return rows as Livre[];
  }

  async getTopBooks(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT 
      l.ISBN, 
      l.couverture_img, 
      l.titre, 
      l.auteur, 
      COUNT(em.id_exemplaire) AS nb_emprunts 
    FROM 
      livre l 
    JOIN 
      exemplaire ex ON l.ISBN = ex.ISBN 
    JOIN 
      emprunt em ON ex.id_exemplaire = em.id_exemplaire 
    WHERE 
      l.user_id = ? 
    GROUP BY 
      l.ISBN, l.titre, l.auteur, l.couverture_img 
    ORDER BY 
      nb_emprunts DESC 
    LIMIT 3
  `,
      [userId],
    );
    return rows as TopBooks[];
  }

  // The U of CRUD - Update operation
  async update(userId: number, ISBN: string, livre: Livre) {
    await databaseClient.query(
      `
    UPDATE livre 
    SET titre = ?, auteur = ?, couverture_img = ?, livre_resume = ? 
    WHERE user_id = ? AND ISBN = ?
  `,
      [
        livre.titre,
        livre.auteur,
        livre.couverture_img,
        livre.livre_resume,
        userId,
        ISBN,
      ],
    );
    return this.read(userId, ISBN);
  }

  // The D of CRUD - Delete operation
  async delete(userId: number, ISBN: string) {
    await databaseClient.query(
      `
    DELETE FROM livre 
    WHERE user_id = ? AND ISBN = ?
  `,
      [userId, ISBN],
    );
  }

  async search(userId: number, searchTerm: string) {
    const [rows] = await databaseClient.query(
      `
    SELECT * 
    FROM livre 
    WHERE user_id = ? AND titre LIKE ?
  `,
      [userId, `%${searchTerm}%`],
    );
    return rows as Livre[];
  }
}
export default new livreRepository();
