const express = require('express');
const router = express.Router();

const controller = require('../controllers/messageController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

router.get('/', controller.readAllMessage);
router.post('/', jwtMiddleware.verifyToken, controller.createMessage);
router.get('/:id', controller.readMessageById);
router.put('/:id', jwtMiddleware.verifyToken, controller.updateMessageById);
router.delete('/:id', jwtMiddleware.verifyToken, controller.deleteMessageById);

module.exports = router;