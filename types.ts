export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string; // In a real app, never store plain text
  department?: string;
  jobTitle?: string;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string; // ISO Date string YYYY-MM-DD
  checkInTime: string | null; // ISO Date time string
  checkOutTime: string | null;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ABSENT' | 'PENDING' | 'WORK_FROM_HOME';
  isRemote?: boolean;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  reason: string;
  type: 'SICK' | 'VACATION' | 'PERSONAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  isAiGenerated?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'PDF' | 'DOC' | 'IMG';
  date: string;
  category: 'CONTRACT' | 'POLICY' | 'TAX';
}

export interface Notification {
  id: string;
  targetRole: 'ADMIN' | 'EMPLOYEE' | 'ALL';
  targetUserId?: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'INFO' | 'ALERT' | 'SUCCESS';
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  dueDate?: string;
}

export interface PayrollRecord {
  id: string;
  userId: string;
  month: string;
  amount: number;
  status: 'PAID' | 'PROCESSING';
  datePaid?: string;
}