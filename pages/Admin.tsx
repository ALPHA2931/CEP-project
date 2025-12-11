import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, Users, CalendarCheck, Megaphone, 
    LogOut, Plus, CheckCircle2, XCircle, Search, Wand2, Bell, Laptop, CreditCard, DollarSign, Filter 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { generateAnnouncementContent } from '../services/geminiService';
import { User, LeaveRequest, AttendanceRecord, Announcement, UserRole, Notification, PayrollRecord } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Badge, Select, Spinner, Toast, NotificationDropdown, cn, Avatar } from '../components/UI';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

type AdminView = 'DASHBOARD' | 'EMPLOYEES' | 'LEAVES' | 'PAYROLL' | 'BUZZ';

const AdminDashboard = ({ user, onLogout }: { user: User, onLogout: () => void }) => {
  const [view, setView] = useState<AdminView>('DASHBOARD');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [newNotifToast, setNewNotifToast] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial fetch
    setNotifications(db.getNotifications(user.id, user.role));

    // Subscription
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const NavItem = ({ id, label, icon: Icon }: { id: AdminView, label: string, icon: any }) => (
    <button
      onClick={() => setView(id)}
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
        view === id 
          ? "bg-slate-900 text-white shadow-lg shadow-indigo-500/20" 
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

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-20">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-slate-900">
             <div className="bg-indigo-600 rounded-xl p-1.5 shadow-md shadow-indigo-200">
                <LayoutDashboard className="h-5 w-5 text-white" />
             </div>
             Nexus Admin
          </div>
        </div>
        <div className="flex-1 px-4 py-2 overflow-y-auto space-y-6">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Mission Control</div>
            <NavItem id="DASHBOARD" label="Command Center" icon={LayoutDashboard} />
            <NavItem id="EMPLOYEES" label="Workforce" icon={Users} />
            <NavItem id="PAYROLL" label="Payroll" icon={DollarSign} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">Requests</div>
            <NavItem id="LEAVES" label="Leave Approvals" icon={CalendarCheck} />
            <NavItem id="BUZZ" label="Company Buzz" icon={Megaphone} />
          </div>
        </div>
        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 px-3 py-2 mb-2 bg-slate-50 rounded-xl border border-slate-100">
                <Avatar name={user.name} size="sm" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-slate-500 truncate uppercase tracking-wider font-semibold">Administrator</p>
                </div>
           </div>
           <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 text-xs" onClick={handleLogout}>
              <LogOut className="h-3 w-3 mr-2" />
              Sign Out
           </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="md:hidden font-bold text-lg flex items-center gap-2">
                <div className="bg-indigo-600 rounded-lg p-1"><LayoutDashboard className="h-4 w-4 text-white" /></div>
                Nexus
            </div>
            
            <div className="flex items-center ml-auto gap-6">
               <div className="hidden md:block text-sm text-slate-500 font-medium">
                  {new Date().toLocaleDateString(undefined, {weekday: 'long', month: 'long', day: 'numeric'})}
               </div>
               
               {/* Notification Bell */}
               <div className="relative">
                  <button 
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
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
                 <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4" /></Button>
               </div>
            </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex md:hidden overflow-x-auto gap-2 pb-2 scrollbar-hide">
                     <Button variant={view === 'DASHBOARD' ? 'primary' : 'outline'} size="sm" onClick={() => setView('DASHBOARD')}>Dashboard</Button>
                     <Button variant={view === 'PAYROLL' ? 'primary' : 'outline'} size="sm" onClick={() => setView('PAYROLL')}>Payroll</Button>
                     <Button variant={view === 'EMPLOYEES' ? 'primary' : 'outline'} size="sm" onClick={() => setView('EMPLOYEES')}>Staff</Button>
                     <Button variant={view === 'LEAVES' ? 'primary' : 'outline'} size="sm" onClick={() => setView('LEAVES')}>Leaves</Button>
                </div>

                {view === 'DASHBOARD' && <DashboardView />}
                {view === 'EMPLOYEES' && <EmployeesView />}
                {view === 'PAYROLL' && <PayrollView />}
                {view === 'LEAVES' && <LeavesView />}
                {view === 'BUZZ' && <BuzzView />}
            </div>
        </main>
      </div>
    </div>
  );
};

// --- Sub Views ---

