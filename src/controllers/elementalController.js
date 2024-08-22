const model = require("../models/elementalModel.js");

module.exports.readAllElem = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllElem:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.readElemById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readElemById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Elemental not found"
                });
            }
            else {
                    res.status(200).json(results[0]);//putting index so it will remove []
                } 
        }
    }

    model.selectById(data, callback);
}

module.exports.readByOwnerId = (req, res, next) =>
{
    const data = {
        owner_id: req.params.player_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readByOwnerId:", error);
            res.status(500).json(error);
        } else res.status(200).json({
            message: `Count of Conjurable elementals: ${results.length}`,
            elementals: results});
    }

    model.selectByOwnerId(data, callback);
}


module.exports.createRandomElem = (req, res, next, lastPlayerId) => //no print 
{
    const data = {
        owner_id: req.params.player_id
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createRandomElem:", error);
            res.status(500).json(error);
        } else if (next) {
            // If 'next' is provided, it's being used as middleware
            next();
        } else {
            // If 'next' is not provided, it will respond
            const responseMessage = {
                elemental_id: results.insertId,
                message: `New Elemental is added to Player: ${req.params.player_id}`,
                tips: `Feed munchies to the elementals to make them stronger!!`
              };
              res.status(201).json(responseMessage);
        }
    }

    model.insertRandom(data, callback);
}
module.exports.createRandomElemRespond = (req, res) => {
    // making new function with new parameter to provide info for another function 
    // Since 'next' is not provided, it will send a response
    module.exports.createRandomElem(req, res);
};


module.exports.checkTime = (req, res, next) => {
    const data = {
        owner_id: req.params.player_id
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error check ID:", error);
            res.status(500).json(error);
        } else if (results[0][0].result == 'Can proceed') {
            next()
        } else res.status(400).json({
            message: "Please wait an hour before hunting"
        })    
    }

    model.oneHourCheck(data, callback);
}

module.exports.checkOwnership = (req, res, next) => {
    const data = {
        owner_id: req.params.player_id,
        id: req.params.id
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error check Ownership:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({message: "The selected is not your Elemental."})
        } else next();     
    }

    model.selectOnlyRel(data, callback);
}

module.exports.summonedEnergy = (req, res, next) => {
    
    const data = {
        active_elemental: req.active_elemental
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error energyCompare", error);
            res.status(500).json(error);
        } else if (req.active_elemental== null) {
            res.status(404).json({message: "Player has not summoned any Elemental"})
        } else {req.energy=results[0].energy;
            next(); 
        }     
    }

    model.selectById(data, callback);
}

module.exports.feedByAmount = (req, res, next) =>
{
    if(req.body.Elemunchies == undefined || req.body.Elemunchies <= 0 || isNaN(req.body.Elemunchies))
    {
        res.status(400).send("Error: Elemunchies must be greater than zero.");
        return;
    }

    
    const data = {
        Elemunchies: req.body.Elemunchies,
        Elem_id: req.body.Elem_id,
        userId: res.locals.userId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error feedByAmount:", error);
            res.status(500).json(error);
        } else res.status(200).json({message: `Elemental id: ${data.id} has been successfully fed ${data.Elemunchies} Elemunchies.`});
    }

    model.addById(data, callback);
}