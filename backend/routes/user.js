const router = require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticateToken} = require("./userAuth");
require("dotenv").config();
// Sign Up
router.post("/sign-up",async(req,res)=>{
    try{
        const {username, email, password, address} = req.body;
        // check username length is more than 3
        if(username.length < 4){
            return res.status(400).json({message:"Username length should be greater than 3"});
        }
        //  Check username already exists or not
        const existingUser = await User.findOne({username:username});
        if(existingUser){
            return res.status(400).json({message:"Username already exists"});
        }
        //  Check email already exists or not
        const existingEmail = await User.findOne({email:email});
        if(existingEmail){
            return res.status(400).json({message:"E-mail already exists"});
        }
        // Check password's length
        if(password.length <= 5){
            return res.status(400).json({message:"Password should be greatet than 5"})
        }
        const  hashPass = await bcrypt.hash(password,10);
        const newUser = new User ({ username:username, email:email, password:hashPass,address:address,})
        await newUser.save();
        return res.status(200).json({message:"SignUp Successfully"});
    }
    catch(error){
        res.status(500).json({message:"Internal server error"})
    }
})

// Sign In
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        const existUser = await User.findOne({ username });

        if (!existUser) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        bcrypt.compare(password, existUser.password, (err, isMatch) => {
            if (err) {
                // Handle bcrypt compare error
                console.error(err);
                return res.status(500).json({ message: "Internal Server Error" });
            }

            if (isMatch) {
                const authClaims = [{ name: existUser.username }, { role: existUser.role }];
                const token = jwt.sign({ authClaims }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

                return res.status(200).json({ id: existUser._id, role: existUser.role, token });
            } else {
                return res.status(400).json({ message: "Invalid Credentials" });
            }
        });
    } catch (error) {
        console.error(error); 
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get user information
router.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select('-password');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// router address
router.put("/update-address",authenticateToken,async(req,res)=>{
    try{
        const {id} = req.headers;
        const {address} = req.body;
        await User.findByIdAndUpdate(id, {address:address});
        return res.status(200).json({message:"Address Updated Successfully"})
    }
    catch(error){
        res.status(500).json({message:"Internal Server Error"})
    }
})

module.exports = router;



