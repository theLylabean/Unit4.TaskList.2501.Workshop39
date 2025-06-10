import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from "#db/client";
import usersRouter from './api/usersRoute.js';
import tasksRouter from './api/tasksRoute.js';
import express from "express";
const app = express();
export default app;

await db.connect();

app.use(express.json());

app.use(( req, res, next ) => {
  console.log(req.method, req.originalUrl);
  next();
})

app.use('/usersRoute', usersRouter);
app.use('/tasksRoute', tasksRouter);
app.get('/', async( req, res, next ) => {
  res.send('Welcome to The Tiny Task Manager!')
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
