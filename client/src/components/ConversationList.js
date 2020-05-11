import React from 'react';
// import ConversationSearch from '../ConversationSearch';
import ConversationListItem from './ConversationListItem';
import Toolbar from './Toolbar';
import ToolbarButton from './ToolbarButton';
import IosCog from 'react-ionicons/lib/IosCog'
import IosAddCircleOutline from 'react-ionicons/lib/IosAddCircleOutline'

import '../style/ConversationList.css';

export default class ConversationList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      chats: []
    }
  }

  componentDidMount() {
    this.getConversations()
  }

  getConversations() {
    let chat = {
      _id: "123",
      members: [
        {
          "_id" : "5eb8aae9f74a83dbe289e5e0",
          "chats" : [ ],
          "firstName" : "Neil",
          "lastName" : "Shweky",
          "email" : "neilshweky@gmail.com",
          "username" : "neilshweky",
          "__v" : 0
        }
      ],
      messages: []
    }
    let chats = []
    for (var i = 0; i < 10; i++) chats.push(chat)
    this.setState({ chats })

    // axios.get('https://randomuser.me/api/?results=20').then(response => {
    //     let newConversations = response.data.results.map(result => {
    //       return {
    //         photo: result.picture.large,
    //         name: `${result.name.first} ${result.name.last}`,
    //         text: 'Hello world! This is a long message that needs to be truncated.'
    //       };
    //     });
    //     setConversations([...conversations, ...newConversations])
    // });
  }
  render() {
    return (
      <div className="conversation-list">
        <Toolbar
          title="Messenger"
          leftItems={[
            <IosCog className="toolbar-button" key="cog" fontSize="28px" color="#007aff" />
          ]}
          rightItems={[
            <IosAddCircleOutline className="toolbar-button" key="cog" fontSize="28px" color="#007aff" />
          ]}
        />
        {/* <ConversationSearch /> */}
        {
          this.state.chats.map((conversation, i) =>
            <ConversationListItem
              key={conversation._id + ' ' + i}
              data={conversation}
            />
          )
        }
      </div>
    );
  }
}