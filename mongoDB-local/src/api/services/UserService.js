const  User  = require("../model/user");
const System = require("../model/system")

const LoginUser = async (req) => {
    console.log(req.body)
    try {
        let user = await User.findOne({ username: req.body.username, password:req.body.password}).exec();
        console.log(user)
        return user;
    }catch(err){

    }
};

const GetRegisteredSystem = async (req,res) => {
    try {
        console.log(req.query.user_id);
        let plant_lists = await System.find({ user_id: req.query.user_id}).exec();
        console.log(plant_lists)
        return plant_lists

    } catch(err) {
        // res.send({message: err});
    }

}
const SignUpNewUser = async (req, res)=>{
    console.log(req.body)
    try {
        const myuser = new User({
            username: req.body.username,
            password: req.body.password,
        });
        await myuser.save();
        return myuser
    }catch (err){

    }
}
module.exports = {
    LoginUser,GetRegisteredSystem,SignUpNewUser
};