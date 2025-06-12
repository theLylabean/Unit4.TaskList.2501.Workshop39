import db from "#db/client";

export async function createTasks({ title, done, user_name }){
    const result = await db.query(
        'SELECT id FROM users WHERE name = $1;', [user_name]
    );
    if(!result.rows.length === 0){
        throw new Error( 'user with username not found' )
    }
    const user_id = result.rows[0].id;
    const sql = `
        INSERT INTO tasks (title, done, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const { rows: tasks } = await db.query(sql, [title, done, user_id]);
    return tasks;
}

export async function getTasks(){
    const sql = `
        SELECT * FROM tasks
    `;
    const { rows: tasks } = await db.query(sql);
    return tasks;
}

export async function getTaskById(id){
    const sql = `
        SELECT * FROM tasks WHERE id = $1
    `;
    const { rows: tasks } = await db.query(sql, [id]);
    return tasks[0];
}

export async function updateTask({ id, title, done, user_id }){
    const sql = `
        UPDATE tasks
        SET title = $1, done = $2
        WHERE id = $3 AND user_id = $4
        RETURNING *;
    `;
    const { rows: task } = await db.query(sql, [title, done, id, user_id])
    return task[0];
}

export async function deleteTask(id){
    const sql = `
        DELETE FROM tasks WHERE id = $1
        RETURNING *;
    `;
    const { rows: task } = await db.query(sql, [id]);
    return task;
}