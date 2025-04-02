import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const PayrollContainer = styled.div`
  background-color: #0f171e;
  min-height: 100vh;
  padding: 2rem;
  color: #fff;
`;

const Title = styled.h2`
  color: #00a8e1;
  font-size: 2.5rem;
  margin-bottom: 2rem;
`;

const SubTitle = styled.h3`
  color: #fff;
  font-size: 1.8rem;
  margin: 2rem 0;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  max-width: 600px;
  margin-bottom: 2rem;
  background: #1a242f;
  padding: 2rem;
  border-radius: 8px;
`;

const Select = styled.select`
  padding: 0.8rem;
  border: 1px solid #00a8e1;
  background: #1a242f;
  color: #fff;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0f79af;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #00a8e1;
  background: #1a242f;
  color: #fff;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0f79af;
  }
`;

const Button = styled.button`
  background: #00a8e1;
  color: #fff;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: #0f79af;
  }
`;

const PayrollList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
`;

const PayrollItem = styled.li`
  background: #1a242f;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #2c3b4b;
  
  &:hover {
    border-color: #00a8e1;
  }
`;

const EmployeeName = styled.strong`
  color: #00a8e1;
  display: block;
  margin-bottom: 0.5rem;
`;

const PayrollDetails = styled.span`
  color: #8197a4;
`;

const Payroll = () => {
  const [user, setUser] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [newPayroll, setNewPayroll] = useState({ employee: "", basicSalary: "", deductions: "", bonuses: "" });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchUserAndPayroll = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const payrollRes = userRes.data.role === "admin"
        ? await axios.get("http://localhost:5000/api/payroll", { headers: { Authorization: `Bearer ${token}` } })
        : await axios.get("http://localhost:5000/api/payroll/my-payroll", { headers: { Authorization: `Bearer ${token}` } });

      setPayrollRecords(payrollRes.data);

      if (userRes.data.role === "admin") {
        const employeeRes = await axios.get("http://localhost:5000/api/users/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeeRes.data);
      }
    };

    fetchUserAndPayroll();
  }, []);

  const addPayroll = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/payroll", newPayroll, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Payroll added!");
    setNewPayroll({ employee: "", basicSalary: "", deductions: "", bonuses: "" });
    window.location.reload();
  };

  return (
    <PayrollContainer>
      <Title>Payroll Management</Title>

      {user?.role === "admin" && (
        <Form onSubmit={addPayroll}>
          <Select value={newPayroll.employee} onChange={(e) => setNewPayroll({ ...newPayroll, employee: e.target.value })} required>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
            ))}
          </Select>
          <Input type="number" placeholder="Basic Salary" value={newPayroll.basicSalary} onChange={(e) => setNewPayroll({ ...newPayroll, basicSalary: e.target.value })} required />
          <Input type="number" placeholder="Deductions" value={newPayroll.deductions} onChange={(e) => setNewPayroll({ ...newPayroll, deductions: e.target.value })} />
          <Input type="number" placeholder="Bonuses" value={newPayroll.bonuses} onChange={(e) => setNewPayroll({ ...newPayroll, bonuses: e.target.value })} />
          <Button type="submit">Add Payroll</Button>
        </Form>
      )}

      <SubTitle>{user?.role === "admin" ? "All Payroll Records" : "My Payroll"}</SubTitle>
      <PayrollList>
        {payrollRecords.map((record) => (
          <PayrollItem key={record._id}>
            {user?.role === "admin" && <EmployeeName>{record.employee.name} ({record.employee.email})</EmployeeName>}
            <PayrollDetails>
              Salary: INR {record.basicSalary} | Deductions: INR {record.deductions} | Bonuses: INR {record.bonuses} | Net Salary: INR {record.netSalary} | Date: {record.paymentDate.split("T")[0]}
            </PayrollDetails>
          </PayrollItem>
        ))}
      </PayrollList>
    </PayrollContainer>
  );
};

export default Payroll;