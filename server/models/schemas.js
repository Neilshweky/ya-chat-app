const mongoose = require('mongoose');
const moment = require('moment');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/yca';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to mongo', MONGO_URI)).catch(console.log);
mongoose.set('useFindAndModify', false);



const { Schema } = mongoose;
const trim = str => str.trim();


const User = new Schema({
  username: { type: String, required: true, set: trim, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, set: trim },
  lastName: { type: String, required: true, set: trim },
  email: { type: String, required: true, set: trim, unique: true },
  chats: Array
})

const Chat = new Schema({
  members: Array,
  lastUsed: Number,
  messages: [{
    message: String,
    sender: String,
    timestamp: Number 
  }]
})

module.exports = { User: mongoose.model('User', User), Chat: mongoose.model('Chat', Chat) };
