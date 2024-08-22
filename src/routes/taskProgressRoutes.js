const express = require('express');
const router = express.Router();

const controller = require('../controllers/taskProgressController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
.route('/')
.get(controller.readAllProgress)
.post(jwtMiddleware.verifyToken, controller.createNewProgress); 

router
.route("/user/:id")
.get(controller.readProgressByUserId)

router
.route("/:id")
.get(controller.readProgressById)
.put(controller.updateProgressById, controller.readProgressById)
.delete(controller.deleteProgressById); 


module.exports = router;