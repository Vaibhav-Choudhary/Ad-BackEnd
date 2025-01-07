const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Signup route handler
exports.signup = async (req, res) => {
    try {
        //console.log(req.body);
        const {name,email,password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User Already Exists',
            });
        }

        // Secure Password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error in Hashing Password',
            });
        }

        // Create entry
        //console.log("Creating Entry");
        const user = await User.create({
            name, email, password: hashedPassword
        });

        return res.status(200).json({
            success: true,
            message: 'User Created successfully'
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Error encountered, User Not registered'
        });
    }
};

// Add the login function similarly if it’s not already added
exports.login = async (req, res) => {
    // Your login logic here
    try{
    const {email,password}=req.body;
    if(!email || !password){
        return res.status(500).json({
            success:false,
            message:"Please Fill the Necessary Details",
        });
    }
    
    const user = await User.findOne({email});
    let userResponse = { ...user._doc };
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User is not registered",
        });
    }
    const payload={
        email:user.email,
        id:user._id,
    }

    if(await bcrypt.compare(password,user.password)){
        let token = jwt.sign(payload, process.env.JWT_SECRET,
            {
                expiresIn:"1h",
            }
        );
        userResponse.token= token;
        userResponse.password="undefined ";
        const options={
         expires: new Date(Date.now() + 3*24*60*60*1000),
        //  httpOnly:true, 
        }
        // res.cookie("token", token , options).status(200).json({
        //     success:true,
        //     token,
        //     userResponse,
        //     message:"User Logged In successfully"
        // });

        res.status(200).json({
            success:true,
            token,
            userResponse,
            message:"User Logged In successfully"
        });
    }
    else{
        //password did not match
        return res.status(403).json({
            success:false,
            message:"Password is incorrect"
        });
    }
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error encountered, User Not registered'
        });
    }
};