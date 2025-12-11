import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { UserRole } from '../types';
import { Button, Input, Label, Toast, Spinner } from '../components/UI';
import { LayoutDashboard, ArrowRight, User as UserIcon, Lock, Building2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('admin@company.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await db.login(email, password);
      if (user) {
        onLogin(user);
        if (user.role === UserRole.ADMIN) {
          navigate('/admin');
        } else {
          navigate('/employee');
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {error && <Toast message={error} type="error" onClose={() => setError(null)} />}
      
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-16 text-white">
        {/* Abstract shapes/gradient */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px]"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold tracking-tight">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-xl">
               <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            Nexus OS
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-5xl font-extrabold leading-tight mb-8 tracking-tight">
            The Operating System <br/> for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Modern Teams</span>.
          </h2>
          <div className="flex gap-4">
             <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
             <p className="text-lg text-slate-300 font-light leading-relaxed">
                Experience a seamless workflow. Manage attendance, process payroll, and unite your workforce in one unified interface.
             </p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400 font-medium tracking-wider uppercase">
           Internal System v2.4.0
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8 lg:p-12 relative bg-white">
         <div className="w-full max-w-[380px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex justify-center mb-8">
                <div className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                        <LayoutDashboard className="h-6 w-6" />
                    </div>
                    Nexus OS
                </div>
            </div>

            <div className="text-center space-y-2">
               <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
               <p className="text-slate-500">Enter your credentials to access your workspace.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
               <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-semibold">Work Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
                  />
               </div>

               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                    <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors">Forgot?</a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    className="h-12 bg-slate-50 border-slate-200 focus:bg-white focus:border-indigo-500 transition-all"
                  />
               </div>

               <Button 
                type="submit" 
                className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] font-semibold text-base" 
                disabled={loading}
               >
                  {loading && <Spinner className="text-white" />}
                  {loading ? 'Authenticating...' : (
                      <span className="flex items-center justify-center gap-2">Sign In <ArrowRight className="h-4 w-4" /></span>
                  )}
                </Button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-white px-3 text-slate-400 font-semibold">Demo Accounts</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <button
                  type="button" 
                  onClick={() => {setEmail('admin@company.com'); setPassword('password');}}
                  className="flex flex-col p-4 bg-slate-50 border border-transparent hover:border-indigo-200 rounded-xl hover:bg-white hover:shadow-lg transition-all group text-left"
               >
                  <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Building2 className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-indigo-600">ADMIN</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">Admin User</div>
               </button>

               <button
                  type="button" 
                  onClick={() => {setEmail('john@company.com'); setPassword('password');}}
                  className="flex flex-col p-4 bg-slate-50 border border-transparent hover:border-emerald-200 rounded-xl hover:bg-white hover:shadow-lg transition-all group text-left"
               >
                  <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <UserIcon className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-emerald-600">EMPLOYEE</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">John Doe</div>
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;