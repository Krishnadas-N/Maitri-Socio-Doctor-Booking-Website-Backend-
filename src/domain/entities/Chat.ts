import { objectId } from "../../models/common-models";

export interface Participant {
    participantType: 'User' | 'Doctor';
    participant: objectId;
    delivered: boolean;
    read: boolean;
    lastSeen: Date;
}

export interface Message {
    contentType: 'text' | 'audio' | 'video' | 'document';
    content: {
        text?: string;
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
        fileType?: string;
    };
    meta: {
        participant: objectId | string;
        delivered: boolean;
        read: boolean;
    }[];
}

export class Chat {
    constructor(
        public participants: Participant[],
        public messages: Message[],
        public sender: objectId,
        public is_group_message: boolean,
        public isOpen: boolean,
        public createdAt: Date,
        public updatedAt: Date,
        public name?:string,
    ) {}
}


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
  