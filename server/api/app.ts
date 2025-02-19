// Load the express module to create a web application

import express from "express";

const app = express();

// Configure it

/* ************************************************************************* */

// CORS Handling: Why is the current code present and do I need to define specific allowed origins for my project?

// CORS (Cross-Origin Resource Sharing) is a security mechanism in web browsers that blocks requests from a different domain than the server.
// You may find the following magic line in forums:

// app.use(cors());

// You should NOT do that: such code uses the `cors` module to allow all origins, which can pose security issues.
// For this pedagogical template, the CORS code allows CLIENT_URL in development mode (when process.env.CLIENT_URL is defined).

import cors from "cors";
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:4173", // Utilise localhost par défaut si undefined
      "http://192.168.1.154:4173",
    ],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  }),
);

// const allowedOrigins = ["http://localhost:4173", "http://192.168.1.154:4173"];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization",
//   }),
// );

// const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

// app.use(
//   cors({
//     origin: clientUrl, // Utilise la variable d'environnement pour autoriser le client
//     methods: "GET,POST,PUT,DELETE",
//     allowedHeaders: "Content-Type,Authorization",
//   }),
// );

// If you need to allow extra origins, you can add something like this:

/*
app.use(
  cors({
    origin: ["http://mysite.com", "http://another-domain.com"],
  }),
);
*/

// With ["http://mysite.com", "http://another-domain.com"]
// to be replaced with an array of your trusted origins

/* ************************************************************************* */

// Request Parsing: Understanding the purpose of this part

// Request parsing is necessary to extract data sent by the client in an HTTP request.
// For example to access the body of a POST request.
// The current code contains different parsing options as comments to demonstrate different ways of extracting data.

// 1. `express.json()`: Parses requests with JSON data.
// 2. `express.urlencoded()`: Parses requests with URL-encoded data.
// 3. `express.text()`: Parses requests with raw text data.
// 4. `express.raw()`: Parses requests with raw binary data.

// Uncomment one or more of these options depending on the format of the data sent by your client:
import cookieParser from "cookie-parser";
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded());
// app.use(express.text());
// app.use(express.raw());

/* ************************************************************************* */

// Import the API router
import router from "./router";

// Mount the API router under the "/api" endpoint
app.use("/api", router);
/* ************************************************************************* */

// Production-ready setup: What is it for?

// The code includes sections to set up a production environment where the client and server are executed from the same processus.

// What it's for:
// - Serving client static files from the server, which is useful when building a single-page application with React.
// - Redirecting unhandled requests (e.g., all requests not matching a defined API route) to the client's index.html. This allows the client to handle client-side routing.

import fs from "node:fs";
import path from "node:path";

// Serve server resources

const publicFolderPath = path.join(__dirname, "../../server/public");

if (fs.existsSync(publicFolderPath)) {
  app.use(express.static(publicFolderPath));
}

// Serve client resources

const clientBuildPath = path.join(__dirname, "../../client/dist");

// 📌 Ne rediriger vers le frontend que si ce n’est PAS une requête API
app.use(express.static(clientBuildPath));

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next(); // Ne pas intercepter les requêtes API
  }
  res.sendFile("index.html", { root: clientBuildPath });
});
/* ************************************************************************* */

// Middleware for Error Logging
// Important: Error-handling middleware should be defined last, after other app.use() and routes calls.

import type { ErrorRequestHandler } from "express";

// Define a middleware function to log errors
const logErrors: ErrorRequestHandler = (err, req, res, next) => {
  // Log the error to the console for debugging purposes
  console.error(err);
  console.error("on req:", req.method, req.path);

  // Pass the error to the next middleware in the stack
  next(err);
};

// Mount the logErrors middleware globally
app.use(logErrors);

/* ************************************************************************* */

export default app;
