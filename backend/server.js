import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import performanceRoutes from "./routes/performanceRoutes.js";
import trainingRoutes from "./routes/trainingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Use CORS Middleware
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true
}));

app.use(express.json()); // Allow JSON requests

// Apply role-based access control (RBAC)
app.use("/api/attendance", attendanceRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/performance", performanceRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/users", userRoutes); // Only admin can manage users

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "hrms",
}).then(() => {
    console.log("MongoDB Connected Successfully");
}).catch((err) => {
    console.error("MongoDB Connection Error:", err);
});

app.get("/", (req, res) => {
    res.send("HR Management System API is running...");
});

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("sendMessage", (data) => {
        io.to(data.receiverId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));