const DashboardView = () => {
    const [stats, setStats] = useState({ totalEmployees: 0, present: 0, late: 0, absent: 0, onLeave: 0, remote: 0 });
    const [activities, setActivities] = useState<any[]>([]);
    
    useEffect(() => {
        setStats(db.getTodayStats());
        
        const att = db.getAttendance().filter(a => a.date === new Date().toISOString().split('T')[0]);
        const acts = att.map(a => {
            const u = db.getUsers().find(u => u.id === a.userId);
            return {
                id: a.id,
                user: u?.name || 'Unknown',
                type: a.status === 'WORK_FROM_HOME' || a.isRemote ? 'REMOTE' : a.status === 'LATE' ? 'LATE' : 'CHECKIN',
                time: a.checkInTime
            }
        }).sort((a,b) => new Date(b.time!).getTime() - new Date(a.time!).getTime()).slice(0, 5);
        setActivities(acts);

        return db.subscribe(() => setStats(db.getTodayStats()));
    }, []);

    const data = [
      { name: 'Present', value: stats.present, color: '#10b981' }, 
      { name: 'Late', value: stats.late, color: '#f59e0b' },    
      { name: 'Remote', value: stats.remote, color: '#8b5cf6' },
      { name: 'On Leave', value: stats.onLeave, color: '#6366f1' },
      { name: 'Absent', value: stats.absent, color: '#ef4444' },    
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Real-time overview of your organization.</p>
                </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                 <Card className="border-0 shadow-lg shadow-indigo-100 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Users className="w-24 h-24" /></div>
                    <CardHeader className="pb-2 relative z-10">
                        <CardTitle className="text-indigo-100 text-sm font-medium uppercase tracking-wider">Total Staff</CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-4xl font-bold">{stats.totalEmployees}</div>
                        <p className="text-xs text-indigo-100 mt-1 opacity-80">Active employees</p>
                    </CardContent>
                 </Card>

                 <Card className="border-emerald-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">On Time</CardTitle>
                        <div className="p-2 bg-emerald-100 rounded-full"><CheckCircle2 className="h-4 w-4 text-emerald-600" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.present - stats.late}</div>
                        <p className="text-xs text-emerald-600 font-medium mt-1">Checked in before 9:00 AM</p>
                    </CardContent>
                 </Card>

                 <Card className="border-violet-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Remote</CardTitle>
                        <div className="p-2 bg-violet-100 rounded-full"><Laptop className="h-4 w-4 text-violet-600" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.remote}</div>
                        <p className="text-xs text-violet-600 font-medium mt-1">Working from home</p>
                    </CardContent>
                 </Card>

                 <Card className="border-red-100 shadow-sm hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Absent / Late</CardTitle>
                        <div className="p-2 bg-red-100 rounded-full"><XCircle className="h-4 w-4 text-red-600" /></div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{stats.absent + stats.late}</div>
                        <p className="text-xs text-slate-400 mt-1">Need attention</p>
                    </CardContent>
                 </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="col-span-2 border-slate-100 shadow-md">
                    <CardHeader>
                        <CardTitle>Attendance Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                <Tooltip 
                                    cursor={{fill: '#f1f5f9'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1 border-slate-100 shadow-md">
                    <CardHeader>
                        <CardTitle>Live Feed</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                        <div className="space-y-0">
                            {activities.length === 0 && <p className="text-slate-400 text-sm px-6">No activity yet.</p>}
                            {activities.map((act) => (
                                <div key={act.id} className="flex items-center px-6 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                                    <div className="mr-3">
                                        <div className={cn("h-2 w-2 rounded-full ring-4 ring-opacity-20", 
                                            act.type === 'REMOTE' ? 'bg-violet-500 ring-violet-500' : 
                                            act.type === 'LATE' ? 'bg-amber-500 ring-amber-500' : 'bg-emerald-500 ring-emerald-500'
                                        )}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{act.user}</p>
                                        <p className="text-xs text-slate-500 truncate">
                                            {act.type === 'REMOTE' ? 'Remote Check-in' : act.type === 'LATE' ? 'Late Check-in' : 'Checked In'}
                                        </p>
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono">
                                        {new Date(act.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

const PayrollView = () => {
    const [payroll, setPayroll] = useState<PayrollRecord[]>([]);
    const [filter, setFilter] = useState<'ALL' | 'PAID' | 'PROCESSING'>('ALL');

    useEffect(() => {
        setPayroll(db.getPayroll());
    }, []);

    const filtered = payroll.filter(p => filter === 'ALL' || p.status === filter);
    const totalPayout = filtered.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Payroll</h2>
                    <p className="text-slate-500">Manage salaries and payments.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                    {(['ALL', 'PROCESSING', 'PAID'] as const).map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                                filter === f ? "bg-slate-900 text-white shadow" : "text-slate-500 hover:bg-slate-50"
                            )}
                        >
                            {f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                 <Card className="bg-slate-900 text-white border-0">
                     <CardContent className="p-6">
                         <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Disbursed</p>
                         <h3 className="text-3xl font-bold mt-2">${totalPayout.toLocaleString()}</h3>
                         <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
                             <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                             <span>{filtered.filter(p => p.status === 'PAID').length} Payments Completed</span>
                         </div>
                     </CardContent>
                 </Card>
                 <Card>
                     <CardContent className="p-6">
                         <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Processing</p>
                         <h3 className="text-3xl font-bold mt-2 text-slate-900">{payroll.filter(p => p.status === 'PROCESSING').length}</h3>
                         <div className="mt-4 flex items-center gap-2 text-xs text-amber-600">
                             <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                             <span>Action Required</span>
                         </div>
                     </CardContent>
                 </Card>
                 <Card className="flex items-center justify-center border-dashed border-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                     <div className="text-center">
                         <div className="mx-auto w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
                             <Plus className="h-6 w-6" />
                         </div>
                         <p className="font-semibold text-slate-900 text-sm">Run Payroll</p>
                     </div>
                 </Card>
            </div>

            <Card className="overflow-hidden border-slate-200 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Employee</th>
                                <th className="px-6 py-4 font-semibold">Period</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Date Paid</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((record) => {
                                const employee = db.getUsers().find(u => u.id === record.userId);
                                return (
                                    <tr key={record.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={employee?.name || '?'} size="sm" />
                                                <div>
                                                    <div className="font-semibold text-slate-900">{employee?.name}</div>
                                                    <div className="text-xs text-slate-500">{employee?.jobTitle}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-600">{record.month}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">${record.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={record.status === 'PAID' ? 'success' : 'warning'} className="shadow-sm">
                                                {record.status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{record.datePaid || '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-slate-400 group-hover:text-indigo-600">Details</Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

const EmployeesView = () => {
    const [employees, setEmployees] = useState<User[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newEmp, setNewEmp] = useState({ name: '', email: '', jobTitle: '', department: '' });

    useEffect(() => {
        setEmployees(db.getUsers().filter(u => u.role === UserRole.EMPLOYEE));
    }, []);

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        const user: User = {
            id: Math.random().toString(36).substr(2, 9),
            role: UserRole.EMPLOYEE,
            password: 'password', // Default
            name: newEmp.name,
            email: newEmp.email,
            jobTitle: newEmp.jobTitle,
            department: newEmp.department
        };
        db.addUser(user);
        setEmployees(db.getUsers().filter(u => u.role === UserRole.EMPLOYEE));
        setIsAddModalOpen(false);
        setNewEmp({ name: '', email: '', jobTitle: '', department: '' });
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Workforce</h2>
                    <p className="text-slate-500">Manage employee access and profiles.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="shadow-lg shadow-indigo-200">
                    <Plus className="h-4 w-4 mr-2" />
                    New Hire
                </Button>
            </div>

            <Card className="border-slate-200 shadow-sm overflow-hidden">
                <div className="p-0 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Employee</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Department</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="bg-white hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                        <Avatar name={emp.name} />
                                        <div>
                                            <div className="font-semibold">{emp.name}</div>
                                            <div className="text-xs text-slate-500">{emp.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{emp.jobTitle}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-600">{emp.department || 'General'}</Badge>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in">
                    <Card className="w-full max-w-md shadow-2xl">
                        <CardHeader>
                            <CardTitle>Onboard Employee</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <Label>Full Name</Label>
                                    <Input required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} />
                                </div>
                                <div>
                                    <Label>Email</Label>
                                    <Input required type="email" value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Job Title</Label>
                                        <Input required value={newEmp.jobTitle} onChange={e => setNewEmp({...newEmp, jobTitle: e.target.value})} />
                                    </div>
                                    <div>
                                        <Label>Department</Label>
                                        <Input required value={newEmp.department} onChange={e => setNewEmp({...newEmp, department: e.target.value})} />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                    <Button type="submit">Create Profile</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

const LeavesView = () => {
    const [requests, setRequests] = useState<LeaveRequest[]>([]);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        setRequests(db.getRequests());
        return db.subscribe(() => setRequests(db.getRequests()));
    }, []);

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setProcessing(id);
        await db.updateLeaveStatus(id, status);
        setProcessing(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Leave Requests</h2>
                    <p className="text-slate-500">Review pending time-off applications.</p>
                </div>
            </div>

            <div className="grid gap-4">
                {requests.length === 0 && <div className="text-center p-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">No requests found.</div>}
                {requests.map(req => (
                    <Card key={req.id} className="overflow-hidden border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                            <div className="flex items-start gap-4">
                                <div className={cn("p-2.5 rounded-full mt-1 shrink-0", 
                                    req.type === 'SICK' ? 'bg-red-50 text-red-600' : 
                                    req.type === 'VACATION' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                )}>
                                    <CalendarCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-slate-900 text-lg">{req.userName}</span>
                                        <Badge variant="outline" className="text-xs uppercase tracking-wider font-semibold">{req.type}</Badge>
                                        {req.status === 'APPROVED' && <Badge variant="success">Approved</Badge>}
                                        {req.status === 'REJECTED' && <Badge variant="destructive">Rejected</Badge>}
                                        {req.status === 'PENDING' && <Badge variant="warning">Pending Review</Badge>}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">
                                        {new Date(req.startDate).toLocaleDateString()} — {new Date(req.endDate).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-slate-600 mt-3 italic max-w-xl">
                                        "{req.reason}"
                                    </p>
                                </div>
                            </div>
                            
                            {req.status === 'PENDING' && (
                                <div className="flex gap-3 w-full sm:w-auto">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 sm:flex-none border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                                        onClick={() => handleAction(req.id, 'REJECTED')}
                                        disabled={processing === req.id}
                                    >
                                        {processing === req.id ? <Spinner/> : 'Reject'}
                                    </Button>
                                    <Button 
                                        className="flex-1 sm:flex-none bg-slate-900 text-white hover:bg-emerald-600 transition-colors shadow-lg"
                                        onClick={() => handleAction(req.id, 'APPROVED')}
                                        disabled={processing === req.id}
                                    >
                                         {processing === req.id ? <Spinner/> : 'Approve'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

const BuzzView = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [aiTone, setAiTone] = useState('Professional and Direct');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    useEffect(() => {
        setAnnouncements(db.getAnnouncements());
        return db.subscribe(() => setAnnouncements(db.getAnnouncements()));
    }, []);

    const handleAiGenerate = async () => {
        if (!title) return;
        setIsGenerating(true);
        const generated = await generateAnnouncementContent(title, aiTone);
        setContent(generated);
        setIsGenerating(false);
    };

    const handlePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;
        setIsPosting(true);
        await db.createAnnouncement({ title, content, authorId: 'admin', isAiGenerated: false });
        setTitle('');
        setContent('');
        setIsPosting(false);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-2 space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Company Buzz</h2>
                        <p className="text-slate-500">Official updates and announcements.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {announcements.map(a => (
                        <Card key={a.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-bold text-lg text-slate-900">{a.title}</h3>
                                    <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-1 rounded">{new Date(a.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mt-3 text-slate-600 whitespace-pre-line text-sm leading-relaxed pl-4 border-l-2 border-indigo-100">
                                    {a.content}
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                     <div className="h-6 w-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                         A
                                     </div>
                                     <span className="text-xs font-medium text-slate-500">Posted by Admin</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-1">
                <Card className="sticky top-6 border-indigo-100 shadow-xl shadow-indigo-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <h3 className="flex items-center gap-2 font-bold text-lg">
                            <Megaphone className="h-5 w-5" />
                            New Announcement
                        </h3>
                        <p className="text-indigo-100 text-xs mt-1">Broadcast to all employees instantly.</p>
                    </div>
                    <CardContent className="space-y-4 pt-6">
                        <form onSubmit={handlePost}>
                            <div className="space-y-2 mb-4">
                                <Label>Headline</Label>
                                <Input 
                                    placeholder="e.g. Office Closed Friday" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)} 
                                    className="font-medium"
                                />
                            </div>
                            
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center">
                                    <Label>Message</Label>
                                    <button 
                                        type="button"
                                        onClick={handleAiGenerate}
                                        disabled={isGenerating || !title}
                                        className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 disabled:opacity-50 font-bold bg-indigo-50 px-2 py-1 rounded-full transition-colors"
                                    >
                                        <Wand2 className="h-3 w-3" />
                                        {isGenerating ? 'Writing...' : 'AI Assist'}
                                    </button>
                                </div>
                                <textarea 
                                    className="w-full min-h-[150px] rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-inner bg-slate-50 focus:bg-white transition-all"
                                    placeholder="Type your message..."
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2 mb-6">
                                <Label>Tone</Label>
                                <Select value={aiTone} onChange={e => setAiTone(e.target.value)}>
                                    <option>Professional</option>
                                    <option>Exciting</option>
                                    <option>Urgent</option>
                                    <option>Casual</option>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 shadow-lg" disabled={isPosting || !title || !content}>
                                {isPosting ? <Spinner /> : 'Broadcast Now'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;