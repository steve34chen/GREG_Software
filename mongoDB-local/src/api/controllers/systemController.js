const {
    GenerateSystemQRcode,
    RegisterSystemToUser,
    missOneElemnt
} = require("../services/SystemService");

const GenerateQRcode = async(req, res, next) => {
    try{
        const QRCode = await GenerateSystemQRcode()
        res.json(QRCode);
    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
}
const RegisterSystem = async (req, res, next) =>{
    try{
        const register = await RegisterSystemToUser(req.body);
        res.json({
            code:200,
            message: "Register System Successfully",
            data: register
        });
    }catch (err){

    }
}

const test = async (req,res,next) =>{
    try{
        console.log(req.body);
        const result = await missOneElemnt(req.body);
        res.json({
            code:200,
            message:"Successfully find missing element",
            data: result
        })
    }catch (err){

    }

}

module.exports = {
    GenerateQRcode,
    RegisterSystem,
    test
}