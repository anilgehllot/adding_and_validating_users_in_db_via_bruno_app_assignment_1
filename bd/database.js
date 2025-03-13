const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const URL=process.env.mongoURL

const connection=mongoose.connect(URL).then(()=>{
    console.log("Connected to mongodb successfully")
}).catch((err)=>{
    console.log("Failed to connect to mongoDB")
})

module.exports=connection