import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Performance = () => {
  const [user, setUser] = useState(null);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [newReview, setNewReview] = useState({ employee: "", rating: "", feedback: "" });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchUserAndPerformance = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const performanceRes = userRes.data.role === "admin"
        ? await axios.get("http://localhost:5000/api/performance", { headers: { Authorization: `Bearer ${token}` } })
        : await axios.get("http://localhost:5000/api/performance/my-reviews", { headers: { Authorization: `Bearer ${token}` } });

      setPerformanceReviews(performanceRes.data);

      if (userRes.data.role === "admin") {
        const employeeRes = await axios.get("http://localhost:5000/api/users/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeeRes.data);
      }
    };

    fetchUserAndPerformance();
  }, []);

  const addReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/performance", newReview, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Performance review added!");
    setNewReview({ employee: "", rating: "", feedback: "" });
    window.location.reload();
  };

  return (
    <Container>
      <Title>Performance Management</Title>

      {user?.role === "admin" && (
        <FormContainer onSubmit={addReview}>
          <Select value={newReview.employee} onChange={(e) => setNewReview({ ...newReview, employee: e.target.value })} required>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
            ))}
          </Select>
          <Input 
            type="number" 
            placeholder="Rating (1-5)" 
            min="1" 
            max="5" 
            value={newReview.rating} 
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} 
            required 
          />
          <TextArea 
            placeholder="Feedback" 
            value={newReview.feedback} 
            onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })} 
            required 
          />
          <Button type="submit">Add Review</Button>
        </FormContainer>
      )}

      <SubTitle>{user?.role === "admin" ? "All Performance Reviews" : "My Reviews"}</SubTitle>
      <ReviewList>
        {performanceReviews.map((review) => (
          <ReviewItem key={review._id}>
            <ReviewContent>
              {user?.role === "admin" && <EmployeeName>{review.employee.name} ({review.employee.email})</EmployeeName>}
              <Rating>{Array(parseInt(review.rating)).fill("⭐").join("")}</Rating>
              <Feedback>{review.feedback}</Feedback>
              <Reviewer>Reviewed by: {review.reviewer.name}</Reviewer>
            </ReviewContent>
          </ReviewItem>
        ))}
      </ReviewList>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #00050D;
  color: #fff;
  min-height: 100vh;
`;

const Title = styled.h2`
  color: #00A8E1;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #00A8E1;
  padding-bottom: 1rem;
`;

const SubTitle = styled.h3`
  color: #00A8E1;
  font-size: 1.8rem;
  margin: 2rem 0;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #001424;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.8rem;
  border-radius: 4px;
  background-color: #002137;
  color: #fff;
  border: 1px solid #00A8E1;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #00A8E1;
  }
`;

const Input = styled.input`
  padding: 0.8rem;
  border-radius: 4px;
  background-color: #002137;
  color: #fff;
  border: 1px solid #00A8E1;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #00A8E1;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border-radius: 4px;
  background-color: #002137;
  color: #fff;
  border: 1px solid #00A8E1;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #00A8E1;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background-color: #00A8E1;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0077A8;
  }
`;

const ReviewList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  gap: 1rem;
`;

const ReviewItem = styled.li`
  background-color: #001424;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const ReviewContent = styled.div`
  padding: 1.5rem;
`;

const EmployeeName = styled.strong`
  display: block;
  color: #00A8E1;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const Rating = styled.div`
  margin: 0.5rem 0;
  font-size: 1.2rem;
`;

const Feedback = styled.div`
  margin: 1rem 0;
  line-height: 1.5;
`;

const Reviewer = styled.div`
  color: #888;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

export default Performance;