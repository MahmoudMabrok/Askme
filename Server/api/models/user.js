const database = require('../../database/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (email, password) => new Promise((resolve, reject) => {
    const sqlQuery = `SELECT password FROM users WHERE email = ? LIMIT 1`;

    database.query(sqlQuery, email, ((err, result) => {
        if (err) throw err;
        const validInfo = (result.length == 1);
        if (validInfo) {
            const encryptedPass = result[0]['password'];
            bcrypt.compare(password, encryptedPass, (err, isSame) => {
                if (err) throw err;
                if (isSame) {
                    jwt.sign(email, process.env.JWT_KEY, (err, token) => {
                        if (err) throw err;
                        resolve([true, token]);
                    });
                } else {
                    resolve([false]);
                }
            });
        } else {
            resolve([false]);
        }
    }));
});

exports.register = user => new Promise((resolve, reject) => {
    const query = "INSERT INTO users(name, email, username , password, joinDate) VALUES (?, ? , ? , ?, ?)";
    database.query(query, user, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        }
        else {
            resolve(false);
        }
    });
});

exports.queryUsers = args => new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT users.name, 
                                   users.username,
                                   users.email,
                                   users.email,
                                   users.avatar,
                                   users.address,
                                   users.status,
                                   users.active,
                                   users.joinDate,
                                   (SELECT COUNT(*) FROM follows WHERE fromUser = users.id) AS following,
                                   (SELECT COUNT(*) FROM follows WHERE toUser = users.id) AS followers,
                                   (SELECT COUNT(*) FROM questions WHERE fromUser = users.id) AS questions,
                                   (SELECT COUNT(*) FROM answers WHERE fromUser = users.id) AS answers,
                                   (SELECT COUNT(*) FROM reactions WHERE fromUser = users.id) AS likes
                  FROM users LIMIT ? OFFSET ?`;

    database.query(query, args, (err, result) => {
        if (err) throw err;
        resolve(result);
    });
});

exports.getOneUser = args => new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT users.name, 
                                   users.username,
                                   users.email,
                                   users.email,
                                   users.avatar,
                                   users.address,
                                   users.status,
                                   users.active,
                                   users.joinDate,
                                   (SELECT COUNT(*) FROM follows WHERE fromUser = users.id) AS following,
                                   (SELECT COUNT(*) FROM follows WHERE toUser = users.id) AS followers,
                                   (SELECT COUNT(*) FROM questions WHERE fromUser = users.id) AS questions,
                                   (SELECT COUNT(*) FROM answers WHERE fromUser = users.id) AS answers,
                                   (SELECT COUNT(*) FROM reactions WHERE fromUser = users.id) AS likes
                  FROM users WHERE username = ? LIMIT ? OFFSET ?`;

    database.query(query, args, (err, result) => {
        if (err) throw err;
        resolve(result);
    });
});

exports.getUserPassword = args => new Promise((resolve, reject) => {
    const sqlQuery = 'SELECT password FROM users WHERE email = ?';
    database.query(sqlQuery, email, (err, result) => {
        if (err) throw err;
        if (result.length == 1) {
            const oldPassword = result[0]['password'];
            resolve([true, oldPassword]);
        } else {
            resolve([false]);
        }
    });
});

exports.getUserAvatar = args => new Promise((resolve, reject) => {
    const updateQuery = "SELECT avatar FROM users WHERE email = ?";
    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        const oldAvatar = result[0]['avatar'];
        resolve(oldAvatar);
    });
});

exports.deleteUsers = () => new Promise((resolve, reject) => {
    const query = "DELETE * FROM users";
    database.query(query, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] > 0) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.deleteOneUser = args => new Promise((resolve, reject) => {
    const query = "DELETE FROM users WHERE email = ?";
    database.query(query, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] > 0) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.deleteUserStatus = args => new Promise((resolve, reject) => {
    const deleteQuery = 'UPDATE users SET status = "" WHERE email = ?';
    database.query(deleteQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.deleteUserAvatar =  args => new Promise((resolve, reject) => {
    const deleteQuery = 'UPDATE users SET avatar = "" WHERE email = ?';
    database.query(deleteQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updateName = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET name = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updateUsername = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET username = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updateEmail = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET email = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updatePassword = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        }else{
            resolve(false);
        }
    })
});

exports.updateAddress = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET address = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updateStatus = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE status FROM users SET status = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updateActive = args => new Promise((resolve, reject) => {
    const updateQuery = 'UPDATE users SET active = ? WHERE email = ?';

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.updateUserAvatar =  args => new Promise((resolve, reject) => {
    const updateQuery = "UPDATE users SET avatar = ? WHERE email = ?";

    database.query(updateQuery, args, (err, result) => {
        if (err) throw err;
        if (result['affectedRows'] == 1) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
});

exports.hashPassword = (password) => new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) throw error;
        resolve(hashedPassword);
    });
});

exports.comparePassword = (newPassword, oldPassword) => new Promise((resolve, reject) => {
    bcrypt.compare(newPassword, oldPassword, (err, isSame) => {
        if (err) throw err;
        resolve(isSame);
    });
});

exports.isAvailableInfo = info => new Promise((resolve, reject) => {
    const sqlQuery = `SELECT * FROM users WHERE email = ? or username = ? LIMIT 1`;
    database.query(sqlQuery, info, (err, result) => {
        if (err) throw err;
        const isAvailable = result.length == 0;
        resolve([isAvailable, result]);
    });
});