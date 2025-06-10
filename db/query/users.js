import db from '../client.js';

export async function createUsers( name, username, hashedPassword ){
    const sql = await db.query(`
        INSERT INTO users (name, username, password)
        VALUES ($1, $2, $3)
        RETURNING *;
    `, [name, username, hashedPassword]);
    return sql.rows[0];
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

export async function updateUser({ id, name, username, password }){
    const sql = `
        UPDATE users
        SET name = $1, username = $2, password = $3
        WHERE id = $4
        RETURNING *;
    `;
    const { rows: user } = await db.query(sql, [name, username, password, id ])
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
