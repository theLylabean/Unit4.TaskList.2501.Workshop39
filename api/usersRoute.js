import { createUsers, getUserById, getUsers } from '#db/query/users';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '#db/client';
import express from 'express';
const router = express.Router();
export default router

router.post('/register', async( req, res, next ) => {
    const { name, username, password } = req.body;
      try{
        const hashedPassword = await bcrypt.hash(password, 5);
        const newUser = await createUsers(name, username, hashedPassword)
    
          if(!newUser) return res.status(401).send('Error creating new user.');
          const token = jwt.sign({ id: newUser.id, username: newUser.email }, process.env.JWT_SECRET);
          res.status(201).send(token);
      }catch(err){
        console.log('Error registering', err);
        res.status(500).send('Error registering.');
      }
    })

router.post('/login', async( req, res, next ) => {
  const { username, password } = req.body;
  try{
    const result = await db.query(`SELECT * FROM users WHERE username = $1;`, [username]);
    const userInfo = await result.rows[0];
    const isPWMatch = await bcrypt.compare(password, userInfo.password);
    if(!isPWMatch) return res.status(401).send('Not authorized.');
    const token = jwt.sign({ id: userInfo.id, username: userInfo.username }, process.env.JWT_SECRET);
    res.status(201).send(token);
  }catch(err){
    console.log('Error logging in.');
  }
})


