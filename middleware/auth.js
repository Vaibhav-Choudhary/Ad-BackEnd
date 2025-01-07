//auth 

const jwt = require("jsonwebtoken");
require("dotenv").config();

//3 parameters for middleware
exports.auth=(req,res,next)=>{

    try{

        //extract Jwt token
        //PENDING : Others ways to fetch token
        console.log("cookies : ",req.cookies )
        const token = req.body.token || req.cookies.token ||req.header("Authorization").replace("Bearer ","");

        if(!token || token == undefined){
            return res.status(500).json({
                success:false,
                message:"Token Absent"
            });
        }

        //verify Toeken
        try{
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            //console.log(decode);

            req.user = decode;

        } catch (err){
            return res.status(401).json({
                success:false,
                message:"Decode Error"
            });
        }

        next();

    } catch(err) {
        return res.status(500).json({
            success:false,
            message:"Error in auth middleware"
        });
    }

}






