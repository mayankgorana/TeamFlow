import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to WebSocket server

const TeamChat = ({ teamId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!teamId) return;

    socket.emit("joinRoom", teamId); // Join chat room

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]); // Append new message
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [teamId]);

  // Send a message
  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const chatMessage = { teamId, userId, message: newMessage };
    socket.emit("sendMessage", chatMessage); // Send to WebSocket server

    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <h2>Team Chat</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.userId}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TeamChat;
