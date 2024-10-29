const { StatusCodes } = require("http-status-codes");
const { errorMessage } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const {userService} = require('../service')

function validateRequest(req,res,next){
  const fields = ['email','password'];
  const missingFileds = [];
  fields.forEach((field)=>{
    if(!req.body[field]){
      missingFileds.push_back(`${field} is missing in the request`)
    }
  })
  if(missingFileds.length){
    errorMessage.message = `Something went wrong!`
    errorMessage.error = new AppError(missingFileds,StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage)
  }
  next()
}

async function checkAuth(req,res,next){
  try {
    const token = req.headers['authorization'].split(' ')[1]
    const response = await userService.checkAuth(token);
    if(response){
      req.user = response;
      next();
    }
  } catch (error) {
    return res.status(error.statusCode).json(error);
  }
}

module.exports = {
  validateRequest,
  checkAuth
}