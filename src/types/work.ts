export interface WorkPortion {
  id: number;
  name: string;
  description?: string;
  weight: number; // 1-10 scale
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkAssignment {
  id: number;
  workPortionId: number;
  userId: number;
  assignedAt: Date;
  assignmentCycle: Date; // The cycle this assignment belongs to
}

export interface WorkloadPreference {
  id: number;
  userId: number;
  workPortionId: number;
  preferenceLevel: number; // 1-5 scale (1 = least preferred, 5 = most preferred)
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentHistory {
  id: number;
  userId: number;
  workPortionId: number;
  assignedDate: Date;
  completedDate?: Date;
  createdAt: Date;
}