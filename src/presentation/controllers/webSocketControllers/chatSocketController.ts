import { ChatUseCase } from "../../../domain/interfaces/use-cases/chat-Service/chat-IUsecase";
import { Socket, Namespace } from "socket.io";
import authenticateSocket from "../../../middlewares/socketAuthentication";

export class ChatSocketController {
  constructor(
    private chatUseCase: ChatUseCase,
    private readonly chatNamespace: Namespace
  ) {}
  name: string = "";
  public handleChatEvents() {
    const connectedUsers:{userId:string,socketId:string}[] = [];
    
      this.chatNamespace.on("connection", (socket: Socket) => {
        this.chatNamespace.use(authenticateSocket);
        console.log("user connected ");

        socket.on('add user', (userId) => {
          connectedUsers.push({ userId,socketId: socket.id });
          console.log('User added to connectedUsers:', connectedUsers);
      });

      socket.on("getChats", async () => {
        try {
          console.log('"get chats" event received');
          const userId = 123; // Assuming user ID is attached to the socket
          this.chatNamespace.emit("chats", userId);
        } catch (error) {
          console.error("Error retrieving chats:", error);
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
            console.log("senderSocketId recipientSocketId",senderSocketId,recipientSocketId);
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
              // Retrieve messages for the specified conversationId
              const messages = await this.chatUseCase.getIndividualMessages(conversationId);
              console.log("messages",messages);
              // Emit the messages to the client
              this.chatNamespace.emit("get-messages", messages);
          } catch (error) {
              console.error("Error retrieving messages:", error);
          }
      }); 

    


      socket.on("typing", (data) =>
        socket.broadcast.emit("typingResponse", data)
      );

        socket.on("joining msg", (username) => {
          this.name = username;
          this.chatNamespace.emit(
            "chat message",
            `---${this.name} joined the chat---`
          );
        });

        socket.on("connect_error", (error) => {
          console.log("////////////////////////////////////////////////////////////=====>",error.message);
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

