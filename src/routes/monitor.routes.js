const express = require("express")
const { createMonitor, checkWebsite, storeResults, getAllMonitors, updateMonitorController, deleteMonitorController, getMonitorChecksController } = require("../controllers/monitor.controllers");
const authMiddleware = require("../middlware/auth-middleware");


const router = express.Router()

router.use(authMiddleware);

router.post("/",createMonitor)
router.get("/",getAllMonitors)

router.post("/check",checkWebsite)
router.post("/store",storeResults)

router.delete("/:id", deleteMonitorController);

router.put("/:id", updateMonitorController);
router.get("/:id/checks", getMonitorChecksController);

    

module.exports = router