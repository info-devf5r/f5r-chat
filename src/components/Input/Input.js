import React from 'react';

import './Input.css';

const Voice = ( { joinVoice, leaveVoice, join, setJoin} ) => {

  const btnClick = () => {
      if(join) { 
        leaveVoice(); 
        setJoin(0); 
      } else {
        joinVoice(); 
        setJoin(1); 
      }
  }

const Input = ({ setMessage, sendMessage, messageToSend }) => (
  <form className="form">
        <button className="sendButton" onClick = { btnClick }> 
        {  join ? 
        <p><i className="fas fa-2x fa-microphone-slash"></i></p> : <p><i className="fas fa-2x fa-microphone voiceicon"></i></p> } 
      </button>
    <input
      className="input" 
      type="text"
      placeholder="Type a message..."
      value={messageToSend}
      onChange={({ target: { value } }) => setMessage(value)}
      onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
    />
    <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
  </form>
)

export default Input;