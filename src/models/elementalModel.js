const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT
        e.id,
        u.username AS User_name,
        u.id AS Owner_id,
        d.name AS Elemental_name,
        d.type,
        e.energy,
        d.number
    FROM 
        Elemental e
    INNER JOIN
        User u ON e.owner_id = u.id
    INNER JOIN 
        ElementalDex d ON e.dex_num = d.number
    ORDER BY
        e.energy DESC;
    `;

pool.query(SQLSTATMENT, callback);
}

module.exports.selectByOwnerId = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT
        e.id,
        p.name AS Player_name,
        d.name AS Elemental_name,
        d.type,
        e.energy
        
    FROM 
        Elemental e
    INNER JOIN
        Player p ON e.owner_id = p.id
    INNER JOIN 
        ElementalDex d ON e.dex_num = d.number
    WHERE 
        e.owner_id = ?;
    `;
const VALUES = [data.owner_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.selectById = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT
        e.id,
        p.username AS user_name,
        d.name AS Elemental_name,
        d.type,
        d.number AS dex_num,
        e.energy
    FROM 
        Elemental e
    INNER JOIN
        User p ON e.owner_id = p.id
    INNER JOIN 
        ElementalDex d ON e.dex_num = d.number
    WHERE 
        e.id = ?;
    `;
const VALUES = [data.active_elemental||data.id];

pool.query(SQLSTATMENT, VALUES, callback);
}


module.exports.selectOnlyRel = (data, callback) =>
{
    const SQLSTATMENT = `
    SELECT
        e.id,
        p.name AS Player_name,
        d.name AS Elemental_name,
        d.type,
        e.energy
        
    FROM 
        Elemental e
    INNER JOIN
        Player p ON e.owner_id = p.id
    INNER JOIN 
        ElementalDex d ON e.dex_num = d.number
    WHERE 
        e.id = ? AND e.owner_id = ?;
    `;
const VALUES = [data.id, data.owner_id];

pool.query(SQLSTATMENT, VALUES, callback);
}
module.exports.insertRandom = (data, callback) =>
{
    const SQLSTATMENT = `
    INSERT INTO Elemental (owner_id, dex_num, energy)
    VALUES (?, ROUND(1 + RAND() * 24), FLOOR(50 + RAND() * (70 - 50 + 1)));
    `;
const VALUES = [data.owner_id];

pool.query(SQLSTATMENT, VALUES, callback);
}

module.exports.oneHourCheck = (data, callback) => {
    const SQLSTATMENT = `
    SELECT 
        IF(
        MAX(created_on) IS NULL OR TIMESTAMPDIFF(HOUR, MAX(created_on), NOW()) >= 1,
        'Can proceed',
        'Must wait 1 hour') 
        AS result
    FROM 
        Elemental
    WHERE 
        owner_id = ?;  -- replace ? with the player's ID
    `;

const VALUES = [data.owner_id];

pool.query(SQLSTATMENT, VALUES, callback);
}
//check the command line cuz it is giving 2 results


module.exports.addById = (data, callback) =>
{
    const SQLSTATMENT = `
    UPDATE Elemental
    SET energy = energy + ?
    WHERE id = ?;

    UPDATE User
    SET Elemunchies = Elemunchies - ?
    WHERE id = ?; 
    `;
    
const VALUES = [data.Elemunchies, data.Elem_id, data.Elemunchies, data.userId];
pool.query(SQLSTATMENT, VALUES, callback);
}
