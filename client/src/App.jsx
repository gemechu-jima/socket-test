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
  const socket = io("http://localhost:4000/");
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
     console.log(data)
     setIsEdit(false)
     setData({name:"", score:""})
  }
  const handleDelete=(id)=>{
    console.log(id)
    socket.emit("delete", id)
  }
  useEffect(() => {
    socket.on("connection", (socket) => {
      console.log("connected");
    });
    socket.on("users", (users) => {
      setUsers(users);
    });
  }, [data]);
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
    </div>
  );
}
export default App;
