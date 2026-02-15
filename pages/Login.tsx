
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { UserRole } from '../types';
import { Mail, Lock, ShieldCheck, User as UserIcon, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.CANDIDATE);
  const [error, setError] = useState('');
  const { login, signup } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!name || !email || password.length < 6) {
        setError('Please fill all fields. Password must be at least 6 characters.');
        return;
      }
      const success = signup(name, email, password, role);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('An account with this email already exists. Please log in.');
      }
    } else {
      const success = login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-6 py-12 bg-slate-50">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl shadow-xl mb-6">
            <UserIcon className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-slate-500 font-medium">
            {isSignUp ? 'Join JOB CONNECT today' : 'Log in to your account'}
          </p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-600"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1 text-center">Select Account Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setRole(UserRole.CANDIDATE)}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === UserRole.CANDIDATE ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                  >
                    Candidate
                  </button>
                  <button 
                    type="button"
                    onClick={() => setRole(UserRole.EMPLOYER)}
                    className={`py-3.5 px-4 rounded-2xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all ${role === UserRole.EMPLOYER ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'}`}
                  >
                    Employer
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Full Name</label>
                  <div className="relative">
                    <UserIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignUp}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-xs font-bold bg-red-50 p-4 rounded-2xl flex items-center gap-2 border border-red-100">
                <ShieldCheck className="w-4 h-4" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-blue-700 shadow-2xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-sm text-slate-500 font-bold"
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"} <span className="text-blue-600 font-black hover:underline ml-1">
                {isSignUp ? 'Log In' : 'Sign Up'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
