import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Livre = {
  ISBN: string;
  titre: string;
  auteur: string;
  couverture_img: string;
  livre_resume: string;
};

class livreRepository {
  // The C of CRUD - Create operation
  async create(livre: Livre) {
    const [result] = await databaseClient.query(
      "INSERT INTO livre (ISBN, titre, auteur, couverture_img, livre_resume) VALUES (?, ?, ?, ?, ?)",
      [
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
  async read(ISBN: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM livre WHERE ISBN = ?",
      [ISBN],
    );

    return rows[0] as Livre;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM livre");
    return rows as Livre[];
  }

  // The U of CRUD - Update operation
  async update(ISBN: string, livre: Livre) {
    await databaseClient.query(
      "UPDATE livre SET titre = ?, auteur = ?, couverture_img = ?, livre_resume = ? WHERE ISBN = ?",
      [
        livre.titre,
        livre.auteur,
        livre.couverture_img,
        livre.livre_resume,
        ISBN,
      ],
    );
    return this.read(ISBN);
  }

  // The D of CRUD - Delete operation
  async delete(ISBN: string) {
    await databaseClient.query("DELETE FROM livre WHERE ISBN = ?", [ISBN]);
  }

  async search(searchTerm: string) {
    const [rows] = await databaseClient.query(
      "SELECT * FROM livre WHERE titre LIKE ?",
      [`%${searchTerm}%`],
    );
    return rows as Livre[];
  }
}
export default new livreRepository();
