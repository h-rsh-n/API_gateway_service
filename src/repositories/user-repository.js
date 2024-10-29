const CrudRepository = require('./crud-repository');
const {User} = require('../models');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

class UserRepository extends CrudRepository{
  constructor(){
    super(User)
  }
  async getByEmail(email){
    const response = await User.findOne({
      where:{
        email:email
      }
    })
    if(!response){
      throw new AppError(`Requested item not found`,StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = UserRepository