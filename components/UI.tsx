import React, { useRef, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Bell, Check, X, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95";
    
    const variants = {
      primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 shadow-sm",
      ghost: "hover:bg-slate-100 hover:text-slate-900 text-slate-600",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-8 text-base",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Card
export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
    {children}
  </div>
);

export const CardHeader = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>
);

export const CardTitle = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight text-lg", className)}>{children}</h3>
);

export const CardContent = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("p-6 pt-0", className)}>{children}</div>
);

// Input
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Label
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 mb-2 block",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

// Badge
export const Badge = ({ className, variant = "default", children }: { className?: string, variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline', children: React.ReactNode }) => {
    const variants = {
        default: "bg-indigo-50 text-indigo-700 border-indigo-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        destructive: "bg-red-50 text-red-700 border-red-200",
        outline: "text-slate-700 border-slate-200 bg-slate-50"
    };
    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none", variants[variant], className)}>
            {children}
        </div>
    )
}

// Select
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
    ({ className, ...props }, ref) => (
        <div className="relative">
             <select
                ref={ref}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50 appearance-none shadow-sm transition-all",
                    className
                )}
                {...props}
            />
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
       
    )
);
Select.displayName = "Select";

// Spinner
export const Spinner = ({ className }: { className?: string }) => (
    <svg className={cn("animate-spin -ml-1 mr-3 h-4 w-4 text-current", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// Toast
export const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
      success: 'bg-white border-emerald-500 text-emerald-900',
      error: 'bg-white border-red-500 text-red-900',
      info: 'bg-slate-900 border-slate-700 text-white'
    };

    return (
        <div className={cn(
            "fixed top-4 right-4 z-[100] rounded-lg px-6 py-4 shadow-xl border flex items-center gap-3 animate-in slide-in-from-top-2",
            colors[type]
        )}>
           {type === 'success' && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
           {type === 'error' && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
           {type === 'info' && <Bell className="w-4 h-4 text-indigo-400" />}
           <span className="font-medium">{message}</span>
        </div>
    );
}

// Notification Dropdown
export const NotificationDropdown = ({ 
  notifications, 
  onMarkRead, 
  onMarkAllRead,
  isOpen,
  setIsOpen
}: { 
  notifications: any[], 
  onMarkRead: (id: string) => void, 
  onMarkAllRead: () => void,
  isOpen: boolean,
  setIsOpen: (v: boolean) => void
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  if (!isOpen) return null;

  return (
    <div ref={wrapperRef} className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden ring-1 ring-black ring-opacity-5">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm">
        <span className="font-semibold text-sm text-slate-900">Notifications</span>
        {notifications.length > 0 && (
          <button onClick={onMarkAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-[350px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            <Bell className="h-10 w-10 mx-auto mb-3 opacity-10" />
            No new notifications
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={cn("p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 group", n.read && "opacity-60 bg-slate-50/30")}>
              <div className={cn("mt-1 min-w-[1.5rem] h-6 w-6 rounded-full flex items-center justify-center ring-1 ring-white shadow-sm", 
                n.type === 'ALERT' ? "bg-amber-100 text-amber-600" : 
                n.type === 'SUCCESS' ? "bg-emerald-100 text-emerald-600" :
                "bg-blue-100 text-blue-600"
              )}>
                {n.type === 'ALERT' && <AlertTriangle className="h-3.5 w-3.5" />}
                {n.type === 'SUCCESS' && <CheckCircle2 className="h-3.5 w-3.5" />}
                {n.type === 'INFO' && <Info className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 space-y-1">
                <p className={cn("text-sm text-slate-900 leading-snug", !n.read && "font-semibold")}>
                  {n.message}
                </p>
                <div className="flex items-center justify-between">
                   <p className="text-xs text-slate-400 group-hover:text-slate-500">{new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                   {!n.read && (
                     <button onClick={() => onMarkRead(n.id)} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                        Read
                     </button>
                   )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Avatar
export const Avatar = ({ name, size = 'md' }: { name: string, size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-lg"
    };

    return (
        <div className={cn("relative rounded-full overflow-hidden bg-slate-200 border border-white shadow-sm flex items-center justify-center font-bold text-slate-500 shrink-0", sizeClasses[size])}>
            <span>{name ? name.charAt(0) : '?'}</span>
        </div>
    );
}