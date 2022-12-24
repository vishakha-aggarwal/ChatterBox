require('dotenv').config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const { Server } = require("socket.io");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://vishakha_251:vishakha@messenger.himip.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB")).catch(console.error);

const User = require("./models/usermodel");
const Messages = require("./models/messageModel");


const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "https://chat-me-chatterbox.netlify.app",
    // origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true
  }
});


app.get("/api/v1/isValid/:username/:email", async (req, res) => {

  try {
    const { username, email } = req.params;
    const usernameCheck = await User.findOne({ username });

    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });

    const emailCheck = await User.findOne({ email });

    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    return res.json({ msg: "ok", status: true })

  } catch (err) {
    console.log("Error in validation");
  }
})

app.post("/api/v1/addUser", (req, res) => {
  
  try {
    const { username, email, password } = req.body;
    
    const data = new User({
      username: username,
      email: email,
      password: password
    })
    data.save();
    // console.log("data saved sucessfully");

  } catch (err) {
    console.log("Error in registering user");
  }
})

app.get("/api/v1/login/:username/:password", async(req, res) =>{

  try {
    const { username, password } = req.params;
    const usernameCheck = await User.findOne({ username: username });
    // console.log(usernameCheck);
    if (usernameCheck)
    {
      // console.log(usernameCheck._id);
      if(usernameCheck.password === password )
        return res.json({ msg: "Username and password matched", status: true, _id: usernameCheck._id });
    }
    res.json({ msg: "No match found", status: false });
  } catch (err) {
    console.log("Error in validation");
  }

})

app.get("/api/v1/getuserdetail/:id", async (req, res) =>{

  try {
    const id = req.params.id;
    const details = await User.findOne({ _id: id});
    // console.log(details);
    res.json(details);
  } catch (err) {
    console.log("Error in validation");
  }
})

app.get("/api/v1/getcontacts/:id", async (req, res) =>{

  try {
    const id = req.params.id;
    const details = await User.find({ _id: { $ne: id } });
    // console.log(details);
    res.json(details);
  } catch (err) {
    console.log("Error in validation1");
  }
})

app.get("/api/v1/getcontacts/:id/:searchUser", async (req, res) =>{

  try {
    const id = req.params.id;
    const searchUser = req.params.searchUser;
    // console.log(searchUser);
    const details = await User.find({ _id: { $ne: id }, username: {'$regex' : searchUser, '$options' : 'i'} });
    // console.log(details);
    res.json(details);
  } catch (err) {
    console.log("Error in validation");
  }
})

app.post("/api/v1/addMessage", (req, res) => {

  try {
    const { from, to, message, date } = req.body;
    const data = new Messages({
      message: message,
      users: [from, to],
      sender: from,
      dateTime: date
    });
    data.save();
    // console.log("data saved successfully"); 

  } catch (err) {
    console.log("Error in addition");
  }

})

app.get("/api/v1/getmessages/:from/:to" , async(req, res) => {

  try {
    const { from, to } = req.params;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    // console.log(messages);
    const data = messages.map((data) => {
      return {
        fromSelf: data.sender.toString() === from,
        message: data.message,
        date: data.dateTime
      };
    });
    // console.log(data);
    res.json(data);

  } catch (err) {
    console.log("Error in getting messages");
  }

})

// const server = app.listen(PORT, () => {
//   console.log(`Server started on ${PORT}`);
// })

io.on("connection", (socket) => {

  socket.on("add-user", (userId) => {
    socket.join(userId);
  });

  socket.on("send-msg", (data) => {
    // console.log(data);
    socket.to(data.to).emit("msg-recieve", data.message);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
})