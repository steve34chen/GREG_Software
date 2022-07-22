const {
    MonitorTrayStatus,
    RegisterNewUpperTray,
    DeleteUpperTray,
    GetUpperTrayInfo,
    GenerateTrayQRcode,
    WaterTray,
    UpdateUpperTray,
    RunSchedule,
    generateHistoryTable
} = require("../services/TrayService");

const MonitorTray = async (req, res, next) =>{
    try{
        const trayStatus = await MonitorTrayStatus(req);
        res.json(trayStatus);
    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
};
const RegisterUpperTray = async (req, res, next) => {
    try{
        const registerTray = await RegisterNewUpperTray(req);
        res.json(registerTray);
    }catch (err){
        err.msg = "failed to Register upperTray";
        next(err)
    }
};
const UnregisterUpperTray = async (req, res, next) =>{
    try{
        const deleteTray = await DeleteUpperTray(req)
    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
};
const UpperTrayInfo = async (req, res, next) =>{
    try{
        const trayInfo = await GetUpperTrayInfo(req)
        res.json({
            code:200,
            data: trayInfo
        });
    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
}

const GenerateQRcode = async(req, res, next) => {
    try{
        const QRCode = await GenerateTrayQRcode(req)
        res.json(QRCode);
    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
}
const WaterPlant = async (req,res,next) =>{
    try{
        console.log(req.body)
        let deviceID = req.body.deviceID;
        const watered = await WaterTray(deviceID)
        res.json(watered);
    }catch (err){
        err.msg = "failed to water, call Eric 7789568296";
        next(err)
    }
}
const ReceiveTaskID = async (req,res,next) =>{
    try{
        const deviceID = await UpdateUpperTray(req)
        res.json(deviceID)
    }catch (err){
        err.msg = "failed to send";
        next(err)
    }
}

const RunTrayTasks = async (req, res, next) =>{
    try {
        let deviceID = req.body.deviceID
        RunSchedule(deviceID);
    }catch (err){

    }
}
const generateTable = async (req, res, next) =>{
    try{
        const image = generateHistoryTable(req.query.tray_id)
        res.json({
            code:200,
            data: image
        })
    }catch (err){

    }
}
module.exports = {
    MonitorTray,
    RegisterUpperTray,
    UnregisterUpperTray,
    UpperTrayInfo,
    GenerateQRcode,
    WaterPlant,
    ReceiveTaskID,
    RunTrayTasks,
    generateTable
};