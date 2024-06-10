import { useEffect, useState } from "react";
import Input from "./components/Input";
import { io } from "socket.io-client";
/* eslint-disable */
function App() {
  const [data, setData] = useState({
    name: "",
    score: "",
  });
  const [users, setUsers] = useState([]);
  const [isEdit, setIsEdit]=useState(false)
  const [name, setname]
  const socket = io("http://localhost:4000/");
  socket.on("connection", (socket) => {
    console.log("connected to socket io");
  });
  const handleOnChange = (ev) => {
    const { name, value } = ev.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleOnSubmit = (ev) => {
    ev.preventDefault();
    if(!data.name && !data.score) return ;
    socket.emit("score", data);
    setData({
      name:"",
      score:""
    })
    socket.on("users", (users) => {
      setUsers(users);
    });
  };
  const handleUpdate=(ev)=>{
    ev.preventDefault()
     socket.emit("update", data)
     socket.on("users", (users) => {
      setUsers(users);
    });
     setIsEdit(false)
     setData({name:"", score:""})
  }
  const handleDelete=(id)=>{
    
    socket.emit("delete", id)
  }
  useEffect(() => { 
    socket.on("users", (users) => {
      setUsers(users);
    });
  }, [data]);

  //Test chat
  
  const handleName=()=>{
    socket.emit("name")
    socket.on("myname",(data)=>{
      console.log(data)
      name=data
    })
  }
  console.log("name", name)
  return (
    <div>
      <h1> Web Socket Test</h1>
      <form onSubmit={ isEdit ? handleUpdate : handleOnSubmit}>
        <Input
          name="name"
          value={data.name}
          onChange={handleOnChange}
          placeHolder="Enter your Name"
        />
        <Input
          name="score"
          value={data.score}
          onChange={handleOnChange}
          placeHolder="Enter Your Score"
        />
        <button type="submit" style={{ outline: "none", margin:"1em" }}>
         { isEdit ? "Update " :"Add new"}
        </button>
      </form>
     { users.length>0 ? <table>
        <tbody>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Score</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
          {users.map((user, index)=>(
          <tr key={user.id}>
          <td>{index+1}</td>
          <td>{user.name}</td>
          <td>{user.score}</td>
          <td><button onClick={ev=>{setIsEdit(true), setData(user)}}>Edit</button></td>
          <td><button onClick={(ev)=>handleDelete(user.id)}>Delete</button></td>
          </tr>
          )) }   
        </tbody>
      </table>
      :<></>}
      <div>
        <h2>please ask me what you want from the list below only</h2>
        <h2> I real chat to Help You here</h2>
        <div>
          <button onClick={handleName}>Your Name</button>
          <p>{name}</p>
        </div>
        <div>
        <button>How many year Experience</button>
        <p>{}</p>

        </div>
        <div>
        <button>Your Position</button>
        <p>{}</p>

        </div>
        <div>
        <button>Your Phone Number</button>
        <p>{}</p>

        </div>
        <div>
        <button>Your Email Address</button>
        <p>{}</p>

        </div>
      </div>
    </div>
  );
}
export default App;
