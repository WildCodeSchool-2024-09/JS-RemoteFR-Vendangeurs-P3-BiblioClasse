import databaseClient from "../../../database/client";
import type { Rows } from "../../../database/client";

class parametreRepository {
  async insertDefaultParametre(
    userId: number,
    loanDuration: number,
    borrowLimit: number,
  ) {
    await databaseClient.query(
      `
      INSERT INTO parametre (user_id, loanDuration, borrowLimit) 
      VALUES (?, ?, ?)
    `,
      [userId, loanDuration, borrowLimit],
    );
  }

  async changeLoanDuration(userId: number, loanDuration: string) {
    await databaseClient.query(
      `
    UPDATE parametre 
    SET loanDuration = ? 
    WHERE user_id = ?
  `,
      [loanDuration, userId],
    );
  }

  async getLoanDuration(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT loanDuration 
    FROM parametre 
    WHERE user_id = ?
  `,
      [userId],
    );
    if (!rows || rows.length === 0) {
      throw new Error("Paramètre non trouvé pour cet utilisateur");
    }
    return rows[0].loanDuration;
  }

  async changeBorrowLimit(userId: number, borrowLimit: string) {
    await databaseClient.query(
      `
    UPDATE parametre 
    SET borrowLimit = ? 
    WHERE user_id = ?
  `,
      [borrowLimit, userId],
    );
  }
  async getBorrowLimit(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `
    SELECT borrowLimit 
    FROM parametre 
    WHERE user_id = ?
  `,
      [userId],
    );
    if (!rows || rows.length === 0) {
      throw new Error("Paramètre non trouvé pour cet utilisateur");
    }
    return rows[0].borrowLimit;
  }
}

export default new parametreRepository();
