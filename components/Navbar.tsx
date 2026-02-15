
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { Bell, User as UserIcon, LogOut, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, notifications } = useAppContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-slate-900">
            JOB<span className="text-blue-600">CONNECT</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Find Jobs</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Dashboard</Link>
                <div className="relative">
                  <button onClick={() => setShowNotifs(!showNotifs)} className="text-slate-600 hover:text-blue-600 transition-colors relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-xl py-2 max-h-96 overflow-y-auto z-50">
                      <div className="px-4 py-2 border-b font-semibold text-sm">Notifications</div>
                      {notifications.filter(n => n.userId === user.id).length > 0 ? (
                        notifications.filter(n => n.userId === user.id).map(n => (
                          <div key={n.id} className="px-4 py-3 border-b hover:bg-slate-50 text-xs">
                            {n.message}
                            <div className="text-slate-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-slate-400 text-sm">No notifications</div>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4 border-l pl-8">
                  <Link to="/profile" className="flex items-center space-x-2 text-slate-700 hover:text-blue-600">
                    <UserIcon className="w-5 h-5" />
                    <span className="font-medium text-sm">{user.name}</span>
                  </Link>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium">Log In</Link>
                <Link to="/login" className="bg-blue-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-blue-700 shadow-md transition-all active:scale-95">Sign Up</Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b py-4 space-y-4 px-4">
          <Link to="/" className="block text-slate-600 font-medium">Find Jobs</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block text-slate-600 font-medium">Dashboard</Link>
              <Link to="/profile" className="block text-slate-600 font-medium">Profile</Link>
              <button onClick={handleLogout} className="w-full text-left text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-slate-600 font-medium">Log In</Link>
              <Link to="/login" className="block bg-blue-600 text-white px-4 py-2 rounded text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
