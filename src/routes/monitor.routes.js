const express = require("express")
const { createMonitor } = require("../controllers/monitor.controllers")

const router = express.Router()

router.post("/",createMonitor)

module.exports = router