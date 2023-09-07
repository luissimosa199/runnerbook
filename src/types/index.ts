import { Dispatch, SetStateAction } from "react";

export interface TimeLineEntryData {
  url: string;
  caption?: string;
  idx: number;
}

export interface TimeLineEntryProps {
  idx: number;
  length: number;
  data: TimeLineEntryData;
}

export interface TimeLineProps {
  _id: string;
  length: number;
  timeline?: TimeLineEntryData[];
  mainText?: string;
  createdAt: string;
  tags: string[];
  authorId: string;
  authorName: string;
  links: InputItem[];
  urlSlug?: string;
}

//

export interface TimelineFormInputs {
  _id: string;
  mainText?: string;
  photo?: TimeLineEntryData[];
  length: number;
  createdAt: string;
  tags: string[];
  authorId: string;
  authorName: string;
  links: InputItem[];

  urlSlug?: string;
}

export interface InputItem {
  value: string;
  caption?: string;
}

export interface User {
  name: string;
  email: string;
  image: string;
  photos: string[];
}

// SOCKETS

export type SocketContextType = {
  call: CallType;
  callAccepted: boolean;
  myVideo: any;
  userVideo: any;
  stream: any;
  name: string;
  setName: (name: string) => void;
  callEnded: boolean;
  me: string;
  callRoom: () => void;
  leaveCall: () => void;
  answerCall: () => void;
  usersInRoom: UserInRoom[];
  messages: ChatMessage[];
  message: string;
  sendMessage: () => void;
  setMessage: (message: string) => void;
  toggleCamera: () => void;
  cameraIsOpen: boolean;
  setRoomName: Dispatch<SetStateAction<string | null>>;
};

export type ContextProviderProps = {
  children: React.ReactNode;
};

export type CallType = {
  isReceivingCall?: boolean;
  from?: string;
  name?: string;
  signal?: any;
};

export type UserInRoom = {
  name: string;
  id: string;
  room: string;
};

export type ChatMessage = {
  username: string;
  message: string;
  timestamp?: Date;
};
