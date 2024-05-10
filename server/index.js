const express = require("express");
const mongoose = require("mongoose");
const {Schema} =  mongoose;
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();


const cookieParser = require("cookie-parser");
const bcrypt = require ("bcryptjs");
const jwt = require("jsonwebtoken");



const app = express();
const PORT = process.env.PORT 


app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on Port: ${PORT}`)
})

//middleware
app.use(express.urlencoded([{extended:true}]));
app.use(cookieParser());
app.use(express.json());
const corsOption={
  origin :'http://localhost:3000',
  credentials:true
};
app.use(cors(corsOption));
//routes
//app.use("/api/user",userRoute);
//app.use("/api/message",messageRoute);

const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Database Connected");
  } catch(err) {
    console.log(err)
  }
}
// schema
const userSchema = new Schema({
  fullName:{
    type:String,
    required:true
},
username:{
  type:String,
  required:true,
  unique:true
},
password:{
    type:String,
    required:true
},
profilePhoto:{
    type:String,
},
gender:{
    type:String,
    enum:["male", "female"],
    required:true
}
}, {timestamps:true});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;



// register api 
 app.post ("/api/user/register", async(req,res) =>{
  const { fullName, username, password, confirmPassword, gender } = req.body;
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await userModel.findOne({username});
        if(user){
          return res.status(400).json({messsage:"username already exist try different"})
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password do not match" });
        }

     const hashedpassword = await  bcrypt.hash(password, 10);

      //profilephoto

      const maleprofilephoto = `https://avatar.iran.liara.run/public/boy?username=${username}`;
      const femaleprofilephoto = `https://avatar.iran.liara.run/public/girl?username=${username}`;
      const data = await userModel.create({
       fullName,
       username,
       password : hashedpassword,
       profilePhoto : gender==='male'?maleprofilephoto:femaleprofilephoto,
       gender
    });
   await data.save();

    return res.status(201).json({
      message:"Account created successfully.", 
     success:true})
 })

 //login api 
 app.post("/api/user/login", async(req,res) =>{
  
        const {username,password} = req.body;
        if(!username || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        
        const user = await userModel.findOne({username});
      if(!user){
        return res.status(400).json({
            message:"Incorrect username or password",
            success:false
        })
     }
     const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        return res.status(400).json({
            message:"Incorrect username or password",
            success:false
        })
    }
  
    const tokenData = {
        userId : user._id
    }
  
    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY,  {expiresIn:"1d"});
    console.log(token)
  
    return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
        _id: user._id,
        username: user.username,
        fullName: user.fullName,
        profilePhoto: user.profilePhoto
    });
    
  }) 
  //logout api 
  app.get("/api/user/logout", (req,res)=>{
    try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
          message: "logged out successfully."
      })
  } catch (error) {
      console.log(error);
  }
  })

  //middleware section
const isAuthenticated = async(req,res,next)=>{

  try {
    const token = req.cookies.token;
    if(!token) {
      return res.status(401).json({message:"User not authenticated"});
    }
    const decode  =   jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decode) {
      return res.status(401).json({message:"Invalid token"});
    }
     req.id = decode.userId;
     
    next();
  } catch (error) {
    console.log(error)
  }
}
module.exports = isAuthenticated;
 
 


  //getotheruser api 
  app.get( "/api/user/",isAuthenticated, async(req,res) =>{
   try {
    const loggedInUserId = req.id;
    
    const otherUsers = await userModel.find({_id:{$ne : loggedInUserId}}).select("-password");
    
    return res.status(200).json(otherUsers);
    
   } catch (error) {
    console.log(error)
   }
  
  })


 //message section 

const schemaMessage = new Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
message:{
    type:String,
    required:true
}
},{timestamps:true});


// conversation schema
const conversationschema = new Schema({
  participants:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
  }],
  messages:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Message"
  }]
},{timestamps:true});


const messageModel = mongoose.model("Message", schemaMessage);
const conversationModel = mongoose.model("Conversation", conversationschema);

module.exports = { messageModel, conversationModel };


// message api 


app.post("/api/message/send/:id",isAuthenticated,async(req,res)=>{
  
    const senderId = req.id;
    const receiverId = req.params.id;
    const {message} = req.body;

    let gotConversation = await conversationModel.findOne({
        participants:{$all : [senderId,receiverId]}
    });
    if(!gotConversation){
        gotConversation = await conversationModel.create({
            participants:[senderId,receiverId]
        })
    };

    const newMessage = await messageModel.create({
        senderId,
        receiverId,
        message
    });
    if(newMessage){
     gotConversation.messages.push(newMessage._id);
    }


    await Promise.all([gotConversation.save(), newMessage()]);
  return res.status(201).json({message:"Message sent successfully"});


})

//getMessage api 
app.get("/api/message/:id",isAuthenticated,async(req,res)=>{
  
     const receiverId = req.params.id;
     const senderId = req.id;
     
        const conversation = await conversationModel.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages")
        return res.status(201).json(conversation.messages)
        
    } 
)



 
 

