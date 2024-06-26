import { Timestamp } from "@angular/fire/firestore/firebase";
import { User } from "./user";

export interface Chat{
    id: string;
    lastMessage?: string;
    lastMessageDate?: Date & Timestamp;
    userIds: string[];
    users: User[];

    //Not stored only for display
    chatPic?: string;
    chatName?: string;
}

export interface Message{
    text: string;
    senderId: string;
    sendDate: Date & Timestamp ;
}