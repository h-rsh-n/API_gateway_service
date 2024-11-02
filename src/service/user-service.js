const {StatusCodes} = require('http-status-codes');
const { UserRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const {Enums} = require('../utils/common')
const {Auth} = require('../utils/common');

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();

async function signup(data) {
  try {
    const user = await userRepository.create(data);
    const role = await roleRepository.getRoleByname(Enums.userRole.CUSTOMER);
    user.addRole(role);
    return user;
  } catch (error) {
    if(error.name == 'SequelizeUniqueConstraintError'){
      let explanation = [];
      error.errors.forEach(element => {
        explanation.push(element.message);
      });
      throw new AppError(explanation,StatusCodes.BAD_REQUEST);
    }
  }
  throw new AppError('Failed to create a new User',StatusCodes.INTERNAL_SERVER_ERROR);
}

async function signin(data) {
  try {
    const user = await userRepository.getByEmail(data.email);
    if(!user){
      throw new AppError(`No user with given email exists`,StatusCodes.NOT_FOUND);
    }
    const checkPassword = Auth.comparePassword(user.password,data.password);
    if(!checkPassword){
      throw new AppError(`Wrong Password`,StatusCodes.BAD_REQUEST);
    }
    const jwt = Auth.generateJWT({id:user.id,email:user.email});
    return jwt;
  } catch (error) {
    if(error instanceof AppError) throw error;
    throw new AppError(`Something went wrong while signin`,StatusCodes.INTERNAL_SERVER_ERROR)
  }
}

async function checkAuth(token) {
  try {
    if(!token){
      throw new AppError('Missing JWT token',StatusCodes.BAD_REQUEST);
    }
    const response = Auth.verifyJWT(token);
    const user = await userRepository.get(response.id);
    if(!user){
      throw new AppError(`No user found`,StatusCodes.NOT_FOUND);
    }
    return response;
  } catch (error) {
    if(error instanceof AppError){
      throw error;
    }
    if(error.name == 'JsonWebTokenError') {
      throw new AppError('Invalid JWT token', StatusCodes.BAD_REQUEST);
    }
    if(error.name == 'TokenExpiredError') {
        throw new AppError('JWT token expired', StatusCodes.BAD_REQUEST);
    }
    throw new AppError('Something went wrong while Authentication',StatusCodes.BAD_REQUEST)
  }
}


async function addRole(data){
  try {
    const user = await userRepository.get(data.id);
    if(!user){
      throw new AppError(`No user found with the given id`,StatusCodes.NOT_FOUND);
    }
    const role = await roleRepository.getRoleByname(data.role);
    if(!role){
      throw new AppError(`No role found`,StatusCodes.NOT_FOUND);
    }
    user.addRole(role);
    return user;
  } catch (error) {
    if(error instanceof AppError) throw error;
    throw new AppError('Something went wrong while adding role',StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function isAdmin(data) {
  try {
    const user = await userRepository.get(data);
    if(!user){
      throw new AppError(`No user found with given id`,StatusCodes.NOT_FOUND);
    }
    const adminRole = await roleRepository.getRoleByname(Enums.userRole.ADMIN);
    if(!adminRole){
      throw new AppError(`No role found`,StatusCodes.NOT_FOUND);
    }
    return user.hasRole(adminRole)
  } catch (error) {
    console.log(error);
    if(error instanceof AppError) throw error;
    throw new AppError('Something went wrong while authorizaton',StatusCodes.INTERNAL_SERVER_ERROR);
  }
}
module.exports = {
  signup,
  signin,
  checkAuth,
  addRole,
  isAdmin
}
