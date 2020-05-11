const SHA256 = require('crypto-js/sha256');
const Schemas = require('./schemas.js');


const createUser = async function(profile) {
  profile.password = SHA256(profile.password);
  const user = new Schemas.User(profile);
  return user.save();
}


const getUser = function(username) {
  return Schemas.User.findOne({ username });
}

const login = async function(username, password) {
  const user = await getUser(username);
  if (user == null) {
    throw Error('a user with this username does not exist');
  }
  
  if (user.password !== SHA256(password).toString()) {
    throw Error('incorrect password');
  }
  return user;
}

const getChats = function(_id) {
  return Promise.resolve([])
} 

module.exports = { 
  createUser, 
  getUser,
  login,
  getChats
}