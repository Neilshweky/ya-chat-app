import React, {useEffect} from 'react';
import shave from 'shave';

import '../style/ConversationListItem.css';

export default function ConversationListItem(props) {
  useEffect(() => {
    shave('.conversation-snippet', 20);
  })

    // const { photo, name, text } = props.data;
    let name = props.data.members.reduce((acc, m) => 
                  acc + m.firstName + " " + m.lastName, "")
    let text = "This is a most recent message hellooo there"
    return (
      <div className="conversation-list-item">
        <img className="conversation-photo" src={"https://www.hockeydb.com/ihdb/photos/tony-deangelo-2019-48.jpg"} alt="conversation" />
        <div className="conversation-info">
          <h1 className="conversation-title">{ name }</h1>
          <p className="conversation-snippet">{ text }</p>
        </div>
      </div>
    );
}