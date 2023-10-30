
const express = require("express");

const app = express();

const http = require("http");
const {Server} = require("socket.io");
const Actions = require("./src/Action");

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClients(roomID){
      return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map((socketId) =>{
                return {
                  socketId,
                  username:userSocketMap[socketId]
                }
      });
}

io.on("connection",(socket) =>{
      console.log("sockedID ");

      socket.on(Actions.JOIN,({roomId,Username}) =>{
              userSocketMap[socket.id]=Username;
              socket.join(roomId);
              const clients = getAllConnectedClients(roomId);
              clients.forEach((client) =>{
                  io.to(client.socketId).emit(Actions.JOINED,{
                       clients,
                       Username,
                       socketId:socket.id
                  });
              });
      });

      socket.on(Actions.CODE_CHANGE,({roomId,newCode}) =>{
            // console.log(newCode);
           io.to(roomId).emit(Actions.CODE_CHANGE,{newCode});
      });

      // socket.on(Actions.SYNC_CODE,({socketId,code}) =>{
      //       // console.log(code) ;  
      //      io.to(socketId).emit(Actions.CODE_CHANGE,{code});
      // });

      socket.on('disconnecting',() =>{
            const rooms = [...socket.rooms];
            rooms.forEach((roomId) =>{
                 socket.in(roomId).emit(Actions.DISCONNECTED,{
                           socketId:socket.id,
                           Username:userSocketMap[socket.id]
                 });
          
            });
            delete userSocketMap[socket.id];
            socket.leave();
      })
});




server.listen(process.env.PORT || 5000,() => console.log("he there"));