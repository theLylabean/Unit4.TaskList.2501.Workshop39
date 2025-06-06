import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import usersRouter from './api/usersRoute.js';
import tasksRouter from './api/tasksRoute.js';
import db from "#db/client";
import express from "express";
const app = express();
export default app;

const PORT = process.env.PORT ?? 3000;

await db.connect();

app.use(express.json());

export const verifyToken = () => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader.split(' ')[1];
  const decodedJWT = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedJWT
  next();
}

app.use(( req, res, next ) => {
  console.log(req.method, req.originalUrl);
  next();
})

app.get('/', async( req, res, next ) => {
  try{
    const allUsers = await client.query(`SELECT * FROM users;`)
    if(!allUsers) return res.status(404).send('Users not found.');
    res.status(200).send(allUsers);
  }catch(err){
    console.log(err)
    res.status(400).send('No info found.')
  }
})

app.post('/register', async( req, res, next ) => {
  const { username, password } = req.body;
  try{
    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = await client.query(`
      INSERT INTO users ( name, username, password )
      VALUE ($1, $2, $3)
      RETURNING *;
      `, [username, hashedPassword]);

      if(!newUser) return res.status(401).send('Error creating new user.');
      const token = jwt.sign({ id: newUser.id, username: newUser.email }, process.env.JWT_SECRET);
      res.status(201).send(token);
  }catch(err){
    console.log(err);
    res.send('Error registering.')
  }
})

app.post('/login', async( req, res, next ) => {
  const { username, password } = req.body;
  try{
    const userInfo = await client.query(`SELECT * FROM users WHERE username = $1;`, [username]);
    const isPWMatch = await bcrypt.compare(password, userInfo.password);
    if(!isPWMatch) return res.status(401).send('Not authorized.');
    const token = jwt.sign({ id: userInfo.id, username: userInfo.email });
    res.status(201).send(token);
  }catch(err){
    console.log('Error logging in.');
  }
})

app.get('/completedTasks', verifyToken, async( req, res, next ) => {
  try{
    const finishedTasks = await client.query(`SELECT * FROM users WHERE done = true;`)
    if(!finishedTasks) return res.status(404).send('Error finding games.');
  }catch(err){
    console.log(err);
    res.send('Error getting completed tasks.');
  }
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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
