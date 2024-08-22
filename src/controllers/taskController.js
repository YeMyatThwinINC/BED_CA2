const model = require("../models/taskModel.js");

module.exports.readAllTask = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllTask:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.createNewTask = (req, res, next) => //no print 
{
    if(req.body.title == undefined || req.body.description == undefined || req.body.points == undefined || req.body.points <= 0)
    {
        res.status(400).json({
            message: "Information incorrect.",
          });
        return;
    }

    const data = {
        title: req.body.title,
        description: req.body.description,
        points: req.body.points
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error createNewTask:", error);
            res.status(500).json(error);
        } else res.status(201).json({
                task_id: results.insertId,
                ...req.body     //3 dot operation
            });
        }
    

    model.insertSingle(data, callback);
}

module.exports.readTaskById = (req, res, next) =>
{
    const data = {
        task_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readTaskById:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "Task not found"
                });
            }
            else {
                    res.status(200).json(results[0]);//putting index so it will remove []
                } 
        }
    }

    model.selectById(data, callback);
}

module.exports.updateTaskById = (req, res, next) =>
{
    if(req.body.title == undefined || req.body.description == undefined || req.body.points == undefined)
    {
        res.status(400).json({
            message: "Error: Information incorrect."
        });
        return;
    }

    const data = {
        task_id: req.params.id, //from url
        title: req.body.title,
        description: req.body.description,
        points: req.body.points
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateTaskById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Task not found"
                });
            }
            else res.status(200).json({
                task_id: req.params.id,
                ...req.body
            }); 
        }
    }

    model.updateById(data, callback);
}

module.exports.deleteTaskById = (req, res, next) =>
{
    const data = {
        task_id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteTaskById:", error);
            res.status(500).json(error);
        } else {
            if(results[0].affectedRows == 0) 
            {
                res.status(404).json({
                    message: "Task not found"
                });
            }
            else res.status(204).send(); // 204 No Content            
        }
    }

    model.deleteById(data, callback);
}

module.exports.checkId = (req, res, next) => {
    const data = {
        task_id: req.params.id || req.body.task_id
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error check ID:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({message: "Task not found."})
        } else next();     
    }

    model.selectById(data, callback);
}