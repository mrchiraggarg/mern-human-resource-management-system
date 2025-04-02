import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LeaveManagement from "./pages/LeaveManagement";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChatList from "./pages/ChatList";
import Training from "./pages/Training";
import Notifications from "./pages/Notifications";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leaves" element={<LeaveManagement />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/performance" element={<Performance />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/training" element={<Training />} />
        <Route path="/chat" element={<ChatList />} />
      </Routes>
    </Router>
  );
}

export default App;
