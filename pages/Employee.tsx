import React, { useState, useEffect } from 'react';
import { 
    Home, Clock, Calendar, FileText, LogOut, 
    CheckCircle, CheckCircle2, AlertTriangle, XCircle, Download, Bell, Laptop,
    ListTodo, Users, Search, Plus, Trash2, GripVertical, DollarSign, Wallet,
    Megaphone
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { User, AttendanceRecord, LeaveRequest, DocumentItem, Notification, Task, PayrollRecord } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Badge, Select, Spinner, Toast, NotificationDropdown, cn, Avatar } from '../components/UI';

type EmployeeView = 'HOME' | 'TASKS' | 'LEAVE' | 'PAYROLL' | 'TEAM' | 'DOCS';

const EmployeeDashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [view, setView] = useState<EmployeeView>('HOME');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [newNotifToast, setNewNotifToast] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setNotifications(db.getNotifications(user.id, user.role));
    const unsubscribe = db.subscribe(() => {
       const latest = db.getNotifications(user.id, user.role);
       setNotifications(prev => {
           if (latest.length > prev.length) {
               const newest = latest[0];
               if (!newest.read && !prev.find(p => p.id === newest.id)) {
                   setNewNotifToast(newest.message);
               }
           }
           return latest;
       });
    });
    return unsubscribe;
  }, [user]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const NavItem = ({ id, label, icon: Icon }: { id: EmployeeView, label: string, icon: any }) => (
    <button
      onClick={() => setView(id)}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
        view === id 
          ? "bg-slate-900 text-white shadow-md shadow-slate-300" 
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
        {newNotifToast && <Toast message={newNotifToast} type="info" onClose={() => setNewNotifToast(null)} />}

        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-20">
             <div className="p-6">
                <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
                    <div className="bg-indigo-600 rounded-xl p-1.5 shadow-md shadow-indigo-200">
                        <Home className="h-5 w-5 text-white" />
                    </div>
                    Nexus
                </div>
            </div>
            <div className="flex-1 px-4 py-2 overflow-y-auto space-y-6">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Personal</div>
                  <NavItem id="HOME" label="Workspace" icon={Home} />
                  <NavItem id="TASKS" label="My Tasks" icon={ListTodo} />
                  <NavItem id="PAYROLL" label="Payslips" icon={Wallet} />
                </div>
                <div>
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Company</div>
                   <NavItem id="LEAVE" label="Time Off" icon={Calendar} />
                   <NavItem id="TEAM" label="Directory" icon={Users} />
                   <NavItem id="DOCS" label="Documents" icon={FileText} />
                </div>
            </div>
            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-50 rounded-xl border border-slate-100">
                    <Avatar name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider font-semibold">{user.jobTitle}</p>
                    </div>
                </div>
                 <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-xs" onClick={handleLogout}>
                    <LogOut className="h-3 w-3 mr-2" />
                    Sign Out
                </Button>
            </div>
        </aside>

        {/* Mobile Header & Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
             <header className="bg-white/90 backdrop-blur-md border-b shadow-sm z-10 flex-shrink-0 sticky top-0">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                     <div className="md:hidden flex items-center gap-2 font-bold text-lg text-slate-900">
                        <div className="bg-indigo-600 rounded-lg p-1.5"><Home className="h-4 w-4 text-white" /></div>
                        Nexus
                     </div>
                     <div className="hidden md:block font-bold text-slate-700">
                        {view === 'HOME' && 'Personal Workspace'}
                        {view === 'TASKS' && 'Tasks'}
                        {view === 'TEAM' && 'Directory'}
                        {view === 'LEAVE' && 'Leave Request'}
                        {view === 'DOCS' && 'Documents'}
                        {view === 'PAYROLL' && 'Payroll History'}
                     </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                {notifications.some(n => !n.read) && (
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse"></span>
                                )}
                            </button>
                            <NotificationDropdown 
                                isOpen={showNotifDropdown}
                                setIsOpen={setShowNotifDropdown}
                                notifications={notifications}
                                onMarkRead={(id) => db.markNotificationRead(id)}
                                onMarkAllRead={() => db.markAllNotificationsRead(user.id, user.role)}
                            />
                        </div>
                        <div className="md:hidden">
                             <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-5 w-5" /></Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-auto bg-slate-50 p-4 md:p-8 pb-20 md:pb-8">
                 <div className="max-w-4xl mx-auto space-y-6">
                    {view === 'HOME' && <HomeView user={user} setView={setView} />}
                    {view === 'TASKS' && <TasksView user={user} />}
                    {view === 'TEAM' && <DirectoryView />}
                    {view === 'LEAVE' && <LeaveView user={user} />}
                    {view === 'DOCS' && <DocsView />}
                    {view === 'PAYROLL' && <PayrollView user={user} />}
                </div>
            </main>

             {/* Bottom Nav (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 pb-safe z-30 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                <button onClick={() => setView('HOME')} className={cn("p-2 rounded-xl flex flex-col items-center transition-all", view === 'HOME' ? "text-indigo-600 bg-indigo-50" : "text-slate-400")}><Home className="h-5 w-5"/><span className="text-[10px] font-medium mt-1">Home</span></button>
                <button onClick={() => setView('TASKS')} className={cn("p-2 rounded-xl flex flex-col items-center transition-all", view === 'TASKS' ? "text-indigo-600 bg-indigo-50" : "text-slate-400")}><ListTodo className="h-5 w-5"/><span className="text-[10px] font-medium mt-1">Tasks</span></button>
                <button onClick={() => setView('PAYROLL')} className={cn("p-2 rounded-xl flex flex-col items-center transition-all", view === 'PAYROLL' ? "text-indigo-600 bg-indigo-50" : "text-slate-400")}><Wallet className="h-5 w-5"/><span className="text-[10px] font-medium mt-1">Pay</span></button>
                <button onClick={() => setView('LEAVE')} className={cn("p-2 rounded-xl flex flex-col items-center transition-all", view === 'LEAVE' ? "text-indigo-600 bg-indigo-50" : "text-slate-400")}><Calendar className="h-5 w-5"/><span className="text-[10px] font-medium mt-1">Leave</span></button>
            </div>
        </div>
    </div>
  );
};

// --- Sub Views ---

const HomeView = ({ user, setView }: { user: User, setView: (v: EmployeeView) => void }) => {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [isRemote, setIsRemote] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        loadData();
        const unsubscribe = db.subscribe(() => loadData());
        return unsubscribe;
    }, []);

    const loadData = () => {
        const data = db.getAttendance(user.id);
        setAttendance(data);
        const today = new Date().toISOString().split('T')[0];
        setTodayRecord(data.find(r => r.date === today) || null);
        setAnnouncements(db.getAnnouncements().slice(0, 3));
        setTasks(db.getTasks(user.id));
    };

    const handleCheckIn = async () => {
        setLoading(true);
        await db.checkIn(user.id, isRemote);
        setLoading(false);
    };

    const handleCheckOut = async () => {
        setLoading(true);
        try { await db.checkOut(user.id); } catch (e) { console.error(e); }
        setLoading(false);
    };

    const pendingTasks = tasks.filter(t => t.status !== 'DONE');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Welcome Banner */}
            <div className="bg-slate-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">Good Morning, {user.name.split(' ')[0]}</h1>
                        <p className="text-slate-300 text-sm">
                            You have {pendingTasks.length} pending tasks today. 
                        </p>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
                         <div className="text-right">
                             <div className="text-xs text-slate-300 uppercase tracking-wide">Next Payday</div>
                             <div className="font-bold">Oct 28</div>
                         </div>
                         <Wallet className="h-8 w-8 text-indigo-300" />
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-indigo-600/40 to-transparent pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Main Action Card */}
                <Card className="border-0 shadow-lg relative overflow-hidden h-[300px]">
                     <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 z-0"></div>
                     <CardContent className="relative z-10 h-full flex flex-col justify-between items-center py-8">
                        <div className="text-center">
                            <h3 className="text-slate-500 font-medium text-sm uppercase tracking-widest">Time Tracker</h3>
                            <div className="text-5xl font-bold text-slate-900 tabular-nums mt-2 tracking-tighter">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                        
                        {!todayRecord ? (
                            <div className="w-full flex flex-col items-center gap-4">
                                <button
                                    onClick={handleCheckIn}
                                    disabled={loading}
                                    className="group relative w-32 h-32 rounded-full bg-indigo-600 text-white shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 disabled:opacity-80 disabled:scale-100"
                                >
                                    {/* Pulse Animation */}
                                    <div className="absolute inset-0 rounded-full border-2 border-indigo-600 animate-pulse-ring opacity-75"></div>
                                    
                                    {loading ? <Spinner className="w-8 h-8" /> : (
                                        <div className="text-center">
                                            <div className="text-lg font-bold group-hover:tracking-wider transition-all">IN</div>
                                            <div className="text-[10px] opacity-70 uppercase font-medium">Check In</div>
                                        </div>
                                    )}
                                </button>
                                <div 
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
                                    onClick={() => setIsRemote(!isRemote)}
                                >
                                    <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center transition-colors", isRemote ? "bg-indigo-600 border-indigo-600" : "border-slate-300")}>
                                        {isRemote && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                    <span className="text-xs font-medium text-slate-600">Working Remotely</span>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center gap-6">
                                <div className="flex flex-col items-center">
                                    <Badge variant="success" className="px-4 py-1 text-sm mb-2 shadow-sm border-0 bg-emerald-100 text-emerald-700">
                                        {todayRecord.isRemote || todayRecord.status === 'WORK_FROM_HOME' ? 'Remote Active' : 'Office Active'}
                                    </Badge>
                                    <p className="text-xs text-slate-400 font-medium">
                                        Since {new Date(todayRecord.checkInTime!).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                                {!todayRecord.checkOutTime ? (
                                    <Button 
                                        size="lg" 
                                        variant="outline"
                                        className="w-40 rounded-full border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all text-slate-600"
                                        onClick={handleCheckOut}
                                        disabled={loading}
                                    >
                                        {loading ? <Spinner /> : 'Check Out'}
                                    </Button>
                                ) : (
                                    <div className="text-sm font-bold text-slate-400 bg-slate-100 px-6 py-2 rounded-full">Shift Complete</div>
                                )}
                            </div>
                        )}
                     </CardContent>
                </Card>

                <div className="grid grid-rows-2 gap-6">
                    {/* Quick Stats / History */}
                    <Card className="border-0 shadow-md">
                        <CardHeader className="pb-2">
                             <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Attendance Streak</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="flex gap-2 justify-between">
                                {[...Array(5)].map((_, i) => {
                                    const record = attendance[attendance.length - 1 - i];
                                    return (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all",
                                                record ? 
                                                    (record.status === 'LATE' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700') 
                                                    : 'bg-slate-100 text-slate-400'
                                            )}>
                                                {record ? <CheckCircle2 className="w-5 h-5" /> : '-'}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium">Day {i+1}</span>
                                        </div>
                                    )
                                })}
                             </div>
                        </CardContent>
                    </Card>

                    {/* Buzz */}
                    <Card className="border-0 shadow-md flex flex-col">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                             <CardTitle className="text-sm uppercase tracking-wider text-slate-500">Latest Buzz</CardTitle>
                             <Megaphone className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent className="flex-1 overflow-hidden relative">
                             {announcements.length > 0 ? (
                                 <div>
                                     <p className="font-semibold text-slate-900 truncate">{announcements[0].title}</p>
                                     <p className="text-xs text-slate-500 line-clamp-2 mt-1">{announcements[0].content}</p>
                                 </div>
                             ) : (
                                 <p className="text-xs text-slate-400">No news is good news.</p>
                             )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const PayrollView = ({ user }: { user: User }) => {
    const [payslips, setPayslips] = useState<PayrollRecord[]>([]);

    useEffect(() => {
        setPayslips(db.getPayroll(user.id));
    }, [user.id]);

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Payslips</h2>
                    <p className="text-slate-500">Earnings and deductions history.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {payslips.map(slip => (
                    <Card key={slip.id} className="group hover:border-indigo-300 transition-colors cursor-pointer border-slate-200 shadow-sm">
                        <div className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-full flex items-center justify-center",
                                    slip.status === 'PAID' ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                                )}>
                                    <DollarSign className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-lg">{slip.month}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant={slip.status === 'PAID' ? 'success' : 'warning'} className="text-[10px] uppercase tracking-wider px-2">
                                            {slip.status}
                                        </Badge>
                                        {slip.datePaid && <span className="text-xs text-slate-500">Paid on {new Date(slip.datePaid).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-slate-900">${slip.amount.toLocaleString()}</p>
                                <p className="text-xs text-indigo-600 font-semibold mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Download PDF</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const TasksView = ({ user }: { user: User }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDate, setNewTaskDate] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setTasks(db.getTasks(user.id));
        return db.subscribe(() => setTasks(db.getTasks(user.id)));
    }, [user.id]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!newTaskTitle.trim()) return;
        setLoading(true);
        await db.createTask({
            userId: user.id,
            title: newTaskTitle,
            status: 'TODO',
            priority: 'MEDIUM',
            dueDate: newTaskDate || undefined
        });
        setNewTaskTitle('');
        setNewTaskDate('');
        setLoading(false);
    }

    const handleStatusChange = async (id: string, newStatus: Task['status']) => {
        await db.updateTaskStatus(id, newStatus);
    }

    const handleDelete = async (id: string) => {
        if(window.confirm('Delete this task?')) {
            await db.deleteTask(id);
        }
    }

    const Columns = ({ status, title }: { status: Task['status'], title: string }) => {
        let items = tasks.filter(t => t.status === status);
        
        // Sort by due date for 'TODO' items
        if (status === 'TODO') {
             items = items.sort((a, b) => {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
             });
        }

        return (
            <div className="flex-1 min-w-[280px] bg-slate-100/50 rounded-xl p-4 flex flex-col">
                <h3 className="font-semibold text-slate-700 mb-4 flex items-center justify-between text-sm uppercase tracking-wide">
                    {title} 
                    <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm border border-slate-100">{items.length}</span>
                </h3>
                <div className="space-y-3 flex-1">
                    {items.map(t => (
                        <div key={t.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant={t.priority === 'HIGH' ? 'destructive' : t.priority === 'MEDIUM' ? 'warning' : 'success'} className="text-[10px] py-0">
                                    {t.priority}
                                </Badge>
                                <button onClick={() => handleDelete(t.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4"/></button>
                            </div>
                            <p className="font-medium text-slate-900 text-sm mb-3 leading-snug">{t.title}</p>
                            
                            {t.dueDate && (
                                <div className="flex items-center text-xs text-slate-500 mb-3">
                                    <Calendar className="h-3 w-3 mr-1.5" />
                                    Due {new Date(t.dueDate).toLocaleDateString()}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                                <button 
                                    disabled={status === 'TODO'}
                                    onClick={() => handleStatusChange(t.id, status === 'DONE' ? 'IN_PROGRESS' : 'TODO')}
                                    className="text-xs text-slate-400 hover:text-indigo-600 disabled:opacity-0 font-medium"
                                >
                                    ← Prev
                                </button>
                                <button 
                                    disabled={status === 'DONE'}
                                    onClick={() => handleStatusChange(t.id, status === 'TODO' ? 'IN_PROGRESS' : 'DONE')}
                                    className="text-xs text-slate-400 hover:text-indigo-600 disabled:opacity-0 font-medium"
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    ))}
                    {items.length === 0 && <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-xs italic">Empty</div>}
                </div>
            </div>
        )
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Task Board</h2>
                    <p className="text-slate-500">Drag and drop functionality coming soon.</p>
                </div>
            </div>
            
            <form onSubmit={handleAdd} className="mb-6 flex gap-2">
                <div className="flex-1">
                     <Input 
                        placeholder="What needs to be done?" 
                        value={newTaskTitle} 
                        onChange={e => setNewTaskTitle(e.target.value)} 
                        className="shadow-sm border-slate-300"
                    />
                </div>
                <div className="w-36 hidden sm:block">
                    <Input 
                        type="date"
                        value={newTaskDate}
                        onChange={e => setNewTaskDate(e.target.value)}
                        className="shadow-sm border-slate-300"
                    />
                </div>
                <Button type="submit" disabled={loading || !newTaskTitle} className="shadow-lg shadow-indigo-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                </Button>
            </form>

            <div className="flex-1 flex gap-4 overflow-x-auto pb-4 snap-x">
                <Columns status="TODO" title="To Do" />
                <Columns status="IN_PROGRESS" title="In Progress" />
                <Columns status="DONE" title="Completed" />
            </div>
        </div>
    );
};

const DirectoryView = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setUsers(db.getUsers().filter(u => u.role === 'EMPLOYEE'));
    }, []);

    const filtered = users.filter(u => 
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.department?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Directory</h2>
                    <p className="text-slate-500">Connect with your team.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search colleagues..." 
                        className="pl-9 bg-white shadow-sm" 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(u => (
                    <Card key={u.id} className="text-center group hover:border-indigo-300 transition-colors shadow-sm">
                        <CardContent className="pt-8 pb-6 flex flex-col items-center">
                            <Avatar name={u.name} size="lg" />
                            <h3 className="font-bold text-slate-900 mt-4 text-lg">{u.name}</h3>
                            <p className="text-indigo-600 text-sm font-medium">{u.jobTitle}</p>
                            <Badge variant="outline" className="mt-2 bg-slate-50">{u.department}</Badge>
                            
                            <div className="mt-6 w-full pt-4 border-t border-slate-100 flex justify-center gap-4">
                                <Button variant="ghost" size="sm" className="text-xs w-full text-slate-500 hover:text-indigo-600">View Profile</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

const LeaveView = ({ user }: { user: User }) => {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ startDate: '', endDate: '', type: 'VACATION', reason: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLeaves(db.getRequests(user.id));
        return db.subscribe(() => setLeaves(db.getRequests(user.id)));
    }, [user.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await db.createLeaveRequest(formData as any, user.name);
        setSubmitting(false);
        setShowForm(false);
        setFormData({ startDate: '', endDate: '', type: 'VACATION', reason: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Time Off</h2>
                    <p className="text-slate-500">Balances and requests.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "secondary" : "primary"}>
                    {showForm ? 'Cancel' : 'Request Leave'}
                </Button>
            </div>

            {showForm && (
                <Card className="animate-in slide-in-from-top-4 border-indigo-200 shadow-xl relative z-10">
                    <CardHeader><CardTitle>New Request</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>From</Label>
                                    <Input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                                </div>
                                <div>
                                    <Label>To</Label>
                                    <Input type="date" required value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <Label>Type</Label>
                                <Select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="VACATION">Vacation</option>
                                    <option value="SICK">Sick Leave</option>
                                    <option value="PERSONAL">Personal</option>
                                </Select>
                            </div>
                            <div>
                                <Label>Reason</Label>
                                <textarea 
                                    className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-shadow" 
                                    rows={3} 
                                    required
                                    value={formData.reason} 
                                    onChange={e => setFormData({...formData, reason: e.target.value})}
                                    placeholder="Brief description..."
                                />
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full bg-slate-900 text-white">
                                {submitting ? <Spinner /> : 'Submit for Approval'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {leaves.map(req => (
                    <Card key={req.id} className="border-l-4 border-l-indigo-500 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between p-5">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-bold text-slate-900">{req.type}</span>
                                    <Badge variant={
                                        req.status === 'APPROVED' ? 'success' : 
                                        req.status === 'REJECTED' ? 'destructive' : 'warning'
                                    }>
                                        {req.status}
                                    </Badge>
                                </div>
                                <p className="text-xs text-slate-500 font-medium">
                                    {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            {req.status === 'PENDING' && (
                                <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded uppercase tracking-wider">
                                    Reviewing
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
                {leaves.length === 0 && !showForm && (
                     <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                             <Calendar className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No leave history.</p>
                     </div>
                )}
            </div>
        </div>
    );
};

const DocsView = () => {
    const [docs, setDocs] = useState<DocumentItem[]>([]);

    useEffect(() => {
        setDocs(db.getDocuments());
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Documents</h2>
                <p className="text-slate-500">Official company files.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {docs.map(doc => (
                    <Card key={doc.id} className="hover:border-indigo-400 transition-colors cursor-pointer group shadow-sm">
                        <CardContent className="p-5 flex items-center gap-4">
                            <div className="h-12 w-12 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                                <FileText className="h-6 w-6 text-indigo-500 group-hover:text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900 truncate">{doc.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5">{doc.category} • {doc.date}</p>
                            </div>
                            <Download className="h-4 w-4 text-slate-300 group-hover:text-indigo-600" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default EmployeeDashboard;