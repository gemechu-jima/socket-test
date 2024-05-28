const express = require('express');
const cors=require("cors")
const { createServer } = require('node:http');
const {Server}=require("socket.io")
const app = express();
const httpServer = createServer(app);
app.use(cors())
const io=new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: "*"
  }
})
app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});
let users=[]
io.on("connection", (socket)=>{
  
    const id=socket.id
    socket.on("score", (data)=>{
      console.log("data :", data)
      if(data.name && data.score){
        const user={...data, id}
        users.push(user)
       console.log(users)
       io.emit('users', users);
      }
     })
     socket.emit("users", users)

     socket.on("delete",(id)=>{
      let currentIndex=users.findIndex(ur=>ur?.id===id)
  
      if(currentIndex!==-1){
        users.splice(currentIndex, 1)
        console.log('User deleted:', id);
        io.emit('users', users);
      }
     })
})
httpServer.listen(4000, () => {
  console.log('server running at http://localhost:4000');
});