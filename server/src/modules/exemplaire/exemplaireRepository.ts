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
};

class ExemplaireRepository {
  async create(exemplaire: Exemplaire) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO exemplaire (ISBN, isAvailable) VALUES (?, ?)",
      [exemplaire.ISBN, exemplaire.isAvailable],
    );
    return result.insertId;
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
  async readAllByISBN(ISBN: string): Promise<Array<Exemplaire>> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM exemplaire WHERE ISBN = ?",
      [ISBN],
    );
    return rows as Exemplaire[];
  }

  async readAvailableExemplaire() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT l.titre, e.id_exemplaire FROM exemplaire AS e JOIN livre AS l ON e.ISBN=l.ISBN WHERE e.isAvailable=true ORDER BY l.titre;",
    );
    return rows as Exemplaire[];
  }

  async readBorrowedExemplaireByISBN(
    ISBN: string,
  ): Promise<Array<borrowedExemplaireByISBN>> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT el.nom, el.prenom, em.date_retour, ex.id_exemplaire FROM emprunt AS em JOIN eleve AS el ON em.id_eleve=el.id_eleve JOIN exemplaire AS ex ON em.id_exemplaire=ex.id_exemplaire WHERE ex.ISBN=? AND ex.isAvailable=0 AND date_retour_effectif IS NULL ORDER BY em.date_retour, el.nom, el.prenom;",
      [ISBN],
    );
    return rows as borrowedExemplaireByISBN[];
  }

  async update(id_exemplaire: number, exemplaire: Exemplaire) {
    await databaseClient.query(
      "UPDATE exemplaire SET ISBN = ?, isAvailable = ? WHERE id_exemplaire = ?",
      [exemplaire.ISBN, exemplaire.isAvailable, id_exemplaire],
    );
    return this.read(id_exemplaire);
  }

  async updateAvailability(id_exemplaire: number) {
    await databaseClient.query(
      "UPDATE exemplaire SET isAvailable = TRUE WHERE id_exemplaire = ?",
      [id_exemplaire],
    );
  }

  async delete(id_exemplaire: number) {
    await databaseClient.query(
      "DELETE FROM exemplaire WHERE id_exemplaire = ?",
      [id_exemplaire],
    );
  }
}

export default new ExemplaireRepository();
