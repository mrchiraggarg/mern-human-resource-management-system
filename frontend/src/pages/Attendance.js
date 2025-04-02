import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Attendance = () => {
    const [user, setUser] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchUserAndAttendance = async () => {
            try {
                const token = localStorage.getItem("token");

                const userRes = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(userRes.data);

                const attendanceRes = userRes.data.role === "admin"
                    ? await axios.get("http://localhost:5000/api/attendance/all", { headers: { Authorization: `Bearer ${token}` } })
                    : await axios.get("http://localhost:5000/api/attendance/my-attendance", { headers: { Authorization: `Bearer ${token}` } });

                setAttendanceRecords(attendanceRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchUserAndAttendance();
    }, []);

    const markAttendance = async () => {
        if (!status) {
            alert("Please select a status");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:5000/api/attendance/mark", { status }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Attendance marked!");
            window.location.reload();
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred while marking attendance");
        }
    };

    return (
        <Container>
            <Title>Attendance Tracking</Title>

            {user?.role === "employee" && (
                <AttendanceForm>
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">Select Status</option>
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="on leave">On Leave</option>
                    </Select>
                    <Button onClick={markAttendance}>Mark Attendance</Button>
                </AttendanceForm>
            )}

            <SubTitle>{user?.role === "admin" ? "All Employees' Attendance" : "My Attendance"}</SubTitle>
            <AttendanceList>
                {attendanceRecords.map((record) => (
                    <AttendanceItem key={record._id}>
                        {user?.role === "admin" && <EmployeeName>{record.employee.name} ({record.employee.email})</EmployeeName>}
                        <AttendanceDetails>
                            <Date>{record.date.split("T")[0]}</Date>
                            <Status status={record.status}>{record.status}</Status>
                        </AttendanceDetails>
                    </AttendanceItem>
                ))}
            </AttendanceList>
        </Container>
    );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #0F171E;
  color: #ffffff;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #00A8E1;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #1A242F;
  padding-bottom: 1rem;
`;

const SubTitle = styled.h3`
  color: #00A8E1;
  font-size: 1.8rem;
  margin: 2rem 0;
`;

const AttendanceForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #1A242F;
  border-radius: 8px;
`;

const Select = styled.select`
  padding: 0.8rem;
  border-radius: 4px;
  background-color: #0F171E;
  color: #ffffff;
  border: 1px solid #00A8E1;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #ffffff;
  }
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #00A8E1;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0077A8;
  }
`;

const AttendanceList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AttendanceItem = styled.li`
  background-color: #1A242F;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateX(10px);
  }
`;

const EmployeeName = styled.strong`
  display: block;
  color: #00A8E1;
  margin-bottom: 0.5rem;
`;

const AttendanceDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Date = styled.span`
  color: #8197A4;
`;

const Status = styled.span`
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  background-color: ${props =>
        props.status === 'present' ? '#1B5E20' :
            props.status === 'absent' ? '#B71C1C' : '#F57F17'};
  color: #ffffff;
`;

export default Attendance;