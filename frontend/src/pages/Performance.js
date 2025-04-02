import React, { useEffect, useState } from "react";
import axios from "axios";

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

  // ✅ Add Performance Review (Admin)
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
    <div>
      <h2>Performance Management</h2>

      {/* ✅ Admin Adds Performance Review */}
      {user?.role === "admin" && (
        <form onSubmit={addReview}>
          <select value={newReview.employee} onChange={(e) => setNewReview({ ...newReview, employee: e.target.value })} required>
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
            ))}
          </select>
          <input type="number" placeholder="Rating (1-5)" min="1" max="5" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })} required />
          <textarea placeholder="Feedback" value={newReview.feedback} onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })} required />
          <button type="submit">Add Review</button>
        </form>
      )}

      {/* ✅ Display Performance Reviews */}
      <h3>{user?.role === "admin" ? "All Performance Reviews" : "My Reviews"}</h3>
      <ul>
        {performanceReviews.map((review) => (
          <li key={review._id}>
            {user?.role === "admin" && <strong>{review.employee.name} ({review.employee.email}): </strong>}
            {review.rating} ⭐ - {review.feedback} (Reviewed by: {review.reviewer.name})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Performance;
