const System = require("../model/system");
const qr = require('qr-image');
const mongoose = require("mongoose");

const GenerateSystemQRcode = async() => {
    try{
        console.log("generate system qr code")
        const new_system = new System({
            water_level: 0,
        });
        let a = await new_system.save();
        const id = a._id.toString() ;
        console.log(id)
        let qr_png = qr.imageSync(id, { type: 'png' });
        let base64 = 'data:image/png;base64,' + Buffer(qr_png).toString('base64');

        return base64
    }catch (err){

    }
}
const  RegisterSystemToUser = async(req, res, next) =>{
    try{
        let system_id = mongoose.Types.ObjectId(req.body.system_id);
        console.log(system_id)
        let update = {
            "user_id": req.body.user_id
        }
        let a = await System.findByIdAndUpdate(system_id,update).exec();
        return a;
    }catch (err){
        return err
    }

}



const missOneElemnt = async (req,res)=>{
    var array = req.array;
    const map = new Map();
    for(let i = 0; i<array.length; i++ ){
        map.set(array[i], i);
    }
    for(let j = 0; j<array.length;j++){
        if(map.has(array[j] - 1) && map.has(array[j] + 1)){
            continue;
        }else if(!map.has(array[j] - 1)){
            return array[j] - 1;
        }else if(!map.has(array[j] + 1)){
            return array[j] + 1;
        }
    }
    Message = {
        errorNumber : 500,
        message: "No element Found"
    }
    return Message;
}


module.exports = {GenerateSystemQRcode,RegisterSystemToUser,missOneElemnt}