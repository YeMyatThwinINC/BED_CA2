const express = require('express');
const router = express.Router();

const controller = require('../controllers/elementalController');
const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router
.route('/')
.get(controller.readAllElem);

router
.route("/feed")
.post(jwtMiddleware.verifyToken, controller.feedByAmount);

router
.route('/user/:user_id')
.get(userController.readElemByUserId);

router
.route('/:id')
.get(controller.readElemById);



module.exports = router;
