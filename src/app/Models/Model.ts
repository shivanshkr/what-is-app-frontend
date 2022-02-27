export interface Chat {
  groupPic?: string;
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: User[];
  groupAdmin?: User;
  createdAt: string;
  updatedAt: string;
  latestMessage?: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export const defaultUser: User = {
  _id: '',
  name: '',
  email: '',
  pic: '',
  createdAt: '',
  updatedAt: '',
};
