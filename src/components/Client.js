import React from "react";
import Avatar from "react-avatar";


function Client(props){
    return <div className="clientWrapper">
         <Avatar name={props.name} size={50} round="14px"/>
        <span className="clientName">{props.name}</span>
    </div>
}

export default Client;