import db from "./client.js";
import bcrypt from 'bcrypt';

async function seedFile(){
    await db.connect();
const sql = `
DELETE FROM users;
DELETE FROM tasks;

INSERT INTO users (name, username, password) VALUES
    ('Lyla Lynn', 'dawnie88@gmail.com', '${await bcrypt.hash('421aters', 5)}');

INSERT INTO tasks (title, done, user_id) VALUES
    (
        'Laundry',
        false,
        (SELECT id FROM users WHERE name = 'Lyla Lynn')
    ),
    (
        'Dishes',
        false,
        (SELECT id FROM users WHERE name = 'Lyla Lynn')
    ),
    (
        'Vacuum',
        true,
        (SELECT id FROM users WHERE name = 'Lyla Lynn')
    ),
    (
        'Do Coding Homework',
        false,
        (SELECT id FROM users WHERE name = 'Lyla Lynn')
    ),
    (
        'Send Nancy tiny glitter penises',
        false,
        (SELECT id FROM users WHERE name = 'Lyla Lynn')
    );
`
await db.query(sql);
await db.end();
}
seedFile();