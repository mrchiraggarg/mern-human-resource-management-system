import React, { useEffect, useState } from "react";
import axios from "axios";
import Chat from "./Chat";
import styled from "styled-components";

const Container = styled.div`
  background-color: #0f171e;
  min-height: 100vh;
  padding: 20px;
  color: #fff;
`;

const Title = styled.h2`
  color: #00a8e1;
  font-size: 2rem;
  margin-bottom: 20px;
  font-weight: 500;
`;

const UserList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

const UserCard = styled.li`
  background-color: #1a242f;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;

  &:hover {
    background-color: #233343;
    transform: translateY(-2px);
  }

  ${({ selected }) => selected && `
    background-color: #00a8e1;
    &:hover {
      background-color: #00a8e1;
    }
  `}
`;

const UserName = styled.span`
  font-size: 1.1rem;
  font-weight: 500;
`;

const ChatContainer = styled.div`
  margin-top: 24px;
  background-color: #1a242f;
  border-radius: 12px;
  padding: 20px;
`;

const ChatList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(userRes.data);

      const usersRes = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(usersRes.data.filter((user) => user._id !== userRes.data._id));
    };

    fetchUsers();
  }, []);

  return (
    <Container>
      <Title>Chat with Users</Title>
      <UserList>
        {users.map((user) => (
          <UserCard 
            key={user._id} 
            onClick={() => setSelectedUser(user)}
            selected={selectedUser && selectedUser._id === user._id}
          >
            <UserName>{user.name}</UserName>
          </UserCard>
        ))}
      </UserList>

      {selectedUser && (
        <ChatContainer>
          <Chat user={currentUser} selectedUser={selectedUser} />
        </ChatContainer>
      )}
    </Container>
  );
};

export default ChatList;