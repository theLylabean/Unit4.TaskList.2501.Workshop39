import { getTaskById, getTasks, updateTask, deleteTask, createTasks } from '#db/query/tasks';
import verifyToken from '#auth/auth';
import db from '#db/client';
import express from 'express';
const router = express.Router();

router.get('/', verifyToken, async( req, res, next ) => {
    const tasks = await getTasks();
    res.send(tasks);
})

router.post('/', verifyToken, async( req, res, next ) => {
    const { title, done, user_name } = req.body;
    try {
        if(!req.body){
            return res.status(400).send({ error: 'Missing req.body' });
        }
         console.log(title)
        console.log(done)
        console.log(user_name)
        if(!title || typeof done !== 'boolean' || !user_name){
            return res.status(400).send({ error: 'Missing one or more required fields.' });
        }
        const task = await createTasks({ title, done, user_name });
       
        res.status(201).send(task);
    } catch (error) {
        console.log(err);
        res.status(500).send({ error: 'Server error.' });
    }
})

router.get('/completedTasks', verifyToken, async( req, res, next ) => {
  try{
    const result = await db.query(`SELECT * FROM tasks WHERE done = true;`)
    const finishedTasks = result.rows; 
    if(!finishedTasks.length) return res.status(404).send('Error finding tasks.');
    res.status(200).send(finishedTasks);
  }catch(err){
    console.log(err);
    res.status(500).send('Error getting completed tasks.');
  }
})

router.get('/:id', verifyToken, async( req, res, next ) => {
    const id = parseInt(req.params.id);
    try {
        if(!Number.isInteger(id) && id < 0){
            return res.status(400).send({ error: 'Please send a valid number.' });
        }
        const task = await getTaskById(id);
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
    const user_id = Number(req.user?.id);
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
    const user_id = Number(req.user?.id);
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




export default router