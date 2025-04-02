import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const NotificationContainer = styled.div`
  background-color: #0f171e;
  min-height: 100vh;
  padding: 2rem;
  color: #fff;
`;

const Title = styled.h2`
  color: #fff;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 500;
`;

const NotificationList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 0 auto;
`;

const NotificationItem = styled.li`
  background-color: ${props => props.read ? '#1a242f' : '#252e39'};
  margin-bottom: 1rem;
  padding: 1.5rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Message = styled.span`
  font-size: 1rem;
  color: ${props => props.read ? '#8197a4' : '#fff'};
`;

const ReadButton = styled.button`
  background-color: #00a8e1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #0496c7;
  }
`;

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:5000/api/notifications", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.data) {
                    setNotifications(res.data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(notifications.map((n) => (n._id === id ? { ...n, read: true } : n)));
        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
        <NotificationContainer>
            <Title>Notifications</Title>
            <NotificationList>
                {notifications && notifications.length > 0 ? (
                    notifications.map((n) => (
                        <NotificationItem key={n._id} read={n.read}>
                            <Message read={n.read}>{n.message}</Message>
                            {!n.read && <ReadButton onClick={() => markAsRead(n._id)}>Mark as Read</ReadButton>}
                        </NotificationItem>
                    ))
                ) : (
                    <NotificationItem>
                        <Message>No notifications to display</Message>
                    </NotificationItem>
                )}
            </NotificationList>
        </NotificationContainer>
    );
};

export default Notifications;