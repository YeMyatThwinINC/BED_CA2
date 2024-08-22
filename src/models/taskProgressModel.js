const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM TaskProgress;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.insertSingle = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO TaskProgress (user_id, task_id, completion_date, notes)
    VALUES (?, ?, ?, ?);

    SELECT points INTO @task_reward
    FROM task
    WHERE task_id = ?;

    UPDATE user
    SET elemunchies = elemunchies + @task_reward
    WHERE id = ?;

    SELECT @task_reward AS Elemunchies;
    `;
const VALUES = [data.user_id, data.task_id, data.completion_date, data.notes, data.task_id, data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectByUserId = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT TaskProgress.progress_id, TaskProgress.task_id, task.title, task.points, user.username, TaskProgress.user_id, TaskProgress.completion_date
    FROM TaskProgress
    JOIN Task ON 
        TaskProgress.task_id = Task.task_id
    JOIN User ON 
        TaskProgress.user_id = User.id
    WHERE 
        TaskProgress.user_id = ?;
    `;
const VALUES = [data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM TaskProgress
    WHERE progress_id = ?;
    `;
const VALUES = [data.progress_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE TaskProgress 
    SET notes = ?
    WHERE progress_id = ?;
    `;
const VALUES = [data.notes, data.progress_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM TaskProgress 
    WHERE progress_id = ?;

    ALTER TABLE User AUTO_INCREMENT = 1;
    `;
const VALUES = [data.progress_id];

pool.query(SQLSTATMENT, VALUES, callback);
}