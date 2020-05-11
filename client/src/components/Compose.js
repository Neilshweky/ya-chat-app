import React from 'react';
import '../style/Compose.css';
import MdSend from 'react-ionicons/lib/MdSend'

export default function Compose(props) {
    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
          size="60"
        />
      <MdSend 
          key="info" 
          className="toolbar-button" 
          fontSize="28px" 
          color="#007aff" 
          onClick={() => { console.log("sending message...") }}/>

      
      </div>
    );
}