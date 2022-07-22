const http = require('http');
const Tray = require("../model/tray");
const System = require("../model/system");
const User = require("../model/user")
const qr = require('qr-image');
const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
const chartistSvg = require('svg-chartist');
const sharp = require("sharp")
const fs = require('fs');

// const node_echarts = require('node-echarts');


const MonitorTrayStatus = async (req) => {
    try {
        // let TrayId = mongoose.Types.ObjectId(req.body.deviceID);
        let system_id = req.body.systemID;
        let session = await Tray.startSession();
        let system = await System.findById(mongoose.Types.ObjectId(system_id));
        let user = await User.findById(mongoose.Types.ObjectId(system.user_id))
        let update0 = {
            "moisture_level": req.body.tray1,
            "$push": {
                "moisture_history": req.body.tray1,
                "moisture_history_time":  Date.now()
            }

            // "status": 1,
        }
        let update1 = {
            "moisture_level": req.body.tray2,
            "$push": {
                "moisture_history": req.body.tray1,
                "moisture_history_time":  Date.now()
            }
        }
        let  update2 = {
            "moisture_level": req.body.tray3,
            "$push": {
                "moisture_history": req.body.tray2,
                "moisture_history_time":  Date.now()
            }
        }
        let systemUpdate = {
            "water_level":req.body.waterlevel
        }
        if(req.body.waterlevel < 20){
            sendEmailToUser(user.username)
        }
        session.startTransaction();
        let a = await Tray.findOneAndUpdate({position: 0, system_id:system_id},update0);
        let b = await Tray.findOneAndUpdate({position: 1, system_id:system_id},update1);
        let c = await Tray.findOneAndUpdate({position: 2, system_id:system_id},update2);
        let d = await System.findByIdAndUpdate(mongoose.Types.ObjectId(system_id),systemUpdate)
        await session.commitTransaction();
        session.endSession();

        // if(tray_info.status == 0){
        //     if(req.body.moisture_level < 40){
        //         // sendHttpRequest('/water_plant', TrayId);
        //         WaterTray(TrayId)
        //         let update = {
        //             "moisture_level": req.body.moisture_level,
        //             "status": 1,
        //         }
        //         let a = await Tray.findByIdAndUpdate(TrayId, update);
        //         // let data = JSON.stringify({
        //         //     deviceID: TrayId,
        //         // })
        //         // let options = {
        //         //     host: '192.168.1.200',
        //         //     port: 5000,
        //         //     path: '/water_plant',
        //         //     method: 'POST',
        //         //     headers: {
        //         //         'Content-Type': 'application/json',
        //         //         'Content-Length': data.length
        //         //     }
        //         // }
        //         // let reaspberryRequest = http.request(options, res => {
        //         //     res.on('data', d => {
        //         //         process.stdout.write(d)
        //         //     })
        //         // })
        //         //
        //         // reaspberryRequest.on('error', error => {
        //         //     console.error(error)
        //         // })
        //         // reaspberryRequest.write(data)
        //         // reaspberryRequest.end()
        //     }else if(40 < req.body.moisture_level < 60){
        //         var date = new Date();
        //         console.log("db: " + tray_info.last_time_watered)
        //         console.log("current date: " + date)
        //
        //         var FIVE_MIN=5*60*1000;
        //
        //         if((date - tray_info.last_time_watered) > FIVE_MIN) {
        //             let response = await sendHttpRequest('/water_plant', TrayId);
        //         }
        //
        //         // let data = JSON.stringify({
        //         //     deviceID: TrayId,
        //         // })
        //         // let options = {
        //         //     host: '192.168.1.200',
        //         //     port: 5000,
        //         //     path: '/water_plant',
        //         //     method: 'POST',
        //         //     headers: {
        //         //         'Content-Type': 'application/json',
        //         //         'Content-Length': data.length
        //         //     }
        //         // }
        //         // let reaspberryRequest = http.request(options, res => {
        //         //     res.on('data', d => {
        //         //         process.stdout.write(d)
        //         //     })
        //         // })
        //         //
        //         // reaspberryRequest.on('error', error => {
        //         //     console.error(error)
        //         // })
        //         // reaspberryRequest.write(data)
        //         // reaspberryRequest.end()
        //         let update = {
        //             "moisture_level": req.body.moisture_level,
        //             "status": 1,
        //         }
        //         let a = await Tray.findByIdAndUpdate(TrayId, update);
        //     }else{
        //         let update = {
        //             "moisture_level": req.body.moisture_level,
        //             "status": 1,
        //         }
        //         let a = await Tray.findByIdAndUpdate(TrayId, update);
        //         return a
        //     }
        // }else if(tray_info.status == 1){
        //     return 0
        // }
    }catch(err){

    }

};

