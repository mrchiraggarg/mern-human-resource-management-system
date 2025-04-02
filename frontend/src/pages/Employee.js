import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";

const DashboardContainer = styled.div`
  background-color: #0f171e;
  min-height: 100vh;
  color: #fff;
  padding: 20px;
`;

const Header = styled.div`
  margin-bottom: 30px;
  h2 {
    color: #00a8e1;
    font-size: 2.5rem;
    margin-bottom: 10px;
  }
  p {
    color: #8197a4;
  }
`;

const Button = styled.button`
  background-color: #00a8e1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #0088b3;
  }
`;

const Form = styled.form`
  background-color: #1a242f;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  input, select {
    background-color: #2a3543;
    border: 1px solid #384557;
    color: white;
    padding: 10px;
    margin: 5px;
    border-radius: 4px;
    
    &:focus {
      outline: none;
      border-color: #00a8e1;
    }
  }
`;

const EmployeeList = styled.ul`
  list-style: none;
  padding: 0;
  
  li {
    background-color: #1a242f;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    button {
      margin-left: 10px;
    }
  }
`;

const Section = styled.div`
  h3, h4 {
    color: #00a8e1;
    margin-bottom: 20px;
  }
`;

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [user, setUser] = useState(null);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [newEmployee, setNewEmployee] = useState({ name: "", email: "", password: "", role: "employee" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/");
                    return;
                }

                const { data } = await axios.get("http://localhost:5000/api/users/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(data);

                if (data.role === "admin") {
                    const employeesRes = await axios.get("http://localhost:5000/api/users/employees", {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setEmployees(employeesRes.data);
                }
            } catch (error) {
                console.error(error);
                navigate("/");
            }
        };

        fetchUser();
    }, [navigate]);

    const handleUpdateEmployee = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const updatedEmployee = { ...editingEmployee };

            await axios.put(`http://localhost:5000/api/users/employees/${editingEmployee._id}`, updatedEmployee, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Employee updated successfully!");
            setEmployees(employees.map(emp => (emp._id === editingEmployee._id ? updatedEmployee : emp)));
            setEditingEmployee(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateEmployee = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.post("http://localhost:5000/api/users/employees", newEmployee, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Employee added successfully!");
            setNewEmployee({ name: "", email: "", password: "", role: "employee" });
            const employeesRes = await axios.get("http://localhost:5000/api/users/employees", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEmployees(employeesRes.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteEmployee = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/users/employees/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Employee deleted successfully!");
            setEmployees(employees.filter((emp) => emp._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardContainer>
            {/* <Header>
                <h2>Welcome, {user?.name}</h2>
                <p>Role: {user?.role}</p>
            </Header> */}

            {user?.role === "admin" ? (
                <Section>
                    <h3>Employee Management</h3>

                    <Form onSubmit={handleCreateEmployee}>
                        <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} required />
                        <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} required />
                        <input type="password" placeholder="Password" value={newEmployee.password} onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} required />
                        <select value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}>
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                        </select>
                        <Button type="submit">Add Employee</Button>
                    </Form>

                    <h4>Employee List</h4>
                    <EmployeeList>
                        {employees.map((emp) => (
                            <li key={emp._id}>
                                <span>{emp.name} - {emp.email}</span>
                                <div>
                                    <Button onClick={() => setEditingEmployee(emp)}>Edit</Button>
                                    <Button onClick={() => handleDeleteEmployee(emp._id)}>Delete</Button>
                                </div>
                            </li>
                        ))}
                    </EmployeeList>

                    {editingEmployee && (
                        <Form onSubmit={handleUpdateEmployee}>
                            <h4>Edit Employee</h4>
                            <input type="text" value={editingEmployee.name} onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })} required />
                            <input type="email" value={editingEmployee.email} onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })} required />
                            <select value={editingEmployee.role} onChange={(e) => setEditingEmployee({ ...editingEmployee, role: e.target.value })}>
                                <option value="employee">Employee</option>
                                <option value="admin">Admin</option>
                            </select>
                            <Button type="submit">Update</Button>
                            <Button type="button" onClick={() => setEditingEmployee(null)}>Cancel</Button>
                        </Form>
                    )}
                </Section>
            ) : (
                <Section>
                    <h3>Employee Dashboard</h3>
                    <p>Welcome! You can apply for leave and check your attendance.</p>
                </Section>
            )}
        </DashboardContainer>
    );
};

export default Employee;