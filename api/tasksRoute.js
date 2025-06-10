import { getTaskById } from '#db/query/tasks';
import verifyToken from '#auth/auth';
import db from '#db/client';
import express from 'express';
const router = express.Router();

router.put('/:id', async( req, res, next ) => {
    const id = req.params.id;
    const { title, done } = req.body;
    try {
        if(!req.body){
            return res.status(400).send({ error: 'Please send all required information.' })
        }
        if(! title || !done){
            return res.status(400).send({ error: 'Missing one or more required fields.' })
        }
        const task = await getTaskById(id);
        if(!task){
            return res.status(404).send({ error: 'User not found.' })
        }
        const 
    } catch (err) {
        console.log(err)
    }
})

router.get('/completedTasks', verifyToken, async( req, res, next ) => {
  try{
      const result = await db.query(`SELECT * FROM tasks WHERE done = true;`)
    const finishedTasks = await result.rows[0]; 
    if(!finishedTasks) return res.status(404).send('Error finding tasks.');
    res.status(201).send(finishedTasks);
  }catch(err){
    console.log(err);
    res.send('Error getting completed tasks.');
  }
})


export default router