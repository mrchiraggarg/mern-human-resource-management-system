import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #0f171e;
  color: #fff;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #00a8e1;
  font-size: 2.5rem;
  margin-bottom: 30px;
`;

const SubTitle = styled.h3`
  color: #fff;
  font-size: 1.8rem;
  margin: 20px 0;
`;

const Form = styled.form`
  display: grid;
  gap: 15px;
  max-width: 600px;
  margin-bottom: 30px;
  background: #1a242f;
  padding: 20px;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #1a242f;
  border-radius: 4px;
  background: #252e39;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #00a8e1;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  background: #00a8e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;

  &:hover {
    background: #0084b3;
  }
`;

const LeaveList = styled.ul`
  list-style: none;
  padding: 0;
`;

const LeaveItem = styled.li`
  background: #1a242f;
  margin: 10px 0;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeaveInfo = styled.div`
  flex: 1;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ApproveButton = styled(Button)`
  background: #2ecc71;
  &:hover {
    background: #27ae60;
  }
`;

const RejectButton = styled(Button)`
  background: #e74c3c;
  &:hover {
    background: #c0392b;
  }
`;

const Status = styled.span`
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  background: ${props => 
    props.status === 'approved' ? '#2ecc71' :
    props.status === 'rejected' ? '#e74c3c' : '#f1c40f'};
`;

const LeaveManagement = () => {
  const [user, setUser] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [newLeave, setNewLeave] = useState({ startDate: "", endDate: "", reason: "" });

  useEffect(() => {
    const fetchUserAndLeaves = async () => {
      try {
        const token = localStorage.getItem("token");

        const userRes = await axios.get("http://localhost:5000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        const leaveRes = userRes.data.role === "admin"
          ? await axios.get("http://localhost:5000/api/leave", { headers: { Authorization: `Bearer ${token}` } })
          : await axios.get("http://localhost:5000/api/leave/my-leaves", { headers: { Authorization: `Bearer ${token}` } });

        setLeaves(leaveRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserAndLeaves();
  }, []);

  const handleLeaveRequest = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      await axios.post("http://localhost:5000/api/leave", newLeave, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Leave request submitted!");
      setNewLeave({ startDate: "", endDate: "", reason: "" });
      window.location.reload();
    } catch (error) {
      console.error("Error submitting leave request:", error);
      alert("Failed to submit leave request");
    }
  };

  const handleLeaveStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`http://localhost:5000/api/leave/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(`Leave ${status}`);
      window.location.reload();
    } catch (error) {
      console.error("Error updating leave status:", error);
      alert("Failed to update leave status");
    }
  };

  return (
    <Container>
      <Title>Leave Management</Title>

      {user?.role === "employee" && (
        <Form onSubmit={handleLeaveRequest}>
          <Input 
            type="date" 
            value={newLeave.startDate} 
            onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })} 
            required 
          />
          <Input 
            type="date" 
            value={newLeave.endDate} 
            onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })} 
            required 
          />
          <Input 
            type="text" 
            placeholder="Reason" 
            value={newLeave.reason} 
            onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })} 
            required 
          />
          <Button type="submit">Request Leave</Button>
        </Form>
      )}

      <SubTitle>{user?.role === "admin" ? "All Leave Requests" : "My Leave Requests"}</SubTitle>
      <LeaveList>
        {leaves.map((leave) => (
          <LeaveItem key={leave._id}>
            <LeaveInfo>
              {user?.role === "admin" && <strong>{leave.employee.name} ({leave.employee.email})</strong>}
              <p>{leave.startDate} to {leave.endDate}</p>
              <p>Reason: {leave.reason}</p>
              <Status status={leave.status}>{leave.status.toUpperCase()}</Status>
            </LeaveInfo>
            {user?.role === "admin" && leave.status === "pending" && (
              <ButtonGroup>
                <ApproveButton onClick={() => handleLeaveStatus(leave._id, "approved")}>
                  Approve
                </ApproveButton>
                <RejectButton onClick={() => handleLeaveStatus(leave._id, "rejected")}>
                  Reject
                </RejectButton>
              </ButtonGroup>
            )}
          </LeaveItem>
        ))}
      </LeaveList>
    </Container>
  );
};

export default LeaveManagement;