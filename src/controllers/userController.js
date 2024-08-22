//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const model = require("../models/userModel.js");


//////////////////////////////////////////////////////
// GET ALL PLAYERS BY USER
//////////////////////////////////////////////////////
module.exports.readAllUser = (req, res, next) =>
{
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readAllUser:", error);
            res.status(500).json(error);
        } 
        else res.status(200).json(results);
    }

    model.selectAll(callback);
}

module.exports.readElemByUserId = (req, res, next) =>
{
    const data = {
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readElemByUserId:", error);
            res.status(500).json(error);
        } else res.status(200).json(results);
    }

    model.selectElemById(data, callback);
}


//////////////////////////////////////////////////////
// CONTROLLER FOR LOGIN
//////////////////////////////////////////////////////
module.exports.login = (req, res, next) =>
{
    if(req.body.username == undefined)
    {
        res.status(400).json({
            message: "Error: Information incorrect."
        });
        return;
    } else if(req.body.password== undefined){
        res.status(400).json({
            message: "Error: Please insert password."
        })
    }

    const data = {
        username: req.body.username
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error login:", error);
            res.status(500).json(error);
        } else {
            if(results.length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else {
                res.locals.username= req.body.username;
                res.locals.userId = results[0].id;
                res.locals.hash = results[0].password;
                // res.locals.password= req.body.password; //no need yet
                next(); 
            } 
        }
    }

    model.selectByName(data, callback);
}

//////////////////////////////////////////////////////
// CONTROLLER FOR REGISTER
//////////////////////////////////////////////////////
module.exports.register = (req, res, next) => //no print 
{
    if(req.body.username == undefined || req.body.email == undefined ||req.body.password == undefined)
    {
        res.status(400).send("Error: username,email or password is undefined");
        return;
    }

    const data = {
        username: req.body.username,
        email: req.body.email,
        password: res.locals.hash
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error register:", error);
            res.status(500).json(error);
        } else if (next) {
            // If 'next' is provided, it's being used as middleware
            res.locals.message = `User ${data.username} created successfully.`;
            res.locals.userId = results[0].insertId;
            next();
        } else {
            // If 'next' is not provided, it will respond
            res.status(201).json({
                ...results[1] //the list 
            });
        }
    }

    model.insertUser(data, callback);
}
module.exports.registerRespond = (req, res) => {
    // making new function with new parameter to provide info for another function 
    // Since 'next' is not provided, it will send a response
    module.exports.register(req, res);
};


//////////////////////////////////////////////////////
// MIDDLEWARE FOR CHECK IF USERNAME OR EMAIL EXISTS
//////////////////////////////////////////////////////
module.exports.checkUsernameOrEmailExist = (req, res, next) => {
    if(req.body.username == undefined || req.body.email == undefined)
    {
        res.status(400).send("Error: username or email is undefined");
        return;
    }

    const data = {
        username: req.body.username,
        email: req.body.email
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error checkUsernameOrEmailExist:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            next()
        } else 
        res.status(409).json({message: "Username or email already exists"})
    }

    model.selectByNameOrEmail(data, callback);
}

//////////////////////////////////////////////////////
// MIDDLWARE FOR CHECK IF PLAYER BELONGS TO USER
//////////////////////////////////////////////////////
module.exports.checkId = (req, res, next) => {
    const data = {
        user_id: req.params.id || req.body.user_id
    }
    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error check ID:", error);
            res.status(500).json(error);
        } else if (results.length == 0) {
            res.status(404).json({message: "User not found."})
        } else next();     
    }

    model.selectById(data, callback);
}




module.exports.readUserById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error readUserById:", error);
            res.status(500).json(error);
        } else {
            if(results[0].length == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else {
                res.status(200).json({
                    ...results[0][0],
                    ...results[1][0]});//putting index so it will remove []
                    //done fixing after section A
                
            } 
        }
    }

    model.selectByIdIncludingPts(data, callback);
}


module.exports.updateUserById = (req, res, next) =>
{
    if(req.body.username == undefined || req.body.email == undefined|| req.body.password == undefined)
    {
        res.status(400).json({
            message: "Error: Information incorrect"
        });
        return;
    }

    const data = {
        id: req.params.id, //from url
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateUserById:", error);
            res.status(500).json(error);
        } else {
            if(results.affectedRows == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(204).send(); // 204 No Content
        }
    }

    model.updateById(data, callback);
}

module.exports.deleteUserById = (req, res, next) =>
{
    const data = {
        id: req.params.id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error deleteUserById:", error);
            res.status(500).json(error);
        } else {
            if(results[0].affectedRows == 0) 
            {
                res.status(404).json({
                    message: "User not found"
                });
            }
            else res.status(204).send(); // 204 No Content            
        }
    }

    model.deleteById(data, callback);
}


module.exports.updateSummonedElem = (req, res, next) =>
{
    const data = {
        id: req.params.id, 
        user_id: req.params.user_id
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error updateSummonedElem:", error);
            res.status(500).json(error);
        } else res.status(200).json({
            user_id: req.params.user_id,
                message: `Have successfully summoned Elmental ID: ${req.params.id}.`
            }); 
    }

    model.updateActive(data, callback);
}



module.exports.purchaseRandomElem = (req, res, next) => //no print 
{
    const data = {
        userId: res.locals.userId
    }

    const callback = (error, results, fields) => {
        if (error) {
            console.error("Error purchaseRandomElem:", error);
            res.status(500).json(error);
        } else res.status(201).json(results);
        }
    

    model.insertRandom(data, callback);
}