const {StatusCodes} = require('http-status-codes');
const {errorMessage,successMessage} = require('../utils/common')
const {userService} = require('../service')

async function signup(req,res){
  try {
    const user = await userService.signup({
      email:req.body.email,
      password:req.body.password
    })
    successMessage.data = user;
    res.status(StatusCodes.CREATED).json(successMessage);
  } catch (error) {
    errorMessage.error = error;
    res.status(error.statusCode).json(errorMessage);
  }
}

async function sigin(req,res){
  try {
    const user = await userService.signin({
      email:req.body.email,
      password:req.body.password
    })
    successMessage.data = user;
    res.status(StatusCodes.OK).json(successMessage);
  } catch (error) {
    if(error.statusCode == undefined){
      error.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
      errorMessage.error.message = error.message
    }
    
    return res.status(error.statusCode).json(errorMessage)
  }
}

module.exports = {
  signup,
  sigin
}