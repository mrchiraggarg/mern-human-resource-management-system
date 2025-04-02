import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import styled from "styled-components";

const socket = io("http://localhost:5000", {
    withCredentials: true,
    extraHeaders: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
});

const ChatContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #0f171e;
  color: #fff;
  min-height: 100vh;
`;

const ChatHeader = styled.h2`
  color: #00a8e1;
  font-size: 24px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #1a2c3d;
`;

const MessagesContainer = styled.div`
  height: 60vh;
  overflow-y: auto;
  padding: 20px;
  background-color: #1a2c3d;
  border-radius: 8px;
  margin-bottom: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #0f171e;
  }

  &::-webkit-scrollbar-thumb {
    background: #00a8e1;
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  margin: 10px 0;
  padding: 10px 15px;
  border-radius: 12px;
  max-width: 70%;
  word-wrap: break-word;
  ${({ isSender }) => isSender ? `
    margin-left: auto;
    background-color: #00a8e1;
  ` : `
    margin-right: auto;
    background-color: #2d4253;
  `}
`;

const MessageSender = styled.span`
  font-weight: bold;
  color: #fff;
  margin-bottom: 5px;
  display: block;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px;
  border-radius: 4px;
  border: none;
  background-color: #1a2c3d;
  color: #fff;
  font-size: 16px;

  &:focus {
    outline: 2px solid #00a8e1;
  }

  &::placeholder {
    color: #8197a4;
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background-color: #00a8e1;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0088b3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Chat = ({ user, selectedUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        if (selectedUser) {
            const fetchMessages = async () => {
                try {
                    const token = localStorage.getItem("token");
                    const res = await axios.get(`http://localhost:5000/api/chats/${selectedUser._id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            withCredentials: true,
                            'Content-Type': 'application/json'
                        },
                        withCredentials: true
                    });
                    if (res.data) {
                        setMessages(res.data);
                    }
                } catch (error) {
                    console.error("Error fetching messages:", error);
                }
            };
            fetchMessages();
        }
    }, [selectedUser]);

    useEffect(() => {
        socket.on("receiveMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });

        return () => socket.off("receiveMessage");
    }, []);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const messageData = { receiver: selectedUser._id, message: newMessage };

            const res = await axios.post("http://localhost:5000/api/chats", messageData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            if (res.data) {
                socket.emit("sendMessage", { ...res.data, receiverId: selectedUser._id });
                setMessages(prevMessages => [...prevMessages, res.data]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <ChatContainer>
            <ChatHeader>Chat with {selectedUser?.name}</ChatHeader>
            <MessagesContainer>
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <MessageBubble key={msg._id || index} isSender={msg.sender === user._id}>
                            <MessageSender>{msg.sender === user._id ? "You" : selectedUser.name}</MessageSender>
                            {msg.message}
                        </MessageBubble>
                    ))
                ) : (
                    <div>No messages yet</div>
                )}
            </MessagesContainer>
            <InputContainer>
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
                <SendButton onClick={sendMessage}>Send</SendButton>
            </InputContainer>
        </ChatContainer>
    );
};

export default Chat;