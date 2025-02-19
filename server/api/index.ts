import "dotenv/config";
import dotenv from "dotenv";
dotenv.config();
import "../database/checkConnection";

import app from "./app";

// Get the port from the environment variables
const port = Number.parseInt(process.env.APP_PORT ?? "3310", 10);

// Start the server and listen on the specified port
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API BiblioClasse");
});

// app
//   .listen(port, () => {
//     console.info(`Server is listening on port ${port}`);
//   })
//   .on("error", (err: Error) => {
//     console.error("Error:", err.message);
//   });

app
  .listen(port, "0.0.0.0", () => {
    console.info(`Server is listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Error:", err.message);
  });
