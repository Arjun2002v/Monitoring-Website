const express = require("express")
const { createMonitor, checkWebsite, storeResults } = require("../controllers/monitor.controllers")

const router = express.Router()

router.post("/",createMonitor)

router.post("/check",checkWebsite)
router.post("/store",storeResults)

module.exports = router