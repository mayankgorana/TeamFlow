import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import "../styles/TeamChat.css";

const TeamChat = () => {
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");

  // Fetch Teams
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "teams"), (snapshot) => {
      const updatedTeams = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTeams(updatedTeams);

      if (updatedTeams.length > 0 && !selectedTeamId) {
        setSelectedTeamId(updatedTeams[0].id);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch Messages for Selected Team
  useEffect(() => {
    if (!selectedTeamId) return;

    const messagesRef = collection(db, `teams/${selectedTeamId}/messages`);
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);

      // Mark messages as read
      newMessages.forEach(async (msg) => {
        if (!msg.read && msg.senderId !== auth.currentUser?.uid) {
          await updateDoc(doc(db, `teams/${selectedTeamId}/messages`, msg.id), {
            read: true,
          });
        }
      });
    });

    return () => unsubscribe();
  }, [selectedTeamId]);

  // Typing Indicator
  useEffect(() => {
    if (!selectedTeamId) return;

    const typingRef = collection(db, `teams/${selectedTeamId}/typing`);
    const unsubscribe = onSnapshot(typingRef, (snapshot) => {
      if (snapshot.empty) {
        setIsTyping(false);
        setTypingUser("");
      } else {
        const typingUsers = snapshot.docs.map((doc) => doc.data().userName);
        setIsTyping(true);
        setTypingUser(typingUsers.join(", "));
      }
    });

    return () => unsubscribe();
  }, [selectedTeamId]);

  // Send Message
  const sendMessage = async () => {
    if (newMessage.trim() === "" || !selectedTeamId || !auth.currentUser) return;

    await addDoc(collection(db, `teams/${selectedTeamId}/messages`), {
      text: newMessage,
      senderId: auth.currentUser.uid,
      senderName: auth.currentUser.displayName || "Anonymous",
      timestamp: serverTimestamp(),
      read: false, // Initially unread
    });

    setNewMessage(""); // Clear input
    await deleteDoc(doc(db, `teams/${selectedTeamId}/typing`, auth.currentUser.uid)); // Remove typing status
  };

  // Handle Typing
  const handleTyping = async (e) => {
    setNewMessage(e.target.value);

    const typingRef = doc(db, `teams/${selectedTeamId}/typing`, auth.currentUser.uid);
    await setDoc(typingRef, { userName: auth.currentUser.displayName }, { merge: true });

    setTimeout(async () => {
      await deleteDoc(typingRef); // Remove typing status after 2 sec
    }, 2000);
  };

  return (
    <div className="chat-container">
      <h1>Team Chat</h1>

      {/* Team Selection */}
      <select className="options-style" onChange={(e) => setSelectedTeamId(e.target.value)} value={selectedTeamId || ""}>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>

      {/* Typing Indicator */}
      {isTyping && <p className="typing-indicator">{typingUser} is typing...</p>}

      {/* Chat Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderId === auth.currentUser?.uid ? "sent" : "received"}`}>
            <p>
              <strong>{msg.senderName}:</strong> {msg.text}
            </p>
            {msg.senderId !== auth.currentUser?.uid && msg.read && <span className="read-receipt">✔ Read</span>}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TeamChat;
