const pool = require('../services/db');

module.exports.selectAll = (callback) =>
{
    const SQLSTATMENT = `
    SELECT * FROM ElementalDex;
    `;

pool.query(SQLSTATMENT, callback);
}