
import React, { useState } from "react";
import Client from "../components/Client"; 
import Editor from "../components/Editor";
import { useRef } from "react";
import { useEffect } from "react";
import initSocket from "../socket";
import Actions from "../Action";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";


function EditorPage(){

        const socketRef = useRef(null);
        const codeRef = useRef(null);
        const location = useLocation();
        const reactNavigator = useNavigate();
        const [clients,setClient] = useState([]);
        

        useEffect(() =>{
            const init = async () =>{
                socketRef.current= await initSocket();
                socketRef.current.on('connect_error',err => handleError(err));
                socketRef.current.on('connect_failed',err => handleError(err));

                function handleError(err){
                    console.log(err);
                    toast.error("Socket Connection Failed Try again");
                    reactNavigator("/");

                }
            //    console.log(location.state);
                socketRef.current.emit(Actions.JOIN,{
                        roomId:location.state.roomId,
                        Username:location.state.username,
                })
                //listeninening for the joined event
                socketRef.current.on(Actions.JOINED,({clients,Username,socketId}) =>{
                     if(Username !== location.state.username){
                        toast.success(Username + " joined the room");
                     }
                    //  console.log(clients);
                     setClient(clients);
                     socketRef.current.emit(Actions.SYNC_CODE,{
                        socketId,
                        code:codeRef.current
                     })
                });

                //listening for disconnected 
                socketRef.current.on(Actions.DISCONNECTED,({socketId,Username}) =>{
                           toast.success(Username + " has left the room");
                           setClient(prev =>{
                               return prev.filter(client => client.socketId !==socketId);
                           });
                })

            }
            init();
            return () =>{
                socketRef.current.off(Actions.JOINED);
                socketRef.current.off(Actions.DISCONNECTED);
                socketRef.current.disconnect();
            }
        },[]);

       async  function copyRoomId(){
            try{
                 await navigator.clipboard.writeText(location.state.roomId);
                 toast.success("Copied");
            }catch(e){
                toast.error("Failed");
            }
        }

        function leave(){
            reactNavigator("/");
        }

        if(!location.state){
            return <Navigate to="/"/>;
        }
          
        
    return <div className="mainWrapper">
                  <div className="aside">
                          <div className="asideInner">
                               <img className="logo" src="/code-sync.png"/> 
                                <h3>Connected</h3>
                                <div className="clientList">
                                        {
                                            clients.map(client => <Client key = {client.socketId} name={client.username} />)
                                        } 
                                </div>
            
                          </div>
                          <button className="btn copybtn" onClick={copyRoomId}>Copy Room Id</button>
                          <button className="btn leavebtn" onClick={leave}>Leave</button>
                          
                         
                  </div>
                  <div className="editor">
                        <Editor socketRef={socketRef} roomId={location.state.roomId} codeValue={codeRef.current} onCodeChange ={(code) =>{
                                console.log(code);
                                codeRef.current=code;
                            }
                        }/>
                  </div>
       </div>
}


export default EditorPage;