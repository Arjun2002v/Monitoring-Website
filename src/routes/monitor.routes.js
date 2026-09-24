const express = require("express")
const { createMonitor, checkWebsite, storeResults, getAllMonitors, updateMonitorController, deleteMonitorController } = require("../controllers/monitor.controllers")

const router = express.Router()

router.post("/",createMonitor)
router.get("/",getAllMonitors)

router.post("/check",checkWebsite)
router.post("/store",storeResults)

router.delete("/:id", deleteMonitorController);

router.put("/:id", updateMonitorController);


module.exports = router