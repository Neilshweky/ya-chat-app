/**
 * Template from https://reactjsexample.com/react-messenger/
 */
import React from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import '../style/Messenger.css';
import { API_URL, checkError } from './Utilities';
import socketIOClient from "socket.io-client";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

export default class Main extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    this.state = {
      activeChat: {},
      socket: null,
      chats: []
    }

    this.setActiveChat = this.setActiveChat.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount = async () => {
    const { history } = this.props;
    let username = window.localStorage.getItem('username') 
    if (!username) {
      history.push('/login')
      console.log("NEEDS AUTH")
      return
    }

    await this.getChats(username)
    const socket = socketIOClient(API_URL);
    socket.emit('login', username)
    this.setState({ socket })
    this.state.chats.forEach(chat => socket.emit('join chat', chat._id))

    socket.on('new chat', chat => {
      let chats = this.state.chats  
      chats.unshift(chat);
      this.setState({ chats })
    })
    
  }

  getChats = username => {
    return fetch(API_URL + '/getchats/' + username)
      .then(checkError)
      .then(chats => {
        this.setActiveChat(chats[0]._id)
        this.setState({ chats });

      })
      .catch(console.log)
  }

  moveChatToFront = (_id, message=null) => {
    console.log("movings chat up...", _id)
    let chats = this.state.chats;
    let chat = chats.find(chat => chat._id === _id)
    if(chat) {
      if (message && chat.messages) chat.messages = [message]
      chats = chats.filter(chat => chat._id !== _id)
      chats.unshift(chat)
      this.setState({ chats })
    }
  }


  setActiveChat(_id) {
    console.log("_id: ", _id)
    fetch(API_URL + "/getchat?_id="+_id)
      .then(checkError)
      .then(chat => {
        // if (this.state.activeChat._id) 
        //   this.state.socket.emit('leave chat', this.state.activeChat._id)
        this.setState({ activeChat: chat })
      })
      .catch(console.log)
  }
  handleClose = () => {
    this.setState({ show: false })
  }
  
  handleShow = () => {
    this.setState({ show: true })
  }

  createChat = () => {
    let username = window.localStorage.getItem('username').trim()
    let usernames = document.getElementById('chat-users').value.split(',').map(s => s.trim())
    usernames.push(username);
    console.log(usernames)
    fetch(API_URL + "/createchat", {
      method: 'POST',
      body: JSON.stringify({ usernames }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(checkError)
      .then(chat => {
        this.state.socket.emit('new chat', chat)
        this.handleClose()
      })
      .catch(err => {
        document.getElementById('create-error').innerHTML = err;
      })


  }

  render() { 
    return (
      <>
        <div className="messenger">
          <div className="scrollable sidebar">
            <ConversationList setChat={this.setActiveChat} chats={this.state.chats} socket={this.state.socket} handleShow={this.handleShow} />
          </div>

          <div className="scrollable content">
            <MessageList activeChat={this.state.activeChat} moveChat={this.moveChatToFront} socket={this.state.socket} />
          </div>
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Chat</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Input the usernames of the people you would like to add as a comma separated list!
            <input
              type="text"
              className="form-control"
              id="chat-users"
              />
            <p id="create-error" style={{color:'red'}}></p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.createChat}>
              Create Chat!
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}