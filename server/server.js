const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();

const app = express();

/* =========================================================
   CORS
========================================================= */

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json());

/* =========================================================
   DATABASE
========================================================= */

let databaseConnection = null;

const ensureDatabaseConnection = async () => {
    if (databaseConnection) {
        return databaseConnection;
    }

    databaseConnection = await connectDB();

    return databaseConnection;
};

/* =========================================================
   ROOT
========================================================= */

app.get("/", async (req, res) => {
    try {
        await ensureDatabaseConnection();

        res.json({
            success: true,
            message:
                "Gold & Silver Lending Management API is running"
        });
    } catch (error) {
        console.error(
            "Database connection error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/api/health", async (req, res) => {
    try {
        await ensureDatabaseConnection();

        res.json({
            success: true,
            message: "Server is healthy",
            database: "connected",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(
            "Health check database error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            timestamp: new Date().toISOString()
        });
    }
});

/* =========================================================
   API ROUTES
========================================================= */

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/users",
    require("./routes/userRoutes")
);

app.use(
    "/api/clients",
    require("./routes/clientRoutes")
);

app.use(
    "/api/loans",
    require("./routes/loanRoutes")
);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });
});

/* =========================================================
   VERCEL EXPORT
========================================================= */

module.exports = app;

/* =========================================================
   LOCAL DEVELOPMENT
========================================================= */

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    const startServer = async () => {
        try {
            await ensureDatabaseConnection();

            app.listen(PORT, () => {
                console.log("");
                console.log(
                    "========================================"
                );
                console.log(
                    " Gold & Silver Lending Management API"
                );
                console.log(
                    "========================================"
                );
                console.log(
                    `Server: http://localhost:${PORT}`
                );
                console.log(
                    `Health: http://localhost:${PORT}/api/health`
                );
                console.log(
                    "========================================"
                );
            });
        } catch (error) {
            console.error(
                "Unable to start server:"
            );
            console.error(error.message);

            process.exit(1);
        }
    };

    startServer();
}
