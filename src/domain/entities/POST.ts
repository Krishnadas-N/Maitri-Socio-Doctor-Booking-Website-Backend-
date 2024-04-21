
import { Types } from "mongoose";
import { ObjectId } from "mongoose";
import { userType } from "../../models/users.model";

export   class Like {
    _id?: string;
    externalModelType:userType;
    userId: string; 
    timestamp: Date;
  
    constructor(userId: string, timestamp: Date,externalModelType:userType) {
      this.userId = userId;
      this.timestamp = timestamp; 
      this.externalModelType = externalModelType
    }
  }
  

export class Reply {
    _id?: string | ObjectId ;
    userId: Types.ObjectId | string | any;
    externalModelType:userType;
    content: string;
    timestamp: Date;
    replies?: Reply[];
    constructor(userId: Types.ObjectId |string, content: string, timestamp: Date,replies: Reply[] = [],externalModelType:userType) {
        this.userId = userId;
        this.content = content;
        this.externalModelType = externalModelType;
        this.timestamp = timestamp;
        this.replies = replies;
    }
}

export class Report {
    userId: string | Types.ObjectId;
    reason: string;
    timestamp: Date;

    constructor(userId: string | Types.ObjectId, reason: string, timestamp: Date =new Date(Date.now())) {
        this.userId = userId;
        this.reason = reason;
        this.timestamp = timestamp;
    }
}

export class Comment {
  _id?: string;
  externalModelType:userType;
  userId: string | Types.ObjectId | any;
  content: string;
  timestamp: Date;
  replies?: Reply[];
  constructor(userId: string | Types.ObjectId, content: string, timestamp: Date = new Date(), externalModelType:userType) {
      this.userId = userId;
      this.content = content;
      this.timestamp = timestamp;
      this.externalModelType = externalModelType
  }
}

export class Media {
    url: string;

    constructor(url: string) {
        this.url = url;
    }
}

export class Post {
    _id?: string | Types.ObjectId;
    doctorId: string | Types.ObjectId;
    title: string;
    content: string;
    media: Media[];
    tags?: string[];
    createdAt?: Date;
    likes?: Like[];
    comments?: Comment[];
    reportedBy?: Report[];
    isBlocked?: boolean;
    isArchived?: boolean;
  
    constructor(
      doctorId: string,
      title: string,
      content: string,
      media: Media[],
      tags?: string[],
      createdAt?: Date,
      likes?: Like[],
      comments?: Comment[],
      reportedBy?: Report[],
      isBlocked: boolean = false,
    isArchived: boolean = false
    ) {
      this.doctorId = doctorId;
      this.title = title;
      this.content = content;
      this.media = media;
      this.tags = tags;
      this.createdAt = createdAt;
      this.likes = likes;
      this.comments = comments;
      this.reportedBy = reportedBy;
      this.isBlocked = isBlocked;
      this.isArchived = isArchived;
    }
  }
  
 


 
  

  
