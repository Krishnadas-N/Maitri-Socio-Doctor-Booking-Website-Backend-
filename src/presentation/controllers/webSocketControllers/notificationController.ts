import { Namespace, Socket } from "socket.io";
import authenticateSocket from "../../../middlewares/socketAuthentication";
import { INotificationUseCase } from "../../../domain/interfaces/use-cases/notificationIUsecase";

interface notifyRecieverMode{ 
    receiverId: string,
     receiverModel: string 
}

export class NotificationController{
    constructor(
        private readonly chatNamespace: Namespace,
        private notificationUseCase:INotificationUseCase
    ){}

    public handleChatEvents() {
        const connectedUsers:{userId:string,socketId:string}[] = []; 

        this.chatNamespace.on("connection", (socket: Socket) => {
            this.chatNamespace.use(authenticateSocket);
            console.log("user connected notification 🎈🎊👏🏼🙌🏾👌🏻🌈🌺🌻🍀🍉🍕🍦🍹🎵🎮🎭📚🖋️📸🎥📱💻🖥️🎨🏆⚽🏀🎾🏈🎱🏓🏸🥋🏄‍♂️🚴‍♀️🎬🎤🎸🎭🎪🎡🎢🏰🏖️🏝️🌋🗻🌅🌠🌌🎇🎆🎑🌄🌆🌈🌦️🌧️🌨️🌩️🌪️🌫️🌬️🌊🏞️🏕️🏖️🏜️🏝️🏔️🗻🏘️🏰🏯");

            socket.on('add users', (userId) => {
                const userExists = connectedUsers.some(user => user.userId === userId);
                if (!userExists) {
                    connectedUsers.push({ userId, socketId: socket.id });
                    console.log('User added to connectedUsers: 😊🎉🌟👍🏽💡🔥🚀', connectedUsers);
                } else {
                    console.log('User already exists in connectedUsers: 😊🎉🌟👍🏽💡🔥🚀', connectedUsers);
                }
            });
            
            // socket.on('send notification',(data)=>{
                
            // })
           
            socket.on('notify', async (notificationId: string) => {
                try {
                    console.log('notify called that :😊🎉🌟👍🏽💡🔥🚀', notificationId);
                    const notification = await this.notificationUseCase.getNotificationById(notificationId);
                    if (notification) {
                        console.log("notification 🍹🎵🎮🎭📚🖋️📸 data ",notification)
                        const receivers = connectedUsers.filter(user => {
                            const userId = user.userId as string;
                            return notification.receivers.some((receiver: any) => receiver.receiverId.toString() === userId);
                        });   
                        console.log("receivers",receivers)
                           if (receivers.length > 0) {
                            receivers.forEach(receiver => {
                                socket.to(receiver.socketId).emit('notification', { notification });
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

        })
    }
}