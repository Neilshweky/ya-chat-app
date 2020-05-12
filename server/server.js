const express = require('express');
const routes = require('./routes/routes.js');
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session');
const morgan = require('morgan')
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(session({
    secret: "somesecretkey",
    resave: false,
    saveUninitialized: true,
    cookie: { 
      path: '/',
      domain: 'http://localhost:3000',
      secure: false },

}))

app.use(morgan('tiny'))

const TIME_TO_EXPIRE = 2592000

app.post('/signup', routes.signup)
app.post('/login', routes.login)
app.get('/', (req, res) => res.send('Hello, World'))


// app.use(function(req, res, next) {
//   console.log(req.session.user)
//   if (!req.session.user || moment().unix() - req.session.user.timestamp > TIME_TO_EXPIRE) {
//     // req.session.user = null
//     res.status(401).send({ message: 'The user needs to be authenticated' })
//   } else {
//     next()
//   }
// })

app.post('/logout', routes.logout)
app.get('/getchats/:username', routes.get_chats)
app.get('/getchat', routes.get_chat)
app.post('/createchat', routes.create_chat);
app.post('/sendmessage', routes.send_message);



console.log('Authors: Neil Shweky (nshweky)');
const port = process.env.PORT || '8080';
let server = app.listen(port, () => {
  console.log('Server running on port ' + port + '. Now open http://localhost:' + port + '/ in your browser!');
});

var socket = require('socket.io');
var io = socket(server);
io.on('connection', function(socket){
    console.log('connected');
    console.log('%s sockets connected', io.engine.clientsCount);

    socket.on('login', username => {
      console.log('logging in')
      socket.join(username)
    })

    socket.on('new chat', function(chat) {
      console.log('creating new chat...')
      chat.members.forEach(member => {
        io.to(member.username).emit('new chat', chat)
      });
    })

    socket.on('join chat', function(room) {
      console.log('joining chat!');
      socket.join(room);
    })

    socket.on('leave chat', function(room) {
      console.log('leaving chat!');
      socket.leave(room);
    })

    socket.on('chat message', function(data){
      let room = data._id
      delete data._id
      console.log('chat message')
      io.to(room).emit('chat message', data);   
    });

    socket.on('typing', function(data) {
      console.log('typing')
      socket.broadcast.to(data.room).emit('typing', data.username);
    })

    socket.on('empty', function(data) {
      console.log('empty')
      socket.broadcast.to(data.room).emit('empty', data);
    })
});