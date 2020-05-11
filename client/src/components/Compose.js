import React from 'react';
import '../style/Compose.css';

export default function Compose(props) {
    return (
      <div className="compose">
        <input
          type="text"
          className="compose-input"
          placeholder="Type a message, @name"
        />

        {
          props.rightItems
        }
      </div>
    );
}