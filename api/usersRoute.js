import { getUsers } from '#db/query/users';
import express from 'express';
const router = express.Router();

router.get('/', async( req, res, next ) => {
    const users = await getUsers();
    res.send(users);
})

export default router