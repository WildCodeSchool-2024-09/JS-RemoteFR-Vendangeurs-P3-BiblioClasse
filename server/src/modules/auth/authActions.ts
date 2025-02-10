import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import databaseClient from "../../../database/client";
import parametreRepository from "../parametre/parametreRepository";
import authRepository from "./authRepository";

const JWT_SECRET = process.env.JWT_SECRET;

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authRepository.findByEmail(email);

    if (!user) {
      console.error("User not found");
      res.status(404).json({
        message: "Utilisateur inconnu",
      });
      return;
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      console.error("Invalid password");
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, {
      expiresIn: 86400, // correspond à 24h
    });

    res.status(200).json({ token, user_id: user.id });
    return;
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
    return;
  }
};

import type { QueryResult } from "mysql2"; // Import pour le typage

const register: RequestHandler = async (req, res, next) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await authRepository.create(
      nom,
      prenom,
      email,
      hashedPassword,
    );

    if (!newUserId) {
      res
        .status(400)
        .json({ message: "Erreur lors de la création de l'utilisateur." });
      return;
    }
    // On exécute la requête, en forçant le typage avec `QueryResult`
    const [rows] = await databaseClient.query<QueryResult>(
      "SELECT COUNT(*) AS count FROM user WHERE id = ?",
      [newUserId],
    );
    // Loguer la réponse pour mieux comprendre la structure
    // Si l'utilisateur existe, insérer les paramètres par défaut
    await parametreRepository.insertDefaultParametre(newUserId, 7, 5);

    // Send status without returning it
    res.sendStatus(201);
  } catch (err) {
    next(err); // Forward error to the next error handling middleware
  }
};

export default { login, register };
