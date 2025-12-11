import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckCircle2, ArrowRight, ShieldCheck, Zap, Globe, BarChart3, Users, Building2, Calendar, Clock, CreditCard } from 'lucide-react';
import { Button, Badge } from '../components/UI';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-y-auto">
       {/* Navigation */}
       <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl cursor-pointer text-slate-900" onClick={() => navigate('/')}>
               <div className="bg-indigo-600 rounded-lg p-1.5 shadow-sm">
                  <LayoutDashboard className="h-5 w-5 text-white" />
               </div>
               Nexus
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
               <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
               <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
               <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            </div>
            <div className="flex items-center gap-4">
               <Button variant="ghost" onClick={() => navigate('/login')}>Log In</Button>
               <Button onClick={() => navigate('/login')}>Get Started</Button>
            </div>
         </div>
       </nav>

       {/* Hero Section */}
       <section className="pt-32 pb-20 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-8">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                New: Integrated Payroll Assistant
             </div>
             <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight">
                The Complete Platform for <br/> <span className="text-indigo-600">Office Management</span>
             </h1>
             <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Streamline your entire office workflow. From attendance tracking to leave approvals and document management—Nexus handles the admin so you can focus on growth.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Button size="lg" className="h-14 px-8 text-lg shadow-xl shadow-indigo-200" onClick={() => navigate('/login')}>Start Free Trial</Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg" onClick={() => navigate('/login')}>View Live Demo</Button>
             </div>
             
             {/* Dashboard Preview */}
             <div className="mt-16 relative mx-auto max-w-6xl">
                <div className="aspect-[16/10] bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-900/5 relative group">
                   <div className="absolute inset-0 bg-slate-900/5 z-10 pointer-events-none group-hover:bg-transparent transition-colors duration-500"></div>
                   <img 
                     src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" 
                     className="w-full h-full object-cover object-top" 
                     alt="Nexus Dashboard Interface" 
                   />
                   
                   {/* Floating Cards Mockup */}
                   <div className="absolute top-1/4 left-10 md:left-20 z-20 bg-white p-4 rounded-xl shadow-lg border border-slate-100 animate-in slide-in-from-left duration-1000 hidden md:block">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-500">Attendance Status</p>
                            <p className="font-bold text-slate-900">98% On Time</p>
                         </div>
                      </div>
                   </div>

                   <div className="absolute bottom-1/4 right-10 md:right-20 z-20 bg-white p-4 rounded-xl shadow-lg border border-slate-100 animate-in slide-in-from-right duration-1000 delay-300 hidden md:block">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <Calendar className="h-6 w-6" />
                         </div>
                         <div>
                            <p className="text-xs text-slate-500">Leave Requests</p>
                            <p className="font-bold text-slate-900">3 Pending Approval</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>

       {/* Social Proof */}
       <section className="py-10 border-y border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
             <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Powering 500+ Offices Worldwide</p>
             <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 font-bold text-xl"><Globe className="h-6 w-6" /> GlobalTech</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Building2 className="h-6 w-6" /> EstateCorp</div>
                <div className="flex items-center gap-2 font-bold text-xl"><ShieldCheck className="h-6 w-6" /> FinSecure</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Zap className="h-6 w-6" /> SparkLabs</div>
             </div>
          </div>
       </section>

       {/* Workflow Section */}
       <section id="how-it-works" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
                <Badge variant="default" className="mb-4">Workflow</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Nexus Transforms Your Office</h2>
             </div>
             
             <div className="grid md:grid-cols-3 gap-12 relative">
                <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
                
                {[
                   { step: "01", title: "Onboard Team", desc: "Import your employees in bulk or invite them via email. Set roles, departments, and designations instantly." },
                   { step: "02", title: "Automate Admin", desc: "Employees check in/out, request leave, and update tasks themselves. Nexus tracks everything automatically." },
                   { step: "03", title: "Analyze & Improve", desc: "View real-time reports on attendance trends and productivity to make data-driven decisions." }
                ].map((item, i) => (
                   <div key={i} className="relative flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-6 shadow-lg shadow-indigo-200 z-10">
                         {item.step}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                      <p className="text-slate-600 leading-relaxed max-w-xs">{item.desc}</p>
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* Features */}
       <section id="features" className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4">
             <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Core Management Features</h2>
                <p className="text-lg text-slate-600">Everything an office administrator needs to keep the company running smoothly.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {[
                   { icon: Clock, title: "Time & Attendance", desc: "Biometric-style web clock-in, late tracking, and remote work validation." },
                   { icon: Calendar, title: "Leave Management", desc: "Streamlined workflow for sick leave, vacation, and personal time off approvals." },
                   { icon: Users, title: "Employee Directory", desc: "Centralized database of all staff members with contact info and hierarchy." },
                   { icon: Zap, title: "Task Tracking", desc: "Assign daily priorities and track project completion with Kanban boards." },
                   { icon: ShieldCheck, title: "Document Vault", desc: "Securely store and share contracts, tax forms, and company policies." },
                   { icon: BarChart3, title: "Admin Insights", desc: "Visual dashboards for attendance rates, leave balances, and team activity." }
                ].map((feature, i) => (
                   <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group">
                      <div className="w-12 h-12 bg-indigo-50 group-hover:bg-indigo-600 transition-colors rounded-xl flex items-center justify-center text-indigo-600 group-hover:text-white mb-6">
                         <feature.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* Pricing */}
       <section id="pricing" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
                <p className="text-slate-600">Choose the plan that fits your office size.</p>
             </div>

             <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Starter */}
                <div className="p-8 rounded-3xl border border-slate-200 hover:border-indigo-200 transition-colors">
                   <h3 className="text-xl font-semibold text-slate-900 mb-2">Starter</h3>
                   <div className="text-4xl font-bold text-slate-900 mb-6">$0<span className="text-lg text-slate-500 font-normal">/mo</span></div>
                   <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Up to 10 employees</li>
                      <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Basic Attendance</li>
                      <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Document Storage (1GB)</li>
                   </ul>
                   <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>Get Started</Button>
                </div>

                {/* Professional */}
                <div className="p-8 rounded-3xl bg-slate-900 text-white relative shadow-xl transform md:-translate-y-4">
                   <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">POPULAR</div>
                   <h3 className="text-xl font-semibold mb-2">Growth</h3>
                   <div className="text-4xl font-bold mb-6">$49<span className="text-lg text-slate-400 font-normal">/mo</span></div>
                   <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Up to 50 employees</li>
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Advanced Analytics</li>
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Task Management</li>
                      <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="h-5 w-5 text-indigo-400" /> Priority Support</li>
                   </ul>
                   <Button className="w-full bg-indigo-500 hover:bg-indigo-400 border-0" onClick={() => navigate('/login')}>Start Free Trial</Button>
                </div>

                {/* Enterprise */}
                <div className="p-8 rounded-3xl border border-slate-200 hover:border-indigo-200 transition-colors">
                   <h3 className="text-xl font-semibold text-slate-900 mb-2">Enterprise</h3>
                   <div className="text-4xl font-bold text-slate-900 mb-6">Custom</div>
                   <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Unlimited employees</li>
                      <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Dedicated Manager</li>
                      <li className="flex items-center gap-3 text-slate-600"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> API Access</li>
                   </ul>
                   <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>Contact Sales</Button>
                </div>
             </div>
          </div>
       </section>

       {/* CTA */}
       <section className="py-24 bg-indigo-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069')] bg-cover bg-center opacity-10"></div>
          <div className="relative max-w-4xl mx-auto px-4 text-center space-y-8">
             <h2 className="text-4xl font-bold">Manage your office with confidence.</h2>
             <p className="text-indigo-200 text-xl max-w-2xl mx-auto">Join 10,000+ office managers who trust Nexus to keep their workplace organized and efficient.</p>
             <Button size="lg" className="h-14 px-10 text-lg bg-white text-indigo-900 hover:bg-indigo-50" onClick={() => navigate('/login')}>
                Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
             </Button>
          </div>
       </section>

       {/* Footer */}
       <footer className="bg-white py-12 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
             <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-1">
                    <div className="flex items-center gap-2 font-bold text-xl text-slate-900 mb-4">
                        <div className="bg-indigo-600 rounded-lg p-1.5 shadow-sm">
                            <LayoutDashboard className="h-5 w-5 text-white" />
                        </div>
                        Nexus
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        The all-in-one operating system for modern office management.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Product</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><a href="#" className="hover:text-indigo-600">Features</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Pricing</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Enterprise</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Case Studies</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Company</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
                        <li><a href="#" className="hover:text-indigo-600">Cookie Policy</a></li>
                    </ul>
                </div>
             </div>
             <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                 <div className="text-slate-500 text-sm">
                    © 2024 Nexus Corporation. All rights reserved.
                 </div>
                 <div className="flex gap-4">
                    {/* Social icons could go here */}
                 </div>
             </div>
          </div>
       </footer>
    </div>
  );
};

export default Landing;