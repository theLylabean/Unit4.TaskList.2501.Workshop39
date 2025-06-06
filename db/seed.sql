-- // import db from "#db/client";

-- // import { createTask } from "#db/queries/tasks";
-- // import { createUser } from "#db/queries/users";

-- // await db.connect();
-- // await seed();
-- // await db.end();
-- // console.log("🌱 Database seeded.");

-- // async function seed() {
-- //   // TODO
-- // }

DELETE FROM users;
DELETE FROM tasks;

INSERT INTO users (username, password) VALUES
    ('dawnie88@gmail.com', '421aters');

INSERT INTO tasks (title, done, user_id) VALUES
    (
        'Laundry',
        false,
        (SELECT id FROM users WHERE username = 'dawnie88@gmail.com')
    ),
    (
        'Dishes',
        false,
        (SELECT id FROM users WHERE username = 'dawnie88@gmail.com')
    ),
    (
        'Vacuum',
        true,
        (SELECT id FROM users WHERE username = 'dawnie88@gmail.com')
    ),
    (
        'Do Coding Homework',
        false,
        (SELECT id FROM users WHERE username = 'dawnie88@gmail.com')
    ),
    (
        'Send Nancy tiny glitter penises',
        false,
        (SELECT id FROM users WHERE username = 'dawnie88@gmail.com')
    );