
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Job, Application, UserRole, Notification, ApplicationStatus, Interview, JobStatus } from '../types';

interface UserWithPassword extends User {
  password?: string;
}

interface AppContextType {
  user: User | null;
  jobs: Job[];
  applications: Application[];
  notifications: Notification[];
  registeredUsers: User[];
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  postJob: (job: Partial<Job>) => void;
  updateJob: (jobId: string, data: Partial<Job>) => void;
  deleteJob: (id: string) => void;
  applyForJob: (jobId: string) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  scheduleInterview: (id: string, interview: Interview) => void;
  addNotification: (userId: string, message: string) => void;
  isOwnerOrAdmin: (job: Job) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_JOBS: Job[] = [
  { 
    id: '1', 
    employerId: 'e1', 
    companyName: 'TechCorp', 
    title: 'Senior React Developer', 
    location: 'Remote, India', 
    salary: '₹20L - ₹30L', 
    skills: ['React', 'TypeScript', 'Tailwind'], 
    description: 'Expert React dev needed for exciting new project.', 
    postedAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
    type: 'Full-time',
    status: JobStatus.ACTIVE 
  },
  { 
    id: '2', 
    employerId: 'e2', 
    companyName: 'FinStream', 
    title: 'Backend Engineer', 
    location: 'Bangalore, KA', 
    salary: '₹15L - ₹25L', 
    skills: ['Node.js', 'PostgreSQL'], 
    description: 'Join our fintech backend team.', 
    postedAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),
    type: 'Full-time',
    status: JobStatus.ACTIVE 
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<UserWithPassword[]>(() => {
    const saved = localStorage.getItem('jb_all_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('jb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('jb_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('jb_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('jb_notifs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => localStorage.setItem('jb_all_users', JSON.stringify(registeredUsers)), [registeredUsers]);
  useEffect(() => localStorage.setItem('jb_user', JSON.stringify(user)), [user]);
  useEffect(() => localStorage.setItem('jb_jobs', JSON.stringify(jobs)), [jobs]);
  useEffect(() => localStorage.setItem('jb_apps', JSON.stringify(applications)), [applications]);
  useEffect(() => localStorage.setItem('jb_notifs', JSON.stringify(notifications)), [notifications]);

  const signup = (name: string, email: string, password: string, role: UserRole) => {
    const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return false;

    const newUser: UserWithPassword = {
      id: Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      role,
      name,
      password // Store password for future logins
    };
    
    setRegisteredUsers([...registeredUsers, newUser]);
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    return true;
  };

  const login = (email: string, password: string) => {
    // Admin override
    if (email === 'Shahnawazhussainsayyed313@gmail.com' && password === 'Kazmi@123') {
      const admin: User = {
        id: 'admin_id',
        email,
        role: UserRole.ADMIN,
        name: 'ADMIN SHAHNAWAZ',
      };
      setUser(admin);
      return true;
    }

    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      const { password: _, ...userWithoutPassword } = found;
      setUser(userWithoutPassword);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const updateUser = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    setRegisteredUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
  };

  const isOwnerOrAdmin = (job: Job) => {
    if (!user) return false;
    return user.role === UserRole.ADMIN || job.employerId === user.id;
  };

  const postJob = (job: Partial<Job>) => {
    if (!user || user.role === UserRole.CANDIDATE) return;

    const newJob: Job = {
      id: Math.random().toString(36).substr(2, 9),
      employerId: user.id,
      companyName: user.companyName || user.name || 'Anonymous Company',
      companyLogo: user.companyLogo,
      title: job.title || '',
      location: job.location || 'Remote',
      salary: job.salary || 'Competitive',
      skills: job.skills || [],
      description: job.description || '',
      postedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: job.type || 'Full-time',
      status: JobStatus.ACTIVE // Changed from PENDING as per user request flow
    };
    setJobs([newJob, ...jobs]);
  };

  const updateJob = (jobId: string, data: Partial<Job>) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job || !isOwnerOrAdmin(job)) return;

    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, ...data, updatedAt: new Date().toISOString() } 
        : j
    ));

    if (data.status && user?.role === UserRole.ADMIN) {
      addNotification(job.employerId, `Your job "${job.title}" is now ${data.status.toLowerCase()}.`);
    }
  };

  const deleteJob = (id: string) => {
    const job = jobs.find(j => j.id === id);
    if (!job || !isOwnerOrAdmin(job)) return;

    setJobs(prev => prev.map(j => 
      j.id === id ? { ...j, status: JobStatus.DELETED, updatedAt: new Date().toISOString() } : j
    ));
  };

  const applyForJob = (jobId: string) => {
    if (!user || user.role !== UserRole.CANDIDATE) return;
    const job = jobs.find(j => j.id === jobId);
    if (!job || job.status !== JobStatus.ACTIVE) return;
    
    const exists = applications.find(a => a.jobId === jobId && a.candidateId === user.id);
    if (exists) return;

    const newApp: Application = {
      id: Math.random().toString(36).substr(2, 9),
      jobId,
      candidateId: user.id,
      status: ApplicationStatus.APPLIED,
      appliedDate: new Date().toISOString(),
      candidateName: user.name,
      jobTitle: job.title
    };
    setApplications([...applications, newApp]);
    addNotification(job.employerId, `New application from ${user.name} for ${job.title}`);
  };

  const updateApplicationStatus = (id: string, status: ApplicationStatus) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    const job = jobs.find(j => j.id === app.jobId);
    if (!job || !isOwnerOrAdmin(job)) return;

    setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
    addNotification(app.candidateId, `Your application status for ${app.jobTitle} changed to ${status.replace('_', ' ')}`);
  };

  const scheduleInterview = (id: string, interview: Interview) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    const job = jobs.find(j => j.id === app.jobId);
    if (!job || !isOwnerOrAdmin(job)) return;

    setApplications(apps => apps.map(a => a.id === id ? { ...a, status: ApplicationStatus.INTERVIEW_SCHEDULED, interviewDetails: interview } : a));
    addNotification(app.candidateId, `Your interview for ${app.jobTitle} is scheduled on ${interview.date} at ${interview.time} via ${interview.mode}`);
  };

  const addNotification = (userId: string, message: string) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      message,
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications([newNotif, ...notifications]);
  };

  return (
    <AppContext.Provider value={{ 
      user, jobs, applications, notifications, registeredUsers,
      login, signup, logout, updateUser, postJob, updateJob, deleteJob, applyForJob, 
      updateApplicationStatus, scheduleInterview, addNotification, isOwnerOrAdmin
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
