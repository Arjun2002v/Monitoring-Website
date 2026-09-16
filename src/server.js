const express = require("express");
const cors = require("cors");

const monitorRoutes = require("./routes/monitor.routes");


const app = express();


app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/monitor",monitorRoutes)

const PORT = 5001

app.listen(PORT,()=>{
    console.log(`Running,${PORT}`)
})