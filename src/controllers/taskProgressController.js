const model = require("../models/taskProgressModel.js");

module.exports.readAllProgress = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllProgress:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.createNewProgress = (req, res, next) => //no print 
{
    if(res.locals.userId == undefined || req.body.task_id == undefined )
    {
        res.status(400).send("Error: Information incorrect.");
        return;
    }

    const data = {
        user_id: res.locals.userId,
        task_id: req.body.task_id,
        completion_date: req.body.completion_date,
        notes: req.body.notes || null
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewProgress:", error);
            res.status(500).json(error);
        } else 
            res.status(201).json({
                message:`${results[3][0].Elemunchies} Elemunchies has Been rewarded. Please Check User Profile.`,
                progress_id: results[0].insertId,
                ...req.body     //3 dot operation
            });
        }
    

    model.insertSingle(data, callback);
}

module.exports.readProgressByUserId = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readProgressByUserId:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Progress not found"
                });
            }
            else {
                    res.status(200).json(results);
                } 
        }
    }

    model.selectByUserId(data, callback);
}

module.exports.readProgressById = (req, res, next) =>
{
    const data = {
        progress_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readProgressById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Progress not found"
                });
            }
            else {
                    res.status(200).json(results[0]);//putting index so it will remove []
                } 
        }
    }

    model.selectById(data, callback);
}

///no respond////
module.exports.updateProgressById = (req, res, next) =>
{
    if(req.body.notes == undefined)
    {
        res.status(400).json({
            message: "Error: missing Notes."
        });
        return;
    }

    const data = {
        progress_id: req.params.id, //from url
        notes: req.body.notes
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateProgressById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Progress not found"
                });
            }
            else next(); 
        }
    }

    model.updateById(data, callback);
}

module.exports.deleteProgressById = (req, res, next) =>
{
    const data = {
        progress_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteProgressById:", error);
            res.status(500).json(error);
        } else {
            if(results[0].affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Progress not found"
                });
            }
            else res.status(204).send(); // 204 No Content            
        }
    }

    model.deleteById(data, callback);
}


////////////CHECKER//////////////
module.exports.undefinedChecker = (req, res, next) => //no print 
{
    if(req.body.user_id == undefined || req.body.task_id == undefined || req.body.completion_date==undefined)
    {
        res.status(400).send("Error: Information incorrect.");
        return;
    }else next(); 
}