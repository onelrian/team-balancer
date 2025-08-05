export interface User {
  id: number;
  discordId: string;
  username: string;
  avatar?: string;
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserClass {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface UserClassAssignment {
  id: number;
  userId: number;
  userClassId: number;
  assignedBy: number;
  createdAt: Date;
}

export interface WorkPortionAccess {
  id: number;
  workPortionId: number;
  userClassId: number;
  createdAt: Date;
}