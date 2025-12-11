import { User, UserRole, AttendanceRecord, LeaveRequest, Announcement, DocumentItem, Notification, Task, PayrollRecord } from '../types';

// Initial Seed Data
const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@company.com',
    role: UserRole.ADMIN,
    password: 'password',
    jobTitle: 'Director of Operations'
  },
  {
    id: 'u2',
    name: 'John Doe',
    email: 'john@company.com',
    role: UserRole.EMPLOYEE,
    password: 'password',
    jobTitle: 'Software Engineer',
    department: 'Engineering'
  },
  {
    id: 'u3',
    name: 'Jane Smith',
    email: 'jane@company.com',
    role: UserRole.EMPLOYEE,
    password: 'password',
    jobTitle: 'Product Designer',
    department: 'Design'
  },
  {
    id: 'u4',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: UserRole.EMPLOYEE,
    password: 'password',
    jobTitle: 'Sales Executive',
    department: 'Sales'
  },
  {
    id: 'u5',
    name: 'Sarah Williams',
    email: 'sarah@company.com',
    role: UserRole.EMPLOYEE,
    password: 'password',
    jobTitle: 'HR Specialist',
    department: 'Human Resources'
  },
  {
    id: 'u6',
    name: 'David Chen',
    email: 'david@company.com',
    role: UserRole.EMPLOYEE,
    password: 'password',
    jobTitle: 'Frontend Developer',
    department: 'Engineering'
  },
  {
    id: 'u7',
    name: 'Emily Davis',
    email: 'emily@company.com',
    role: UserRole.EMPLOYEE,
    password: 'password',
    jobTitle: 'Marketing Manager',
    department: 'Marketing'
  }
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'a1',
    title: 'Welcome to Nexus OS 2.0',
    content: 'We have upgraded the system. Check out the new Task Manager and Directory features!',
    authorId: 'u1',
    createdAt: new Date().toISOString()
  }
];

const INITIAL_DOCS: DocumentItem[] = [
  { id: 'd1', title: 'Employment Contract', type: 'PDF', date: '2024-01-15', category: 'CONTRACT' },
  { id: 'd2', title: 'Company Handbook 2024', type: 'PDF', date: '2024-01-01', category: 'POLICY' },
  { id: 'd3', title: 'Tax Form W-2', type: 'PDF', date: '2024-02-20', category: 'TAX' },
];

const INITIAL_TASKS: Task[] = [
  { id: 't1', userId: 'u2', title: 'Review PR #420', status: 'TODO', priority: 'HIGH' },
  { id: 't2', userId: 'u2', title: 'Update documentation', status: 'IN_PROGRESS', priority: 'MEDIUM' },
  { id: 't3', userId: 'u2', title: 'Team Sync', status: 'DONE', priority: 'LOW' },
];

