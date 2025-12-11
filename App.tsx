import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/Admin';
import EmployeeDashboard from './pages/Employee';
import { User, UserRole } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: UserRole }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    if (allowedRole && user.role !== allowedRole) {
      // Redirect based on role if they try to access wrong area
      return <Navigate to={user.role === UserRole.ADMIN ? '/admin' : '/employee'} replace />;
    }
    return children;
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRole={UserRole.ADMIN}>
              <AdminDashboard user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/employee/*" 
          element={
            <ProtectedRoute allowedRole={UserRole.EMPLOYEE}>
              <EmployeeDashboard user={user!} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;