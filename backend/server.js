import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
// import { createSuperAdmin } from "./seedSuperAdmin.js";

dotenv.config();

const app = express();

// ----------- CORS Setup -----------
app.use(cors({
  origin: "https://resolve-os.vercel.app", // your deployed frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// ----------- Database Connection -----------
connectDB();
// createSuperAdmin();

// ----------- HTTP & Socket.io Server Setup -----------
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://resolve-os.vercel.app", // frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Example: listen for custom events
  // socket.on("message", (data) => console.log(data));
});

// ----------- API Routes -----------
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// ----------- Start Server -----------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
