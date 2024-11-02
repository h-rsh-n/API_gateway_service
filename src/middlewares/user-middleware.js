const { StatusCodes } = require("http-status-codes");
const { errorMessage } = require("../utils/common");
const AppError = require("../utils/errors/app-error");
const {userService} = require('../service');
const { error } = require("../utils/common/success");

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

function validateAddRole(req,res,next){
  const fields = ['id','role'];
  const missingFileds = [];
  fields.forEach((field)=>{
    if(!req.body[field]){
      missingFileds.push(`${field} is missing in the request`);
    }
  })
  if(missingFileds.length){
    errorMessage.message = `Something went wrong`
    errorMessage.error = new AppError(missingFileds,StatusCodes.BAD_REQUEST);
    return res.status(StatusCodes.BAD_REQUEST).json(errorMessage)
  }
  next();
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
    if(error.statusCode == undefined){
      error.statusCode =  StatusCodes.BAD_REQUEST,
      errorMessage.error = error.message
    }
    return res.status(error.statusCode).json(errorMessage);
  }
}

async function isAdmin(req,res,next) {
  try {
    const response = await userService.isAdmin(req.user.id);
    if(!response){
      throw error
    } 
    next();
  } catch (error) {
    errorMessage.message = `User not authorized`;
    errorMessage.error = new AppError(`Authorization failed`,StatusCodes.UNAUTHORIZED);
    return res.status(StatusCodes.UNAUTHORIZED).json(errorMessage);
  }
}
module.exports = {
  validateRequest,
  checkAuth,
  isAdmin,
  validateAddRole
}