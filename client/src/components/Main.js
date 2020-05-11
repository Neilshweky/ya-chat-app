/**
 * Template from https://reactjsexample.com/react-messenger/
 */
import React from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import '../style/Messenger.css';


export default class Main extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    this.state = {
      activeChat: ""
    }

    this.setActiveChat = this.setActiveChat.bind(this);
  }

  checkError(res) {
    console.log(res.status)
    if(!res.ok) {
      let error = new Error("there was an error")
      error.status = res.status
      throw error;
    }
    return res.json()
  }
  // React function that is called when the page load.
  componentDidMount() {
    const { history } = this.props;

    if (!window.localStorage.getItem('username')) {
      history.push('/login')
      console.log("NEEDS AUTH")
      return
    }
    fetch('http://localhost:8080/getchats')
      .then(this.checkError)
      .then(res => console.log('HERE', res))
      .catch(err => {
        if (err.status === 401) {
          history.push('/login')
        } else console.log("ERR", err)
      })
  }

  setActiveChat(_id) {
    console.log("_id: ", _id)
    this.setState({ activeChat: _id })
  }

  render() { 
    return (
      <div className="messenger">
        <div className="scrollable sidebar">
          <ConversationList setChat={this.setActiveChat} />
        </div>

        <div className="scrollable content">
          <MessageList activeChat={this.state.activeChat}/>
        </div>
      </div>
    );
  }
}