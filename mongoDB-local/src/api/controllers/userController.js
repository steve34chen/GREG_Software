const {
    LoginUser,GetRegisteredSystem,SignUpNewUser
} = require("../services/UserService");

const UserLogin = async (req, res, next) =>{
    try{
        const user = await LoginUser(req);
        if(user){
            res.json({
                code:200,
                data: user
            });
        }else{
            res.json({
                code:404,
                message: "Invalid user or wrong password",
                data: user
            });
        }

    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
};

const RegisteredSystem = async (req, res, next) =>{
    try{
        const plant_lists = await GetRegisteredSystem(req);
        res.json({
            code:200,
            data: plant_lists
        });
    }catch (err){
        err.msg = "failed to Register User";
        next(err)
    }
}
const SignUpUser = async(req, res, next) =>{
    try{
        const user = await SignUpNewUser(req);
        console.log(user)
        res.json({
            code:200,
            data: user
        });
    }catch (err){
        err.msg = "failed to Sgin up User";
        next(err)
    }
}

module.exports = {
    UserLogin,RegisteredSystem, SignUpUser
};