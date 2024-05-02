import { ChatUseCase } from "../../../domain/interfaces/use-cases/chat-Service/chat-IUsecase";
import {Socket, Namespace } from "socket.io";

export class ChatSocketController {
  constructor(
    private chatUseCase: ChatUseCase,
    private readonly chatNamespace: Namespace
  ) {}
  name:string=''
  public handleChatEvents() {
    this.chatNamespace.on("connection", (socket: Socket) => {
      console.log("A user connected to the chat namespace");

      socket.on('getChats', async () => {
        try {
          console.log('"get chats" event received');
          const userId = 123; // Assuming user ID is attached to the socket

            // Replace with your actual chat retrieval logic using chatUseCase
            // const chats = await this.chatService.getChatsForUser(userId);
            this.chatNamespace.emit('chats', userId);
       
        } catch (error) {
          console.error('Error retrieving chats:', error);
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

      socket.on( "send message",  async ( senderId,
        recipientId,
        conversationId,
        message ) => {
            try {
              const response = await this.chatUseCase.sendMessage(
                senderId,
                message,
                conversationId,
                recipientId,
             
               
              );
              this.chatNamespace.emit("getMessages", response);
            } catch (error) {
              console.error("Error sending message:", error);
            }
          }
      );

      
    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))


      socket.on('joining msg', (username) => {
        this.name = username;
        this.chatNamespace.emit('chat message', `---${  this.name } joined the chat---`);
      });

      socket.on("connect_error", (error) => {
      
          console.log(error.message);
      
      });
      socket.on("disconnect", () => {
        console.log("A user disconnected from the chat namespace");
      });
    });

  }
}


// id: 'bdwmYr5gfHc2-JxHAAAH',
// handshake: {
//   headers: {
//     'user-agent': 'node-XMLHttpRequest',
//     accept: '*/*',
//     host: 'localhost:3000',
//     connection: 'close'
//   },
//   time: 'Tue Apr 30 2024 16:48:17 GMT+0530 (India Standard Time)',
//   address: '::1',
//   xdomain: false,
//   secure: false,
//   issued: 1714475897454,
//   url: '/socket.io/?EIO=4&transport=polling&t=OykkX9Q&b64=1',
//   query: [Object: null prototype] {
//     EIO: '4',
//     transport: 'polling',
//     t: 'OykkX9Q',
//     b64: '1'
//   },
//   auth: {}
// },