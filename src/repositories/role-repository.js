const CrudRepository = require('./crud-repository');
const {Role} = require('../models');
const AppError = require('../utils/errors/app-error');
const {StatusCodes} = require('http-status-codes')
class RoleRepository extends CrudRepository{
  constructor(){
    super(Role)
  }
  async getRoleByname(name){
    const response = await Role.findOne({
      where:{
        name:name
      }
    })
    if(!response){
      throw new AppError(`Cannot find the requested role`,StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = RoleRepository;