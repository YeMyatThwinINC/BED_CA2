const express = require('express');
const router = express.Router();

const controller = require('../controllers/taskController');

router
.route('/')
.get(controller.readAllTask)
.post(controller.createNewTask); 

router
.route("/:id")
.get(controller.readTaskById)
.put(controller.updateTaskById)
.delete(controller.deleteTaskById);


module.exports = router;