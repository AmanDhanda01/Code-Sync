import React, { useState } from "react";
import {v4 as uuid} from "uuid";
import toast  from "react-hot-toast";
import { useNavigate } from "react-router-dom";
function Home(){

    const [roomId,setRoomId] = useState("");
    const [username,setUsername] = useState("");
    const navigate = useNavigate();

    function creatId(e){
        e.preventDefault();

        const id = uuid();
        setRoomId(id);
        toast.success("Created a new room");

    }

    function joinRoom(){
        if(!roomId || !username){
            toast.error("Room Id and username is required");
            return;
        }
        navigate('/editor/' +roomId,{
            state:{
                username,roomId,
            }
        });

    }

    function handleKeyPress(e){
        if(e.code==="Enter"){
            joinRoom();
        }
    }
    return <div className="HomePage">
        <div className="FormSection">
               <img className="logo" src="code-sync.png"/>
               <h4 className="mainHeading">Paste the invitation ID</h4>
               <div className="inputs">
                        <input type="text" onKeyUp={handleKeyPress} className="input" onChange = {e => setRoomId(e.target.value)}   value={roomId} placeholder="ROOM ID"/>
                        <input type="text" onKeyUp={handleKeyPress}  className="input" onChange = {e => setUsername(e.target.value)}   value={username} placeholder="Username"/>
                        <button className="btn joinBtn" onClick={joinRoom}>Join</button>
                         <span className="createInfo">If you don't have an ivite then create &nbsp; <a onClick={creatId} href="">new Room</a></span>
               </div>
        </div>

    </div>
}


export default Home;