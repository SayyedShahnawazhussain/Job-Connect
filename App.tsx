
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CandidateDashboard from './pages/CandidateDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import JobDetails from './pages/JobDetails';
import CompanyBranding from './pages/CompanyBranding';
import CandidateProfile from './pages/CandidateProfile';
import { AppProvider, useAppContext } from './context/AppContext';
import { UserRole } from './types';

const AppRoutes = () => {
  const { user } = useAppContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/company/:id" element={<CompanyBranding />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              !user ? <Navigate to="/login" /> :
              user.role === UserRole.CANDIDATE ? <CandidateDashboard /> :
              user.role === UserRole.EMPLOYER ? <EmployerDashboard /> :
              <AdminDashboard />
            } 
          />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          
          {/* Role-Specific Protected Route: Only Employer/Admin can view candidate profiles */}
          <Route 
            path="/candidate/:id" 
            element={
              !user ? <Navigate to="/login" /> :
              (user.role === UserRole.EMPLOYER || user.role === UserRole.ADMIN) ? <CandidateProfile /> :
              <Navigate to="/dashboard" />
            } 
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer className="bg-slate-900 text-white py-12 px-6 text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold tracking-tighter">JOB<span className="text-blue-500">CONNECT</span></div>
          <p className="text-slate-400 text-sm">© 2025 JOB CONNECT. All rights reserved.</p>
          <div className="flex gap-4 text-slate-400 text-sm">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};

export default App;
