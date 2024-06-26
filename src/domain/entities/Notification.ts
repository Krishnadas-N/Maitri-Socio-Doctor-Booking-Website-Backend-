import { objectId } from "../../models/common.models";

interface IReadBy {
    reader: objectId |  string;
    readAt: Date;
}

export interface INotification extends Document {
    sender: objectId | string;
    senderModel: 'User' | 'Doctor'|'Admin';
    receivers: string[] | objectId[];
    title:string,
    message: string;
    readBy: IReadBy[];
    createdAt: Date;
    _id?:string|objectId
}
