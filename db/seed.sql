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

console.log("🌱 Database seeded.");