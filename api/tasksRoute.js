import { getTaskById, getTasks, updateTask, deleteTask } from '#db/query/tasks';
import verifyToken from '#auth/auth';
import db from '#db/client';
import express from 'express';
import { deleteTask } from '#db/query/users';
const router = express.Router();

router.get('/', verifyToken, async( req, res, next ) => {
    const tasks = await getTasks();
    res.send(tasks);
})

router.get('/:id', verifyToken, async( req, res, next ) => {
    const id = req.params.id;
    try {
        if(!Number.isInteger(id) && id < 0){
            return res.status(400).send({ error: 'Please send a valid number.' });
        }
        const task = getTaskById(id);
        if(!task){
            return res.status(404).send({ error: 'User ID not found.' });
        }
        res.send(task);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Server error.' });
    }
})

router.put('/:id', verifyToken, async( req, res, next ) => {
    const id = parseInt(req.params.id);
    const { title, done } = req.body;
    const user_id = req.user?.id;
    try {
        if(!req.body){
            return res.status(400).send({ error: 'Please send all required information.' });
        }
        if(! title || done === undefined){
            return res.status(400).send({ error: 'Missing one or more required fields.' });
        }
        const task = await getTaskById(id);
        if(!task){
            return res.status(404).send({ error: 'User not found.' });
        }
        if(task.user_id !== user_id){
            return res.status(403).send({ error: 'You are not authorised to modify this task.' });
        }
        const updatedTask = await updateTask({ id, title, done, user_id });
        res.send(updatedTask);
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Server error.' });
    }
})

router.delete('/:id', verifyToken, async( req, res, next ) => {
    const id = parseInt(req.params.id);
    const user_id = req.user?.id;
    try {
        if(!Number.isInteger(id) && id < 0){
            return res.status(400).send({ error: 'Not a valid number.' });
        }
        const task = await getTaskById(id);
        if(!task){
            return res.status(404).send({ error: 'Task not found.' });
        }
        if(task.user_id !== user_id){
            return res.status(403).send({ error: 'You are not authorised to delete this task.' });
        }
        const deletedTask = await deleteTask(id);
        if(!deletedTask){
            return res.status(404).send({ error: 'Cannot delete. Please try again.' });
        }
        res.sendStatus(204)
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: 'Server error.' });
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