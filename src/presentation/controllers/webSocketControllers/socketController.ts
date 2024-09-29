import { IChatUseCase } from "../../../domain/interfaces/use-cases/chatIUsecase"; 
import { Socket, Server } from "socket.io";
import authenticateSocket from "../../../middlewares/socketAuthentication";
import { INotificationUseCase } from "../../../domain/interfaces/use-cases/notificationIUsecase";


export class ChatSocketController {
  connectedUsers: { userId: string, socketId: string }[] = [];

  constructor(
    private chatUseCase: IChatUseCase,
    private readonly ioServer: Server,
    private notificationUseCase: INotificationUseCase
  ) {}

  public handleChatEvents() {
    this.ioServer.use(authenticateSocket);

    this.ioServer.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id);

      socket.on('add user', (userId: string) => {
        const userExists = this.connectedUsers.some(user => user.userId === userId);
        if (!userExists) {
          this.connectedUsers.push({ userId, socketId: socket.id });
          console.log('User added to connectedUsers:', this.connectedUsers);
        } else {
          console.log('User already exists in connectedUsers:', this.connectedUsers);
        }
      });

      socket.on("close chat", async (chatId: string, doctorId: string) => {
        try {
          await this.chatUseCase.closeChat(chatId, doctorId);
          this.ioServer.emit("chat closed", chatId);
        } catch (error) {
          console.error("Error closing chat:", error);
        }
      });

      socket.on("send message", async ({ senderId, recipientId, conversationId, message, userType }) => {
        try {
          console.log("socket.data.user", socket.data.user);
          console.log(senderId, message, conversationId, recipientId, userType);

          const response = await this.chatUseCase.sendMessage(senderId, message, conversationId, recipientId, userType);

          const senderSocketId = this.connectedUsers.find(user => user.userId === senderId)?.socketId;
          const recipientSocketId = this.connectedUsers.find(user => user.userId === recipientId)?.socketId;
          console.log("senderSocketId recipientSocketId", senderSocketId, recipientSocketId, this.connectedUsers);

          if (senderSocketId) {
            this.ioServer.to(senderSocketId).emit("new message", response);
          }

          if (recipientSocketId) {
            this.ioServer.to(recipientSocketId).emit("new message", response);
          }

          console.log(response);
        } catch (error) {
          console.error("Error sending message:", error);
        }
      });

      socket.on("get messages", async (conversationId: string) => {
        try {
          console.log("messages Event called");
          const messages = await this.chatUseCase.getIndividualMessages(conversationId);
          socket.emit("get-messages", messages); // Emit only to the requesting socket
        } catch (error) {
          console.error("Error retrieving messages:", error);
        }
      });

      socket.on("typing", (data) => {
        socket.broadcast.emit("typingResponse", data);
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error.message);
      });

      socket.on('join-room', (roomId, userId) => {
        socket.join(`private room ${roomId}`);
        socket.to(`private room ${roomId}`).emit('user-connected', userId);

        socket.on('disconnect', () => {
          socket.to(`private room ${roomId}`).emit('user-disconnected', userId);
        });
      });

      socket.on('open_rating_modal', (data) => {
        console.log("connectedUsers", this.connectedUsers);
        const recipientSocketId = this.connectedUsers.find(user => user.userId === data.userId)?.socketId;
        console.log(data.appointmentId, data.userId, recipientSocketId);
        if (recipientSocketId) {
          this.ioServer.to(recipientSocketId).emit('open_rating_modal', data.appointmentId);
        }
      });

      socket.on('toggle consultation', (data) => {
        console.log("connectedUsers", this.connectedUsers);
        const recipientSocketId = this.connectedUsers.find(user => user.userId === data.userId)?.socketId;
        console.log(data, data.appointmentId, data.userId, recipientSocketId);
        if (recipientSocketId) {
          this.ioServer.to(recipientSocketId).emit('toggle consultation', data);
        }
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        const index = this.connectedUsers.findIndex(user => user.socketId === socket.id);
        if (index !== -1) {
          this.connectedUsers.splice(index, 1);
          console.log('User removed from connectedUsers:', this.connectedUsers);
        }
      });
    });
  }

  public handleNotificationEvents() {
    this.ioServer.use(authenticateSocket);

    this.ioServer.on("connection", (socket: Socket) => {
      socket.on('notify', async (notificationId: string) => {
        try {
          console.log('notify called:', notificationId);
          const notification = await this.notificationUseCase.getNotificationById(notificationId);
          if (notification) {
            console.log("notification data:", notification);
            const receivers = this.connectedUsers.filter(user => {
              const userId = user.userId as string;
              return notification.receivers.some((receiver: any) => receiver.receiverId.toString() === userId);
            });
            console.log("receivers", receivers);
            if (receivers.length > 0) {
              receivers.forEach(receiver => {
                this.ioServer.to(receiver.socketId).emit('notification', { notification });
              });
            } else {
              console.log(`No connected users found for the receivers of notification ${notificationId}.`);
            }
          } else {
            console.log(`Notification with ID ${notificationId} not found.`);
          }
        } catch (error) {
          console.error("Error emitting notification:", error);
        }
      });
    });
  }
}
