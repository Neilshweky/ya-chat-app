const db = require('../models/database.js');
const moment = require('moment')

const errorMessageForError = err => {
  if (err instanceof Error) {
    if (!!err.code) {
      const codes = {
        11000: "there is already an account with this username."
      }
      return codes[`${err.code}`] || err
    } else {
      console.log("HERE!!!", err.message)
      return err.message 
    }
  } else return err
}


const missing_params = params => singletonify(params).reduce((acc, cur) => acc + cur + ", ", "missing params: ").slice(0,-2)
const singletonify = item => Array.isArray(item) ? item : [item]
const checkMissingParams = arr => !singletonify(arr).reduce((acc, cur) => acc && (cur !== undefined && cur !== null), true)


const signup = (req, res) => {

  console.log("signing up")
  let params = ['firstName', 'lastName', 'email', 'username', 'password']
  let body = params.map(p => req.body[p]);
  if (checkMissingParams(body)) {
    res.status(400).send(missing_params(params));
  } else {
    db.createUser(params.reduce((acc, key) => { acc[key] = req.body[key]; return acc }, {}))
      .then((data) => 
        res.status(201).send({ message: `${data.username} is now logged in.`, data })
      )
      .catch(err => res.status(500).send({ message: errorMessageForError(err) }));
  }
};

// Route for '/login', checks correct authentication
const login = (req, res) => {  
  console.log(req.session.user)
  if (!req.body.username || !req.body.password) {
    res.status(400).send('please enter username and password to log in.');
  } else {
    const { username, password } = req.body;
    db.login(username, password)
      .then(data => 
        res.status(200).send({ message: `${username} is now logged in.`, data })
      )
      .catch((err) => res.status(500).send({ message: errorMessageForError(err) }));
  }
};

const logout = function(req, res) {
  const username = req.session.user.username;
  req.session.user = null
  res.status(200).send({ message: `${username} was logged out`})
}


const get_chats = function(req, res) {
  if (!req.params.username) {
    res.status(400).send('please enter username');
    return
  }
  db.getChats(req.params.username)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(errorMessageForError(err)))
}

const get_chat = function(req, res) {
  if (!req.query._id) {
    res.status(400).send('please enter _id');
    return
  }
  db.getChat(req.query._id)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(errorMessageForError(err)))
}

const create_chat = function(req, res) {
  if (!req.body.usernames || req.body.usernames.length === 0) {
    res.status(400).send('please enter usernames');
    return
  }
  db.createChat(req.body.usernames)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(errorMessageForError(err)))
}

const send_message = function(req, res) {
  if (!req.body.chatID || !req.body.sender || !req.body.message) {
    res.status(400).send('please enter chat id, sender, message');
    return
  }
  db.sendMessage(req.body.chatID, req.body.sender, req.body.message)
    .then(data => res.status(200).send(data))
    .catch(err => res.status(500).send(errorMessageForError(err)))
}


module.exports = {
  signup,
  login,
  logout,
  get_chats,
  create_chat,
  send_message,
  get_chat
}