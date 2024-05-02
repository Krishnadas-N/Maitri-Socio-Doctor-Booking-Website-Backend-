import { objectId } from "../../models/common-models";

export class Conversation {
    constructor(
      public members: Member[],
      public isGroupChat: boolean,
      public groupName?: string,
      public groupDescription?: string,
      public lastUpdate?: Date,
      public isClosed?: boolean
    ) {}
  }
  
  interface Member {
    member: string; // Assuming string is used for ObjectId
    memberType: 'User' | 'Doctor';
  }
  
  interface Meta extends Member{
    delivered: boolean,
     read: boolean
  }

  export class Message {
    constructor(
        public _id: string,
        public conversationId: string | objectId,
        public senderId: string | objectId,
        public senderModel: 'User' | 'Doctor', // Assuming only two sender models
        public content: MessageContent,
        public messageType: 'text' | 'audio' | 'video' | 'document',
        public createdAt: Date,
        public meta: Meta[]
    ) {}
}

// MessageContent Entity
export class MessageContent {
    constructor(
        public text?: string,
        public fileUrl?: string,
        public fileName?: string,
        public fileSize?: number,
        public fileType?: string
    ) {}
}