const database = require('../../database/config');

exports.getUserNotifications = args => new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT 
                            notifications.id,
                            notifications.body,
                            notifications.createdDate,
                            notifications.action,
                            notifications.data,
                            notifications.opened
                            FROM notifications WHERE toUser = ? LIMIT ? OFFSET ?`;

    database.query(query, args, (err, result) => {
        if (err) throw err;
        resolve(result);
    })
});

exports.getNotificationByID = args => new Promise((resolve, reject) => {
    const query = 'SELECT * FROM notifications WHERE id = ? LIMIT 1';
    database.query(query, args, (err, result) => {
        if (err) throw err;
        if (result.length == 1) {
            resolve([true, result[0]]);
        } else {
            resolve([false]);
        }
    });
});

exports.getNewNotifications = args => new Promise((resolve, reject) => {
    const query = `SELECT DISTINCT 
                        notifications.id,
                        notifications.body,
                        notifications.createdDate,
                        notifications.action,
                        notifications.data,
                        notifications.opened
                        FROM notifications WHERE toUser = ? AND opened = 0 LIMIT ? OFFSET ?`;

    database.query(query, args, (err, result) => {
        if (err) throw err;
        resolve(result);
    });
});

exports.createNewNotification = args => new Promise((resolve, reject) => {
    const query = 'INSERT INTO notifications(toUser, body, action, opened, createdDate, data) VALUES(?, ?, ?, ?, ?, ?)';

    database.query(query, args, (err, result) => {
        if (err) throw err;
        const isValidCreation = (result['affectedRows'] == 1);
        resolve(isValidCreation);
    });
});

exports.createFollowNotification = toUser => new Promise((resolve, reject) => {
    const args = [
        toUser,
        "One user start following you",
        "follow",
        0,
        "",
        new Date().toISOString()
    ];
    this.createNewNotification(args).then(state => resolve(state));
});

exports.createQuestionNotification = (toUser, questionId) => new Promise((resolve, reject) => {
    const args = [
        toUser,
        "You have new Question check it now",
        "question",
        0,
        questionId.toString(),
        new Date().toISOString()
    ];
    this.createNewNotification(args).then(state => resolve(state));
});

exports.deleteAllNotifications = () => new Promise((resolve, reject) => {
    const query = 'DELETE FROM notifications';
    database.query(query, (err, result) => {
        if (err) throw err;
        const isValidDelete = result['affectedRows'] == 1;
        resolve(isValidDelete);
    });
});

exports.deleteNotificationByID = args => new Promise((resolve, reject) => {
    const query = 'DELETE FROM notifications WHERE id = ?';
    database.query(query, args, (err, result) => {
        if (err) throw err;
        const isValidDelete = result['affectedRows'] == 1;
        resolve(isValidDelete);
    });
});

exports.makeNotificationReaded = args => new Promise((resolve, reject) => {
    const query = 'UPDATE notifications SET opened = 1 WHERE id = ?';
    database.query(query, args, (err, result) => {
        if (err) throw err;
        const isValidUpdated = result['affectedRows'] == 1;
        resolve(isValidUpdated);
    });
});