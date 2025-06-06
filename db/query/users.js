import db from '../client.js';
import app from '#server';

export async function createUsers({ name, username, pw }){
    const sql = `
        INSERT INTO users (name, username, hashedPassword)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const { rows: users } = await db.query(sql, [name, username, pw]);
    return users;
}

export async function getUsers(){
    const sql = `
        SELECT * FROM users
    `;
    const { rows: users } = await db.query(sql);
    return users;
}

export async function getUserById(id){
    const sql = `
        SELECT * FROM users WHERE id = $1
    `;
    const { rows: user } = await db.query(sql, [id]);
    return user[0];
}

export async function updateUser({ id, name, username, pw }){
    const sql = `
        UPDATE users
        SET name = $1, username = $2, pw = $3
        WHERE id = $4
        RETURNING *;
    `;
    const { rows: user } = await db.query(sql, [name, username, pw, id ])
    return user[0];
}

export async function deleteTask(id){
    const sql = `
        DELETE FROM users WHERE id = $1
        RETURNING *;
    `;
    const { rows: user } = await db.query(sql, [id]);
    return user;
}