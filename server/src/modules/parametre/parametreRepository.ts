import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Parametre = {
  nom: string;
  valeur: string;
};

class parametreRepository {
  async setLoanDuration(loanDuration: string) {
    await databaseClient.query("UPDATE parametre SET loanDuration = ?", [
      loanDuration,
    ]);
  }

  async getLoanDuration() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT loanDuration FROM parametre",
    );
    return rows[0].loanDuration;
  }

  async setBorrowLimit(borrowLimit: string) {
    await databaseClient.query("UPDATE parametre SET borrowLimit = ?", [
      borrowLimit,
    ]);
  }

  async getBorrowLimit() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT borrowLimit FROM parametre",
    );
    return rows[0].borrowLimit;
  }
}

export default new parametreRepository();
