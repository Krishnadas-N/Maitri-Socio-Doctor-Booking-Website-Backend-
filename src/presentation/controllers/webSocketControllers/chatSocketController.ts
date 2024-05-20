import { IChatUseCase } from "../../../domain/interfaces/use-cases/chatIUsecase"; 
import { Socket, Namespace } from "socket.io";
import authenticateSocket from "../../../middlewares/socketAuthentication";

export class ChatSocketController {
  constructor(
    private chatUseCase: IChatUseCase,
    private readonly chatNamespace: Namespace
  ) {}
  name: string = "";
  public handleChatEvents() {
    const connectedUsers:{userId:string,socketId:string}[] = [];
    
      this.chatNamespace.on("connection", (socket: Socket) => {
        this.chatNamespace.use(authenticateSocket);
        console.log("user connected ");

        socket.on('add users', (userId) => {
          const userExists = connectedUsers.some(user => user.userId === userId);
          if (!userExists) {
              connectedUsers.push({ userId, socketId: socket.id });
              console.log('User added to connectedUsers: 😊🎉🌟👍🏽💡🔥🚀', connectedUsers);
          } else {
              console.log('User already exists in connectedUsers: 😊🎉🌟👍🏽💡🔥🚀', connectedUsers);
          }
            });
      

 

      socket.on("close chat", async (chatId: string, doctorId: string) => {
        try {
          await this.chatUseCase.closeChat(chatId, doctorId);
          this.chatNamespace.emit("chat closed", chatId);
        } catch (error) {
          console.error("Error closing chat:", error);
        }
      });

      socket.on("send message", async ({ senderId, recipientId,conversationId,message,userType, }) => {
          try {
            console.log("socket.data.user",socket.data.user);
            console.log(senderId,message,conversationId,recipientId, userType);
            const response = await this.chatUseCase.sendMessage(
              senderId,
              message,
              conversationId,
              recipientId,
              userType
            );
            const senderSocketId = connectedUsers.find(user => user.userId === senderId)?.socketId;
            const recipientSocketId = connectedUsers.find(user => user.userId === recipientId)?.socketId;
            console.log("senderSocketId recipientSocketId",senderSocketId,recipientSocketId,connectedUsers);
            if (senderSocketId) {
                this.chatNamespace.to(senderSocketId).emit("new message", response);
            }

            if (recipientSocketId) {
                this.chatNamespace.to(recipientSocketId).emit("new message", response);
            }

            console.log(response);

          } catch (error) {
            console.error("Error sending message:", error);
          }
        }
      );

      

        socket.on("getMessages", async (conversationId: string) => {
          try {
           console.log("messages Event called",);
              const messages = await this.chatUseCase.getIndividualMessages(conversationId);
              this.chatNamespace.emit("get-messages", messages);
          } catch (error) {
              console.error("Error retrieving messages:", error);
          }
      }); 

    


      socket.on("typing", (data) =>
        socket.broadcast.emit("typingResponse", data)
      );


        socket.on("connect_error", (error) => {
          console.log("////////////////////////////////////////////////////////////=====>",error.message);
        });

      socket.on('join-room',(roomId,userId)=>{
        socket.join(`private room ${roomId}`);
        
        socket.to(`private room ${roomId}`).emit('user-connected',userId);
        socket.on('disconnect', () =>{
          socket.to(`private room ${roomId}`).emit('user-disconnected',userId)
        })
      })

      socket.on('open_rating_modal', (data) => {
        console.log("connectedUsers",connectedUsers);
        const recipientSocketId = connectedUsers.find(user => user.userId === data.userId)?.socketId;
        console.log(data.appointmentId,data.userId,recipientSocketId);
        if(recipientSocketId){
        this.chatNamespace.to(recipientSocketId).emit('open_rating_modal',data.appointmentId);
        }
      });

      socket.on('toggle consultation', (data) => {
        console.log("connectedUsers",connectedUsers);
        const recipientSocketId = connectedUsers.find(user => user.userId === data.userId)?.socketId;
        console.log(data,data.appointmentId,data.userId,recipientSocketId);
        if(recipientSocketId){
        this.chatNamespace.to(recipientSocketId).emit('toggle consultation',data);
        }
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected from the chat namespace");
        const index = connectedUsers.findIndex(user => user.socketId === socket.id);
        if (index !== -1) {
            connectedUsers.splice(index, 1);
            console.log('User removed from connectedUsers:', connectedUsers);
        }
      });
    });
  }
}

