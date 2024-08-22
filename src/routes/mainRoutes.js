//////////////////////////////////////////////////////
// REQUIRE MODULES
//////////////////////////////////////////////////////
const express = require('express');
const userRoutes = require('./userRoutes');
const messageRoutes = require('./messageRoutes');

const jwtMiddleware = require('../middlewares/jwtMiddleware');
const bcryptMiddleware = require('../middlewares/bcryptMiddleware');
const userController = require('../controllers/userController');
const elementalDexRoutes = require('./elementalDexRoutes'); 
const elementalRoutes = require('./elementalRoutes'); 
const taskRoutes = require('./taskRoutes');
const taskProgressRoutes = require('./taskProgressRoutes');

//////////////////////////////////////////////////////
// CREATE ROUTER
//////////////////////////////////////////////////////
const router = express.Router();


//////////////////////////////////////////////////////
// DEFINE ROUTES
//////////////////////////////////////////////////////

router.use("/user", userRoutes);
router.use("/message", messageRoutes);
router.use("/Dex", elementalDexRoutes);
router.use("/elemental", elementalRoutes);
router.use("/task", taskRoutes);
router.use("/taskProgress", taskProgressRoutes);

router.get("/jwt/verify", jwtMiddleware.verifyToken, jwtMiddleware.showTokenVerified); //for checking token works or not
router.post("/login", userController.login, bcryptMiddleware.comparePassword, jwtMiddleware.generateToken, jwtMiddleware.sendToken);
router.post("/register", userController.checkUsernameOrEmailExist, bcryptMiddleware.hashPassword, userController.register, jwtMiddleware.generateToken, jwtMiddleware.sendToken);

//////////////////////////////////////////////////////
// EXPORT ROUTER
//////////////////////////////////////////////////////
module.exports = router;





