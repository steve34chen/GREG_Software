const express = require("express");
const router = express.Router();

const {
        MonitorTray,
        RegisterUpperTray,
        UnregisterUpperTray,
        UpperTrayInfo,
        GenerateQRcode,
        WaterPlant,
        ReceiveTaskID,
        RunTrayTasks,
        generateTable
} = require("../controllers/trayController");

router.post("/monitor", MonitorTray);
router.post("/registerUpperTray", RegisterUpperTray);
router.post("/unregisterUpperTray", UnregisterUpperTray);
router.get("/traysInfo", UpperTrayInfo);
router.get("/QRCode", GenerateQRcode);
router.post("/water_plant", WaterPlant);
router.put("/receive_taskID",ReceiveTaskID);
router.post("/run_schedule",RunTrayTasks);
router.get("/create_table",generateTable)


module.exports = router;