import React from 'react';
import Compose from './Compose';
import Toolbar from './Toolbar';
import Message from './Message';
import moment from 'moment';
import MdLogOut from 'react-ionicons/lib/MdLogOut'
import {
	Redirect
} from 'react-router-dom';

// import { API_URL, checkError } from './Utilities';

import '../style/MessageList.css';


export default class MessageList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      messages: [],
      name: "",
      redirect: null
    }
  }
  
  componentDidMount() {
    console.log("HERE I AM", this.props.activeChat)

    // this.getMessages()

    // console.log("ACTIVE",this.props.activeChat)
  }
  
  componentDidUpdate(previousProps) {
    
    let container = document.getElementById("mcontainer")
    if (container) container.scrollIntoView(false);
        
    if (previousProps.activeChat._id !== this.props.activeChat._id){
      console.log('hey', this.props.activeChat)
      let username = window.localStorage.getItem('username')
      let name = !this.props.activeChat.members || this.props.activeChat.members.length === 1 ? "No One" :
                  this.props.activeChat.members.reduce((acc, m) => 
                      acc + 
                      (username === m.username ? "" : m.firstName + " " + m.lastName + ", "), ""
                  ).slice(0,-2)
      this.setState({ messages: this.props.activeChat.messages, name })
    }

    if (!previousProps.socket && this.props.socket) {
      this.props.socket.on('chat message', message => {
        let messages = this.state.messages;
        messages.push(message)
        this.setState({ messages })
        this.renderMessages()
        document.getElementById("mcontainer").scrollIntoView(false);
      })

      this.props.socket.on('typing', username => {
        
        console.log('typing!')
        let name = this.state.name.split(' - ')[0] + " - " + username + " is typing..."
        this.setState({ name })
      })
      this.props.socket.on('empty', () => {
      
        console.log('empty!')
        let name = this.state.name.split(' - ')[0]
        this.setState({ name })
      })
    }
  }

  logout = () => {
    window.localStorage.removeItem('username')
    this.setState({ redirect: '/login' })
  }
       
  renderMessages = () => {
    let MY_USER_ID = window.localStorage.getItem('username')
    let i = 0;
    let messages = this.state.messages
    let messageCount = messages.length;
    let tempMessages = [];

    while (i < messageCount) {
      let previous = messages[i - 1];
      let current = messages[i];
      let next = messages[i + 1];
      let isMine = current.sender === MY_USER_ID;
      let currentMoment = moment(current.timestamp*1000);
      let prevBySameAuthor = false;
      let nextBySameAuthor = false;
      let startsSequence = true;
      let endsSequence = true;
      let showTimestamp = true;

      if (previous) {
        let previousMoment = moment(previous.timestamp*1000);
        let previousDuration = moment.duration(currentMoment.diff(previousMoment));
        prevBySameAuthor = previous.sender === current.sender;
        
        if (prevBySameAuthor && previousDuration.as('hours') < 1) {
          startsSequence = false;
        }

        if (previousDuration.as('hours') < 1) {
          showTimestamp = false;
        }
      }

      if (next) {
        let nextMoment = moment(next.timestamp*1000);
        let nextDuration = moment.duration(nextMoment.diff(currentMoment));
        nextBySameAuthor = next.sender === current.sender;

        if (nextBySameAuthor && nextDuration.as('hours') < 1) {
          endsSequence = false;
        }
      }

      tempMessages.push(
        <Message
          key={i}
          isMine={isMine}
          startsSequence={startsSequence}
          endsSequence={endsSequence}
          showTimestamp={showTimestamp}
          data={current}
        />
      );

      // Proceed to the next message.
      i += 1;
    }

    return tempMessages;
  }

  

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return(
      <div className="message-list">
        <Toolbar
          title={this.state.name}
          rightItems={[
            <MdLogOut onClick={this.logout} key="info" className="toolbar-button" fontSize="28px" color="#007aff" />,
          ]}
        />

        <div className="message-list-container" id="mcontainer">{this.renderMessages()}</div>

        <Compose _id={this.props.activeChat._id} moveChat={this.props.moveChat} socket={this.props.socket} />
      </div>
    );
  }
}