const express = require("express");
const cors = require("cors");

const monitorRoutes = require("./routes/monitor.routes");
const { startMonitoring } = require("./services/monitor.schedular");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
    });
});

app.use("/api/monitors", monitorRoutes);

// Use the in-process scheduler only for learning. BullMQ is the default path.
if (process.env.ENABLE_SCHEDULER === "true") {
    startMonitoring().catch((error) => {
        console.error("Unable to start scheduler:", error.message);
    });
}

// Return a useful JSON response when a client sends malformed JSON.
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400) {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON body. Remove trailing commas and use double-quoted property names."
        });
    }

    return next(error);
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
