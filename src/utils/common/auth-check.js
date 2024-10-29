const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {serverConfig} = require('../../config')

function comparePassword(encryptedPassword,password) {
  try {
    return bcrypt.compareSync(password, encryptedPassword);
  } catch (error) {
    throw error;
  }
}

function generateJWT(data){
  try {
    return jwt.sign(data,serverConfig.JWT_SECRET,{expiresIn:serverConfig.EXPIRES_IN})
  } catch (error) {
    throw error
  }
}

function verifyJWT(token){
  try {
    return jwt.verify(token,serverConfig.JWT_SECRET)
  } catch (error) {
    throw error
  }
}
module.exports = {
  comparePassword,
  generateJWT,
  verifyJWT
}