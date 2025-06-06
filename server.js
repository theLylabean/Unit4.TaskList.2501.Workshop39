import db from "#db/client";
import express from "express";
const app = express();

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
