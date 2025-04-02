import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Training = () => {
  const [user, setUser] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [newTraining, setNewTraining] = useState({ title: "", description: "", date: "", trainer: "" });

  useEffect(() => {
    const fetchUserAndTrainings = async () => {
      const token = localStorage.getItem("token");

      const userRes = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data);

      const trainingRes = await axios.get("http://localhost:5000/api/training", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainings(trainingRes.data);
    };

    fetchUserAndTrainings();
  }, []);

  const addTraining = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/training", newTraining, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Training added!");
    setNewTraining({ title: "", description: "", date: "", trainer: "" });
    window.location.reload();
  };

  const enrollTraining = async (id) => {
    const token = localStorage.getItem("token");

    await axios.post(`http://localhost:5000/api/training/${id}/enroll`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Enrolled successfully!");
    window.location.reload();
  };

  return (
    <Container>
      <PageTitle>Employee Training & Development</PageTitle>

      {["admin", "hr"].includes(user?.role) && (
        <FormContainer onSubmit={addTraining}>
          <Input type="text" placeholder="Title" value={newTraining.title} onChange={(e) => setNewTraining({ ...newTraining, title: e.target.value })} required />
          <TextArea placeholder="Description" value={newTraining.description} onChange={(e) => setNewTraining({ ...newTraining, description: e.target.value })} required />
          <Input type="date" value={newTraining.date} onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })} required />
          <Input type="text" placeholder="Trainer Name" value={newTraining.trainer} onChange={(e) => setNewTraining({ ...newTraining, trainer: e.target.value })} required />
          <Button type="submit">Add Training</Button>
        </FormContainer>
      )}

      <SectionTitle>Available Training Sessions</SectionTitle>
      <TrainingGrid>
        {trainings.map((training) => (
          <TrainingCard key={training._id}>
            <TrainingTitle>{training.title}</TrainingTitle>
            <TrainingDescription>{training.description}</TrainingDescription>
            <TrainerInfo>Trainer: {training.trainer}</TrainerInfo>
            <TrainingDate>Date: {new Date(training.date).toLocaleDateString()}</TrainingDate>
            {training.attendees.some((attendee) => attendee._id === user?.id) ? (
              <EnrolledBadge>✅ Enrolled</EnrolledBadge>
            ) : (
              <EnrollButton onClick={() => enrollTraining(training._id)}>Enroll Now</EnrollButton>
            )}
          </TrainingCard>
        ))}
      </TrainingGrid>
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: #0f171e;
  min-height: 100vh;
  color: #fff;
`;

const PageTitle = styled.h2`
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 2rem;
  border-bottom: 2px solid #1a242f;
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  color: #fff;
  margin: 2rem 0;
`;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: #1a242f;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #2c3b4a;
  border-radius: 4px;
  background: #1a242f;
  color: #fff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #00a8e1;
  }
`;

const TextArea = styled.textarea`
  padding: 0.8rem;
  border: 1px solid #2c3b4a;
  border-radius: 4px;
  background: #1a242f;
  color: #fff;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #00a8e1;
  }
`;

const Button = styled.button`
  padding: 1rem;
  background: #00a8e1;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0088b3;
  }
`;

const TrainingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const TrainingCard = styled.div`
  background: #1a242f;
  border-radius: 8px;
  padding: 1.5rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TrainingTitle = styled.h4`
  font-size: 1.4rem;
  color: #00a8e1;
  margin-bottom: 1rem;
`;

const TrainingDescription = styled.p`
  color: #ccc;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const TrainerInfo = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TrainingDate = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const EnrollButton = styled.button`
  width: 100%;
  padding: 0.8rem;
  background: #00a8e1;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0088b3;
  }
`;

const EnrolledBadge = styled.p`
  text-align: center;
  color: #00a8e1;
  font-weight: bold;
  padding: 0.8rem;
  background: rgba(0, 168, 225, 0.1);
  border-radius: 4px;
`;

export default Training;