const INITIAL_PAYROLL: PayrollRecord[] = [
  { id: 'p1', userId: 'u2', month: 'October 2024', amount: 5400, status: 'PAID', datePaid: '2024-10-28' },
  { id: 'p2', userId: 'u2', month: 'November 2024', amount: 5400, status: 'PAID', datePaid: '2024-11-28' },
  { id: 'p3', userId: 'u2', month: 'December 2024', amount: 5600, status: 'PROCESSING' },
  { id: 'p4', userId: 'u3', month: 'December 2024', amount: 6200, status: 'PROCESSING' },
  { id: 'p5', userId: 'u4', month: 'December 2024', amount: 4800, status: 'PROCESSING' },
  { id: 'p6', userId: 'u5', month: 'December 2024', amount: 5100, status: 'PROCESSING' },
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class MockDB {
  private subscribers: (() => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('nexus_')) {
           this.notifySubscribers();
        }
      });
      this.seedTodayAttendance();
    }
  }

  // Automatically create realistic attendance for today so it's not empty
  private seedTodayAttendance() {
    const today = new Date().toISOString().split('T')[0];
    const key = 'nexus_attendance';
    const stored = localStorage.getItem(key);
    let all: AttendanceRecord[] = stored ? JSON.parse(stored) : [];

    // Check if we have records for today
    const hasToday = all.some(r => r.date === today);

    if (!hasToday) {
      const users = this.getUsers().filter(u => u.role === UserRole.EMPLOYEE && u.id !== 'u2'); // exclude current logged in user simulation
      
      const newRecords: AttendanceRecord[] = users.map(u => {
         // Randomize presence
         const isPresent = Math.random() > 0.15; // 85% chance present
         if (!isPresent) return null;

         const isRemote = Math.random() > 0.7; // 30% chance remote
         
         // Random time between 8:30 and 9:45
         const hour = 8 + (Math.random() > 0.5 ? 1 : 0); 
         const minute = Math.floor(Math.random() * 60);
         const checkInTime = new Date();
         checkInTime.setHours(hour, minute, 0, 0);
         
         // Status logic
         let status: AttendanceRecord['status'] = 'PRESENT';
         if (isRemote) status = 'WORK_FROM_HOME';
         else if (hour > 9 || (hour === 9 && minute > 0)) status = 'LATE';

         return {
             id: Math.random().toString(36).substr(2, 9),
             userId: u.id,
             date: today,
             checkInTime: checkInTime.toISOString(),
             checkOutTime: null,
             status,
             isRemote
         };
      }).filter(r => r !== null) as AttendanceRecord[];

      all = [...all, ...newRecords];
      this.set(key, all);
      console.log('Seeded attendance data for today');
    }
  }

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(cb => cb());
  }

  private get<T>(key: string, initial: T): T {
    const stored = localStorage.getItem(key);
    if (!stored) {
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    
    // Auto-merge new seed users into existing local storage for convenience
    if (key === 'nexus_users') {
        const storedUsers = JSON.parse(stored) as User[];
        const storedIds = new Set(storedUsers.map(u => u.id));
        const newUsers = (initial as unknown as User[]).filter(u => !storedIds.has(u.id));
        
        if (newUsers.length > 0) {
            const merged = [...storedUsers, ...newUsers];
            localStorage.setItem(key, JSON.stringify(merged));
            return merged as unknown as T;
        }
    }

    return JSON.parse(stored);
  }

  private set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
    this.notifySubscribers();
  }

  // Notifications
  private addNotification(n: Notification) {
      const all = this.get<Notification[]>('nexus_notifications', []);
      all.unshift(n);
      this.set('nexus_notifications', all);
  }

  getNotifications(userId: string, role: UserRole): Notification[] {
      const all = this.get<Notification[]>('nexus_notifications', []);
      return all.filter(n => {
          if (n.targetUserId && n.targetUserId !== userId) return false;
          if (n.targetRole === 'ALL') return true;
          if (n.targetRole === 'ADMIN' && role === UserRole.ADMIN) return true;
          if (n.targetRole === 'EMPLOYEE' && role === UserRole.EMPLOYEE) return true;
          return false;
      }).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markNotificationRead(id: string) {
      await delay(100);
      const all = this.get<Notification[]>('nexus_notifications', []);
      const idx = all.findIndex(n => n.id === id);
      if (idx !== -1) {
          all[idx].read = true;
          this.set('nexus_notifications', all);
      }
  }

  async markAllNotificationsRead(userId: string, role: UserRole) {
      await delay(200);
      const all = this.get<Notification[]>('nexus_notifications', []);
      const updated = all.map(n => {
          // Check if this notification applies to the user
          const applies = (n.targetUserId === userId) || 
                          (n.targetRole === 'ALL') ||
                          (n.targetRole === 'ADMIN' && role === UserRole.ADMIN) ||
                          (n.targetRole === 'EMPLOYEE' && role === UserRole.EMPLOYEE);
          
          if (applies) return { ...n, read: true };
          return n;
      });
      this.set('nexus_notifications', updated);
  }

  // Auth
  async login(email: string, password: string): Promise<User | null> {
    await delay(600);
    const users = this.get<User[]>('nexus_users', MOCK_USERS);
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  }

  // Users
  getUsers(): User[] {
    return this.get<User[]>('nexus_users', MOCK_USERS);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    this.set('nexus_users', users);
  }

  // Attendance
  getAttendance(userId?: string): AttendanceRecord[] {
    const all = this.get<AttendanceRecord[]>('nexus_attendance', []);
    if (userId) return all.filter(a => a.userId === userId);
    return all;
  }

  async checkIn(userId: string, isRemote: boolean = false): Promise<AttendanceRecord> {
    await delay(500);
    const all = this.getAttendance();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    
    // Check if already checked in today
    const existing = all.find(a => a.userId === userId && a.date === dateStr);
    if (existing) return existing;

    // Logic: After 9:00 AM is LATE
    const cutoff = new Date(now);
    cutoff.setHours(9, 0, 0, 0);
    
    let status: AttendanceRecord['status'] = 'PRESENT';
    
    if (isRemote) {
        status = 'WORK_FROM_HOME';
    } else if (now > cutoff) {
        status = 'LATE';
    }

    const record: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      date: dateStr,
      checkInTime: now.toISOString(),
      checkOutTime: null,
      status,
      isRemote
    };

    all.push(record);
    this.set('nexus_attendance', all);
    return record;
  }

  async checkOut(userId: string): Promise<AttendanceRecord> {
    await delay(500);
    const all = this.getAttendance();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const recordIndex = all.findIndex(a => a.userId === userId && a.date === dateStr);

    if (recordIndex === -1) throw new Error("No check-in record found for today.");

    const record = all[recordIndex];
    record.checkOutTime = now.toISOString();

    const cutoff = new Date(now);
    cutoff.setHours(16, 0, 0, 0);
    
    if (now < cutoff) {
      record.status = 'HALF_DAY';
    }

    all[recordIndex] = record;
    this.set('nexus_attendance', all);
    return record;
  }

  getTodayStats() {
    const allUsers = this.getUsers();
    const attendance = this.getAttendance();
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter(a => a.date === today);

    const totalEmployees = allUsers.filter(u => u.role === UserRole.EMPLOYEE).length;
    const present = todayRecords.length; // Total checked in
    const late = todayRecords.filter(a => a.status === 'LATE').length;
    const remote = todayRecords.filter(a => a.status === 'WORK_FROM_HOME' || a.isRemote).length;
    const onLeave = this.getRequests().filter(r => r.status === 'APPROVED' && r.startDate <= today && r.endDate >= today).length;
    
    // People who haven't checked in yet OR are absent
    const notCheckedIn = Math.max(0, totalEmployees - present - onLeave);

    return { totalEmployees, present, late, absent: notCheckedIn, onLeave, remote };
  }

  // Leaves
  getRequests(userId?: string): LeaveRequest[] {
    const all = this.get<LeaveRequest[]>('nexus_leaves', []);
    if (userId) return all.filter(r => r.userId === userId);
    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createLeaveRequest(req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'userName'>, userName: string): Promise<LeaveRequest> {
    await delay(400);
    const all = this.getRequests();
    const newReq: LeaveRequest = {
      ...req,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      userName
    };
    all.unshift(newReq);
    this.set('nexus_leaves', all);

    // Notify Admin
    this.addNotification({
        id: Math.random().toString(36).substr(2, 9),
        targetRole: 'ADMIN',
        message: `${userName} requested ${req.type} leave`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'ALERT'
    });

    return newReq;
  }

  async updateLeaveStatus(id: string, status: 'APPROVED' | 'REJECTED'): Promise<void> {
    await delay(300);
    const all = this.getRequests();
    const idx = all.findIndex(r => r.id === id);
    if (idx !== -1) {
      all[idx].status = status;
      this.set('nexus_leaves', all);
      
      // Notify Employee
      this.addNotification({
        id: Math.random().toString(36).substr(2, 9),
        targetRole: 'EMPLOYEE',
        targetUserId: all[idx].userId,
        message: `Your leave request was ${status.toLowerCase()}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: status === 'APPROVED' ? 'SUCCESS' : 'ALERT'
    });
    }
  }

  // Announcements
  getAnnouncements(): Announcement[] {
    return this.get<Announcement[]>('nexus_announcements', INITIAL_ANNOUNCEMENTS).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'createdAt'>): Promise<Announcement> {
    await delay(400);
    const all = this.getAnnouncements();
    const newAnn: Announcement = {
      ...announcement,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    all.unshift(newAnn);
    this.set('nexus_announcements', all);

    // Notify All Employees
    this.addNotification({
        id: Math.random().toString(36).substr(2, 9),
        targetRole: 'ALL',
        message: `New Announcement: ${announcement.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: 'INFO'
    });

    return newAnn;
  }

  // Documents
  getDocuments(): DocumentItem[] {
    return this.get<DocumentItem[]>('nexus_documents', INITIAL_DOCS);
  }

  // Tasks
  getTasks(userId: string): Task[] {
      const all = this.get<Task[]>('nexus_tasks', INITIAL_TASKS);
      return all.filter(t => t.userId === userId);
  }

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
      await delay(200);
      const all = this.get<Task[]>('nexus_tasks', INITIAL_TASKS);
      const newTask: Task = { ...task, id: Math.random().toString(36).substr(2, 9) };
      all.unshift(newTask);
      this.set('nexus_tasks', all);
      return newTask;
  }

  async updateTaskStatus(id: string, status: Task['status']): Promise<void> {
      const all = this.get<Task[]>('nexus_tasks', INITIAL_TASKS);
      const idx = all.findIndex(t => t.id === id);
      if (idx !== -1) {
          all[idx].status = status;
          this.set('nexus_tasks', all);
      }
  }

  async deleteTask(id: string): Promise<void> {
      const all = this.get<Task[]>('nexus_tasks', INITIAL_TASKS);
      const filtered = all.filter(t => t.id !== id);
      this.set('nexus_tasks', filtered);
  }

  // Payroll
  getPayroll(userId?: string): PayrollRecord[] {
      const all = this.get<PayrollRecord[]>('nexus_payroll', INITIAL_PAYROLL);
      if (userId) return all.filter(p => p.userId === userId);
      return all;
  }
}

export const db = new MockDB();