const SHA256 = require('crypto-js/sha256');
const Schemas = require('./schemas.js');
const moment = require('moment')

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

const getChats = function(username) {
  return Schemas.Chat.find( { members : { $elemMatch: { username } } }, { messages : { $slice: -1 } } )
                     .sort( { lastUsed: -1 } )
} 

const getChat = function(_id) {
  return Schemas.Chat.findOne( { _id }, { messages : { $slice: -20 } } )
}

const createChat = async function(usernames) {
  let users = await Schemas.User.find( 
    { username: { $in : usernames } }, 
    { firstName: 1, lastName: 1, username: 1 } 
  )
  console.log("USERS", users)
  if (users.length !== usernames.length) throw Error('Invalid usernames.')
  const chatObj = {
    members: users,
    lastUsed: moment().unix()
  }
  const chat = new Schemas.Chat(chatObj);
  return chat.save();
}
const sendMessage = function(chatID, sender, message) {
  const messageObj = {
    message,
    sender,
    timestamp: moment().unix()
  }
  console.log(chatID)
  return Schemas.Chat.updateOne(
    { _id: chatID },
    { $push: { messages: messageObj }, lastUsed: moment().unix() }
  ).then(() => messageObj)
}

module.exports = { 
  createUser, 
  getUser,
  login,
  getChat,
  getChats,
  createChat,
  sendMessage
}