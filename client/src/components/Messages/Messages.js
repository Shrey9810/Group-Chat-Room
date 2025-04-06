import React, { useEffect, useRef } from 'react';
import Message from '../Message/Message';

import './Messages.css';

const Messages = ({ messages = [], name = '' }) => {
  const messagesEndRef = useRef(null);

  // Scroll to the bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Trigger scroll when messages array updates

  return (
    <div className="messagesContainer messages">
      {messages.map((message, i) => (
        <div key={i}>
          <Message message={message} name={name} />
        </div>
      ))}
      {/* Invisible element to scroll to */}
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default Messages;
