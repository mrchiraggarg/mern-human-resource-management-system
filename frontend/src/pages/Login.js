import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(to bottom, #000000, #1a242f);
  color: white;
`; 

const LoginBox = styled.div`
  background: rgba(0, 0, 0, 0.75);
  padding: 60px 68px 40px;
  border-radius: 4px;
  width: 100%;
  max-width: 450px;
`;

const Title = styled.h2`
  color: white;
  font-size: 32px;
  margin-bottom: 28px;
  font-weight: 500;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Input = styled.input`
  padding: 16px 20px;
  border-radius: 4px;
  border: none;
  background-color: #1a242f;
  color: white;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    background-color: #233343;
  }

  &::placeholder {
    color: #8c8c8c;
  }
`;

const Button = styled.button`
  padding: 16px;
  border-radius: 4px;
  border: none;
  background-color: #0f79af;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #1899d6;
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <LoginContainer>
      <LoginBox>
        <Title>Sign In</Title>
        <StyledForm onSubmit={handleLogin}>
          <Input 
            type="email" 
            placeholder="Email" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <Button type="submit">Sign In</Button>
        </StyledForm>
      </LoginBox>
    </LoginContainer>
  );
};

export default Login;