const RegisterNewUpperTray = async (req) =>{
    try {
        console.log("register")
        let update = {
            "plant_name": req.body.plant_name,
            "plant_type": req.body.plant_type,
            "interval": req.body.interval,
            "registered": true
        };
        let deviceID = mongoose.Types.ObjectId(req.body.deviceID);
        let position = req.body.position;
        let interval = req.body.interval;
        let a = await Tray.findByIdAndUpdate(deviceID, update);
        let response = await sendRegisterHttpRequest('/register_tray', deviceID,position,interval)
        return {
            code: 200,
            data: a,
            message: "Successfully Registered"
        }

    }catch(err) {


    }
};
const DeleteUpperTray = async (req,res,next) =>{
    try{
        console.log(req.body)
        let deviceID = req.body.deviceID;
        let response = await sendUnRegisterHttpRequest('/unregister_tray', deviceID);
        let update = {
            registered: false
        }
        let a = await Tray.findByIdAndUpdate(deviceID,update);
        return {message: "Successfully UnRegistered"}
    }catch (e){

    }

}

const GetUpperTrayInfo = async (req) => {
    let tray_lists = await Tray.find({ system_id: req.query.system_id}).exec();
    return tray_lists
}

const GenerateTrayQRcode = async(req) => {
    try{
        console.log("generate tray qr code")
        const position = req.query.position
        const system_id = req.query.system_id
        const new_tray = new Tray({
            plant_type: "",
            plant_name: "",
            status: 0,
            system_id: system_id,
            position: position,
            registered: false
        });
        let a = await new_tray.save();
        const id = a._id.toString() ;
        const info = id + "," + position;
        console.log(info)
        let qr_png = qr.imageSync(info, { type: 'png' });
        let base64 = 'data:image/png;base64,' + Buffer(qr_png).toString('base64');

        return base64
    }catch (err){

    }
}


