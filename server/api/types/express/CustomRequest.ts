import type { Request } from "express";

export interface CustomRequest extends Request {
  user?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    created_at: string;
    updated_at: string;
  };
}
