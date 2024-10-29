const express = require('express');
const router = express.Router();
const {pingController} = require('../../controllers')
const userRouter = require('./user-routes')

router.get('/ping',pingController.ping)
router.use('/user',userRouter);

module.exports = router;