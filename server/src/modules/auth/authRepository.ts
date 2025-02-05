import e from "express";
import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

class authRepository {
  async findByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );
    return rows[0];
  }

  async create(nom: string, prenom: string, email: string, password: string) {
    await databaseClient.query(
      "INSERT INTO user (nom, prenom, email, password) VALUES (?, ?, ?, ?)",
      [nom, prenom, email, password],
    );
  }
}

export default new authRepository();
