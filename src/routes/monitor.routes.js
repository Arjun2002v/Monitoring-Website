const express = require("express")
const { createMonitor, checkWebsite, storeResults, getAllMonitors } = require("../controllers/monitor.controllers")

const router = express.Router()

router.post("/",createMonitor)
router.get("/",getAllMonitors)

router.post("/check",checkWebsite)
router.post("/store",storeResults)


module.exports = router