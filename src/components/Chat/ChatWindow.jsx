import React, { useEffect, useState, useRef } from "react";
import { collection, doc, onSnapshot, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import AuthStore from "../../store/AuthStore";

import { timeAgo } from "../../utils/timeAgo";

const ChatWindow = ({ selectedFriend }) => {
  const authUser = AuthStore((state) => state.user);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const bottomRef = useRef();

  const chatId = [authUser.uid, selectedFriend?.id].sort().join("_");
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!selectedFriend) return;

    const chatRef = doc(firestore, "chats", chatId);
    setMessages([]);

    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        setMessages(docSnap.data().messages || []);
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, [selectedFriend]);

  const sendMessage = async () => {
    if (!newMsg.trim()) return;

    const chatRef = doc(firestore, "chats", chatId);

    const message = {
      senderId: authUser.uid,
      text: newMsg.trim(),
      timestamp: Date.now(),
    };


    try {
      await setDoc(
        chatRef,
        {
          users: [authUser.uid, selectedFriend.id],
          messages: arrayUnion(message),
        },
        { merge: true }
      );
      setNewMsg("");
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!selectedFriend) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
        <p>Select a friend to start chatting</p>
        <h1 className="text-2xl font-bold">&lt;/&gt; NEXUS</h1>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-950 border-l border-gray-700">
      <div className="px-4 py-2 border-b border-gray-700 font-semibold text-white">
        Chatting with: {selectedFriend.username || selectedFriend.email}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`w-fit max-w-[60%] p-2 rounded-xl ${
              msg.senderId === authUser.uid
                ? "bg-yellow-500 self-end ml-auto"
                : "bg-gray-700 self-start mr-auto"
            }`}
          >
            <p className="text-xl mr-20">{msg.text}</p>
            <p className="text-xs text-gray-300 text-right">
              {timeAgo(new Date(msg.timestamp))} ago
            </p>
          </div>
        ))
        
        }
       
        <div ref={bottomRef}></div>
      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded outline-none mb-4"
        />
        <button
          onClick={sendMessage}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded mb-4"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
