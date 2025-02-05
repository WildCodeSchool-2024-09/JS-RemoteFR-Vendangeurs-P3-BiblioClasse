import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import authRepository from "./authRepository";

const JWT_SECRET = process.env.JWT_SECRET;
console.info("JWT_SECRET:", process.env.JWT_SECRET);

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await authRepository.findByEmail(email);

    if (!user) {
      console.error("User not found");
      res.status(404).json({ message: "User not found" });
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

    console.info("Login successful, token generated");
    res.status(200).json({ token });
    return;
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
    return;
  }
};

const register: RequestHandler = async (req, res, next) => {
  try {
    const { nom, prenom, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await authRepository.create(nom, prenom, email, hashedPassword);
    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};

export default { login, register };
