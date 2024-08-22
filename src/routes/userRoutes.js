//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const express = require('express');

const userController = require('../controllers/userController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');
//////////////////////////////////////////////////////
// CREATE ROUTER
//////////////////////////////////////////////////////
const router = express.Router();


//////////////////////////////////////////////////////
// DEFINE ROUTES
//////////////////////////////////////////////////////
router
.route("/")
.get(userController.readAllUser);

router
.route("/purchase")
.post(jwtMiddleware.verifyToken, userController.purchaseRandomElem)

router
.route("/:id")
.get(userController.readUserById)
.put(userController.updateUserById)
.delete(jwtMiddleware.verifyToken, userController.deleteUserById);

router
.route('/:user_id/summon/:id')
.put(jwtMiddleware.verifyToken, userController.updateSummonedElem);



//////////////////////////////////////////////////////
// EXPORT ROUTER
//////////////////////////////////////////////////////
module.exports = router;


