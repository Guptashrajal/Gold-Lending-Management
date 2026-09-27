const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Gold & Silver Lending Management API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is healthy",
        database: "connected",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/loans", require("./routes/loanRoutes"));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log("");
        console.log("========================================");
        console.log(" Gold & Silver Lending Management API");
        console.log("========================================");
        console.log(`Server: http://localhost:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log("========================================");
    });
};

startServer();
