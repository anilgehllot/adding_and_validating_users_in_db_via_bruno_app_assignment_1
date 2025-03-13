const express=require('express')
const userRouter=express.Router()
const userModel=require('../model/user.model')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
userRouter.post('/signup', async(req, res)=>{
    try {
        const {name, email, password, adminkey}=req.body
        if(!name|| !email||!password){
            return res.status(400).json({"message":"name email and password are required"})
        }
        const existing_user=await userModel.findOne({email})
        if(existing_user){
            return res.status(400).json({"Message":"User already exists"})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password, salt)
        const role=adminkey===process.env.ADMIN_SECRET_KEY?"admin":"user"
        const new_user=new userModel({name, email, password:hashedPassword, role})
        await new_user.save()
        if(!new_user){
            return res.status(400).json({"message":"Failed to create new user"})
        }
        res.status(200).json({"message":"New user created successfully", new_user})
        console.log(new_user)
    } catch (error) {
        console.log(error)
    }
})

userRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ "message": "Email and password are required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ "message": "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ "message": "Invalid credentials" });
        }
        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },process.env.JWT_SECRET_KEY
        );
        console.log(token, "aaaa")
        res.status(200).json({ "message": "Login successful", token });
        console.log(token, 'bbbbb')
    } catch (error) {
        console.error(error);
        res.status(500).json({ "message": "Server error" });
    }
});



module.exports=userRouter