import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "employee" });
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:5000/api/users/register", formData);
            alert("Registration successful!");
            navigate("/"); // Redirect to login page
        } catch (err) {
            // alert(err.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register</h2>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

            <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
            </select>

            <button type="submit">Register</button>
        </form>
    );
};

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("employee"); // Default role
//   const [message, setMessage] = useState("");
//   const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "employee" });
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post("http://localhost:5000/api/users/register", {
//         name,
//         email,
//         password,
//         role,
//       });
//       setMessage(res.data.message);
//       navigate("/"); // Redirect to login page
//     } catch (err) {
//       setMessage(err.response.data.message);
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       {message && <p>{message}</p>}
//       <form onSubmit={handleRegister}>
//         <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
//         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="employee">Employee</option>
//           <option value="admin">Admin</option>
//         </select>
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

export default Register;
