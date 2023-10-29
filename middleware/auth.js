const jwt = require("jsonwebtoken");
require("dotenv").config();

async function auth(req,res,next){
    try {
        
        const token =req.body.access_token || req.cookies.access_token || req.header("Authorization").replace("Bearer ","");
        if(!token){
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: access_token,
                        message: "Not signed in.",
                        code: "UNAUTHORISED_ACCESS"
                    }
                ]
            })
        }

        const payload =await jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = payload;
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"ERROR: authorizing.=> " +error.message 
        });
    }
}

exports.isAdmin = async (req,res,next)=>{
    try {
        if(req.user.accountType === "Admin"){
            
            next();

        }
        else{
            return res.status(400).json({
                success:false,
                message:"User not authorized for Admin route."
            })
        }
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"ERROR: authorizing for Admin=> " +error.message 
        });
    }
}