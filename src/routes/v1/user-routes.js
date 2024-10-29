const express = require('express');
const router = express.Router();
const {userController} = require('../../controllers');
const {pingController} = require('../../controllers')
const {userMiddleware} = require('../../middlewares')

router.get('/ping',userMiddleware.checkAuth,pingController.ping)
router.post('/signup',userMiddleware.validateRequest,userController.signup);
router.post('/signin',userMiddleware.validateRequest,userController.sigin)
module.exports = router;