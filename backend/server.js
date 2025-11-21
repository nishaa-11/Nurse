const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoutes");
const nurseRoutes = require("./routes/nurseRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");
const shiftRoutes = require("./routes/shiftRoutes");
const surgeRoutes = require("./routes/surgeRoutes");
const locationRoutes = require("./routes/locationRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const errorHandler = require("./middleware/error");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/nurses", nurseRoutes);
app.use("/api/hospitals", hospitalRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/surge", surgeRoutes);
app.use("/api/location", locationRoutes);
app.use("/api/ratings", ratingRoutes);

app.get("/", (req, res) => res.send("API running"));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
