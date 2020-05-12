import React from 'react';
// import shave from 'shave';
import ellipsis from 'text-ellipsis'
import '../style/ConversationListItem.css';

export default function ConversationListItem(props) {

  let setChat = () => {
    props.setChat(props.data._id)
  }
  // const { photo, name, text } = props.data;
  let username = window.localStorage.getItem('username')
  let name = props.data.members.reduce((acc, m) => 
                acc + 
                (username === m.username ? "" : m.firstName + " " + m.lastName + ", "), ""
            ).slice(0,-2)
  name = name === "" ? "no one" : name;
  let text = props.data.messages && props.data.messages[0] ? props.data.messages[0].message : "You have joined the chat";
  text = ellipsis(text, 35)
  return (
    <div className="conversation-list-item" onClick={setChat}>
      <img className="conversation-photo" src={"https://www.hockeydb.com/ihdb/photos/tony-deangelo-2019-48.jpg"} alt="conversation" />
      <div className="conversation-info">
        <h1 className="conversation-title">{ name }</h1>
        <p className="conversation-snippet">{ text }</p>
      </div>
    </div>
  );
}