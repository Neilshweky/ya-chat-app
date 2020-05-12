import React from 'react';
import '../style/Compose.css';
import MdSend from 'react-ionicons/lib/MdSend'
import { API_URL, checkError } from './Utilities';

export default class Compose extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      show: false
    }
  }

  
  submit = () => {
    let message = document.getElementById("compose-message").value
    let username = window.localStorage.getItem('username')
    fetch(API_URL + "/sendmessage", {
      method: 'POST',
      body: JSON.stringify({
        sender: username,
        message,
        chatID: this.props._id
      }),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(checkError)
      .then(message => {
        message._id = this.props._id
        this.props.socket.emit('chat message', message)
        this.props.socket.emit('empty', { room:this.props._id })
        document.getElementById("compose-message").value = ""
        this.props.moveChat(this.props._id)
      })
      .catch(console.log)
  }

  messageChanged = e => {
    let text = e.target.value;
    let username = window.localStorage.getItem('username')
    let _id = this.props._id
    if (!text || text === '') {
      this.props.socket.emit('empty', { room:_id })
    } else {
      this.props.socket.emit('typing', { username, room:_id })
    }
  }

  

  render() {
    return (
      <div className="compose">
        <input
          id="compose-message"
          type="text"
          className="compose-input"
          placeholder="Type a message"
          size="60"
          onChange={this.messageChanged}
          onKeyPress={event => {
            if (event.key === 'Enter') {
              this.submit()
            }
          }}
        />
      <MdSend 
          key="info" 
          className="toolbar-button" 
          fontSize="28px" 
          color="#007aff" 
          onClick={this.submit}/>
      </div>
    );
  }
}