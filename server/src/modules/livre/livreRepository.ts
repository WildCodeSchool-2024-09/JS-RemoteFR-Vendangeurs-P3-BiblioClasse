import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Livre = {
  ISBN: string;
  titre: string;
  auteur: string;
  couverture_image: string;
  livre_resume: string;
};

class livreRepository {
  // The C of CRUD - Create operation
  async create(livre: Livre) {
    const [result] = await databaseClient.query(
      "INSERT INTO livre (ISBN, titre, auteur, couverture_image, livre_resume) VALUES (?, ?, ?, ?, ?)",
      [
        livre.ISBN,
        livre.titre,
        livre.auteur,
        livre.couverture_image,
        livre.livre_resume,
      ],
    );
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
      "UPDATE livre SET titre = ?, auteur = ?, couverture_image = ?, livre_resume = ? WHERE ISBN = ?",
      [
        ISBN,
        livre.titre,
        livre.auteur,
        livre.couverture_image,
        livre.livre_resume,
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
      [`%${searchTerm}%`, `%${searchTerm}%`],
    );
    return rows as Livre[];
  }
}
export default new livreRepository();
