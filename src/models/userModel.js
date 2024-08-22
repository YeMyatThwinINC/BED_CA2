//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const pool = require('../services/db');

//////////////////////////////////////////////////////
// SELECT ALL PLAYERS BY USER
//////////////////////////////////////////////////////
module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE id = ?;
    `;
const VALUES = [data.id||data.userId];

pool.query(SQLSTATMENT, VALUES, callback);
}

//////////////////////////////////////////////////////
// SELECT USER BY USERNAME  
//////////////////////////////////////////////////////
module.exports.selectByName = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ?;
    `;
const VALUES = [data.username];

pool.query(SQLSTATMENT, VALUES, callback);
}


module.exports.selectByIdIncludingPts = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE id = ?;
    
    SELECT 
        SUM(Task.points) AS total_points
    FROM 
        TaskProgress
    JOIN 
        Task 
    ON 
        TaskProgress.task_id = Task.task_id
    WHERE 
        TaskProgress.user_id = ?
    GROUP BY 
        TaskProgress.user_id;    
    `;
    //group by is for future use
const VALUES = [data.id,data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

//////////////////////////////////////////////////////
// SELECT USER BY USERNAME OR EMAIL
//////////////////////////////////////////////////////
module.exports.selectByNameOrEmail = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM User
    WHERE username = ? OR email = ?;
    `;
const VALUES = [data.username,data.email];

pool.query(SQLSTATMENT, VALUES, callback);
}


module.exports.selectElemById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT
        e.id,
        u.username AS Owner_name,
        u.id AS Owner_id,
        d.name AS Elemental_name,
        d.number AS dex_num,
        d.type,
        e.energy
    
    FROM 
        Elemental e
    INNER JOIN
        User u ON e.owner_id = u.id
    INNER JOIN 
        ElementalDex d ON e.dex_num = d.number
    WHERE
        e.owner_id = ?
    ORDER BY
        e.energy DESC;
    `;
const VALUES = [data.user_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

/// FROM PRACTICAL 5/////////
module.exports.insertUser = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO User (username, email, password, Elemunchies)
    VALUES (?, ?, ?, 50);
    
    SET @user_id := LAST_INSERT_ID();
    
    SELECT * from User where id=@user_id; 

    -- variable declared by the developer

    -- free 2 elementals
    INSERT INTO Elemental (owner_id, dex_num, energy)
    VALUES (@user_id, ROUND(1 + RAND() * 24), FLOOR(50 + RAND() * (70 - 50 + 1)));

    INSERT INTO Elemental (owner_id, dex_num, energy)
    VALUES (@user_id, ROUND(1 + RAND() * 24), FLOOR(50 + RAND() * (70 - 50 + 1)));
    `;
const VALUES = [data.username, data.email, data.password];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE User 
    SET username = ?, email = ?, password = ?
    WHERE id = ?;
    `;
const VALUES = [data.username, data.email, data.password, data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.updateActive = (data, callback) =>{
    const SQLSTATMENT = `
    UPDATE User
    SET active_elemental = ?
    WHERE id = ?;
    `; 
const VALUES = [data.id, data.user_id];

pool.query(SQLSTATMENT, VALUES, callback)
}

module.exports.deleteById = (data, callback) =>
{
    const SQLSTATMENT = `
    DELETE FROM User 
    WHERE id = ?;

    ALTER TABLE User AUTO_INCREMENT = 1;

    DELETE FROM elemental 
    WHERE owner_id = ?;

    DELETE FROM messages 
    WHERE user_id = ?;

    DELETE FROM TaskProgress 
    WHERE user_id = ?;
    `;
const VALUES = [data.id,data.id,data.id,data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.insertRandom = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Elemental (owner_id, dex_num, energy)
    VALUES (?, ROUND(1 + RAND() * 24), FLOOR(50 + RAND() * (70 - 50 + 1)));

    UPDATE User
    SET Elemunchies = Elemunchies - 200
    WHERE id = ?; 
    `;
const VALUES = [data.userId,data.userId];

pool.query(SQLSTATMENT, VALUES, callback);
}