import React from 'react';
// import ConversationSearch from '../ConversationSearch';
import ConversationListItem from './ConversationListItem';
import Toolbar from './Toolbar';
import IosAddCircleOutline from 'react-ionicons/lib/IosAddCircleOutline'


import '../style/ConversationList.css';
// import { checkError } from './Utilities';


export default class ConversationList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chats: [],
      show: false
    }
  }

  componentDidMount() {
  }
 
  componentDidUpdate(previousProps) {
    if (!previousProps.chats ||
        previousProps.chats.length !== this.props.chats.length ||
        (previousProps.chats.length !== 0 && 
        (previousProps.chats[0]._id !== this.props.chats[0]._id))) {
      console.log('updating chat state', this.state.chats)
      if (Array.isArray(this.props.chats))
        this.setState({ chats: this.props.chats })
    }
    if (!previousProps.socket && this.props.socket) {
      this.props.socket.on('chat message', data => {
        let message = data.message
        let chats = this.state.chats;
        if (chats.length >= 1) {
          chats[0].messages = [message]
          this.setState({ chats })
        }

      })
    }
  }


  render() {
    return (
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            // <IosCog className="toolbar-button" key="cog" fontSize="28px" color="#007aff" />
          ]}
          rightItems={[
            <IosAddCircleOutline onClick={this.props.handleShow} className="toolbar-button" key="cog" fontSize="28px" color="#007aff" />
          ]}
        />
        {/* <ConversationSearch /> */}
        {
          this.state.chats.map((conversation, i) =>
            <ConversationListItem
              key={conversation._id + ' ' + i}
              data={conversation}
              setChat={this.props.setChat}
            />
          )
        }
      </div>        
    );
  }
}