const sendRegisterHttpRequest = async (requestOption, deviceID,position,interval) =>{
    try{
        let data = JSON.stringify({
            deviceID: deviceID,
            position: position,
            timeINT: interval
        })
        let options = {
            host: '192.168.1.200',
            port: 5000,
            path: requestOption,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let newReaspberryRequest = http.request(options, res => {
            res.on('data', d => {
                process.stdout.write(d)
            })
        })
        newReaspberryRequest.on('error', error => {
            // console.error(error)
        })
        newReaspberryRequest.write(data)
        newReaspberryRequest.end()
        return newReaspberryRequest
    }catch (err){

    }

}

const sendUnRegisterHttpRequest = async (requestOption,deviceID,res,next)=>{
    try{
        let data = JSON.stringify({
            deviceID: deviceID,
        })
        let options = {
            host: '192.168.1.200',
            port: 5000,
            path: requestOption,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let newReaspberryRequest = http.request(options, res => {
            res.on('data', d => {
                process.stdout.write(d)
            })
        })
        newReaspberryRequest.on('error', error => {
            // console.error(error)
        })
        newReaspberryRequest.write(data)
        newReaspberryRequest.end()
        return newReaspberryRequest
    }catch (err){

    }
}
const sendEmailToUser = async(username,res,next) =>{
    let transporter = nodemailer.createTransport({
        // host: 'smtp.ethereal.email',
        service: 'Gmail', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
        port: 587, // SMTP 端口
        secureConnection: true, // 使用了 SSL
        auth: {
            user: 'steve34chen@gmail.com',
            // 这里密码不是qq密码，是你设置的smtp授权码
            pass: 'gyvichguqulkvdye',
        }
    });

    let mailOptions = {
        from: 'steve34chen@gmail.com', // sender address
        to: username, // list of receivers
        subject: 'Water tank level is low', // Subject line
        // 发送text或者html格式
        text: 'Water tank level is low. Please Fill the water tank with water', // plain text body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
    });
}
const WaterTray = async (deviceID, req, next) =>{
    try{
        console.log("water tray")
        let data = JSON.stringify({
            deviceID: deviceID,
        })
        let options = {
            host: '192.168.1.200',
            port: 5000,
            path: '/water_plant',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        }
        let reaspberryRequest = http.request(options, res => {
            res.on('data', d => {
                process.stdout.write(d)
            })
        })

        reaspberryRequest.on('error', error => {
            console.error(error)
        })
        reaspberryRequest.write(data)
        reaspberryRequest.end()
    }catch (err){

    }

}
const UpdateUpperTray = async(req, res, next) =>{
    try{
        console.log("UpdateUpperTray")
        console.log(req.body)
        if (req.body.status){
            let update = {
                "status": 1,
            };
            let deviceID = mongoose.Types.ObjectId(req.body.deviceID);
            let a = await Tray.findByIdAndUpdate(deviceID, update);
        }else{
            let update = {
                "status": 0,
            };
            let deviceID = mongoose.Types.ObjectId(req.body.deviceID);
            let a = await Tray.findByIdAndUpdate(deviceID, update);
        }
        return {code: 200}
        // return {}
    }catch (e) {
        
    }
}
const RunSchedule = async (tray_id, res, next) => {
    console.log("run shedule")
    console.log(tray_id)
    let tray_list = await Tray.find({ _id: mongoose.Types.ObjectId(tray_id)}).exec();
    console.log(tray_list[0])
    setSchedule(tray_list[0]);
}

const setSchedule = function (tray){
    try{
        let interval = tray.interval;
        let tray_id = tray._id;
        console.log(interval)
        const cronTime = "*/"+interval+ " * * * *";
        console.log(cronTime)
        let job = schedule.scheduleJob(cronTime, ()=>{
            console.log("watering")
            console.log(tray_id)
            WaterTray(tray_id)
        })
    }catch (err){

    }
}
const generateHistoryTable = async (tray_id,res,next) =>{
    try{
        console.log("generateHistoryTable")
        var tray_data = await Tray.findById(mongoose.Types.ObjectId(tray_id)).exec();
        let dateArry = tray_data.moisture_history_time;
        var newDateArry = [];
        dateArry.forEach(element => newDateArry.push(element.getHours()));
        const data = {
            labels: newDateArry,
            series: [
                tray_data.moisture_history
            ]
        };
        const options = {
            fullWidth: true,
            chartPadding: {
                right: 40
            }
        }

        const opts = {
            options: options
        }

        chartistSvg('line', data, opts).then((html) => {
            // console.log(html.toString('base64'))
            console.log(Buffer.from(html).toString('base64'))
            fs.writeFileSync('./simpleLineChart.svg', html)
        })
        sharp('./simpleLineChart.svg')
            .resize(500, 500)
            .png()
            .toFile("./new-file.png")
            .then(function(info) {
            })
            .catch(function(err) {
            })
        const data1 = fs.readFileSync('./new-file.png',{encoding: "base64"})
        // console.log(data1)
        var base64 = 'data:image/png;base64,' + data1;
        return base64

    }catch (err){

    }

}

module.exports = {
    MonitorTrayStatus,
    RegisterNewUpperTray,
    DeleteUpperTray,
    GetUpperTrayInfo,
    GenerateTrayQRcode,
    WaterTray,
    UpdateUpperTray,
    RunSchedule,
    generateHistoryTable
};