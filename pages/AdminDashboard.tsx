
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Shield, Users, Building, Activity, AlertTriangle, Search, Trash2, Edit2, BarChart3, CheckCircle, XCircle, Eye } from 'lucide-react';
import { JobStatus } from '../types';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { jobs, deleteJob, updateJob } = useAppContext();
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'JOBS' | 'USERS'>('JOBS');
  const [searchTerm, setSearchTerm] = useState('');

  // Exclude deleted jobs from management view unless specifically requested
  const manageableJobs = jobs.filter(j => j.status !== JobStatus.DELETED);

  const stats = [
    { label: 'Total Users', value: '14,202', icon: <Users className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Jobs', value: manageableJobs.filter(j => j.status === JobStatus.ACTIVE).length.toString(), icon: <Building className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' },
    { label: 'Pending Approval', value: manageableJobs.filter(j => j.status === JobStatus.PENDING).length.toString(), icon: <Activity className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600' },
    { label: 'System Health', value: '100%', icon: <Shield className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600' },
  ];

  const handleApprove = (id: string) => {
    updateJob(id, { status: JobStatus.ACTIVE });
  };

  const handleReject = (id: string) => {
    updateJob(id, { status: JobStatus.REJECTED });
  };

  const toggleStatus = (id: string, current: JobStatus) => {
    const next = current === JobStatus.ACTIVE ? JobStatus.INACTIVE : JobStatus.ACTIVE;
    updateJob(id, { status: next });
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center gap-3">
            <Shield className="w-10 h-10 text-blue-600" /> Admin Command Center
          </h1>
          <p className="text-slate-500 mt-2">Manage the entire JOB CONNECT ecosystem.</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">Logged In As</div>
          <div className="text-slate-900 font-bold">Admin: Shahnawaz</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className={`p-3 rounded-2xl w-fit mb-4 ${stat.color}`}>{stat.icon}</div>
            <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-8 bg-white p-2 rounded-2xl border border-slate-100 w-fit">
        <button 
          onClick={() => setActiveView('OVERVIEW')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeView === 'OVERVIEW' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveView('JOBS')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeView === 'JOBS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Manage Jobs
        </button>
        <button 
          onClick={() => setActiveView('USERS')}
          className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${activeView === 'USERS' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          Manage Users
        </button>
      </div>

      {activeView === 'JOBS' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search jobs by title or company..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 items-center">
               <span className="text-sm font-bold text-slate-400">Total: {manageableJobs.length}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Job Info</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Management Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {manageableJobs
                  .filter(j => j.title.toLowerCase().includes(searchTerm.toLowerCase()) || j.companyName.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(job => (
                  <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-400">{new Date(job.postedAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{job.companyName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        job.status === JobStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        job.status === JobStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        job.status === JobStatus.REJECTED ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {job.status === JobStatus.PENDING && (
                          <>
                            <button 
                              onClick={() => handleApprove(job.id)}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleReject(job.id)}
                              className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {(job.status === JobStatus.ACTIVE || job.status === JobStatus.INACTIVE) && (
                          <button 
                            onClick={() => toggleStatus(job.id, job.status)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${job.status === JobStatus.ACTIVE ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                          >
                            {job.status === JobStatus.ACTIVE ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                        <Link to={`/job/${job.id}`} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => { if(window.confirm('Delete this job?')) deleteJob(job.id); }}
                          className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeView === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[400px]">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" /> Platform Growth
            </h3>
            <div className="space-y-8">
              {[
                { label: 'Candidate Signups', progress: '75%', color: 'bg-blue-600' },
                { label: 'Job Approval Rate', progress: '92%', color: 'bg-emerald-600' },
                { label: 'Employer Retention', progress: '60%', color: 'bg-purple-600' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="text-slate-900">{item.progress}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,0,0,0.1)]`} style={{ width: item.progress }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> Platform Safety
            </h3>
            <div className="space-y-4">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 leading-relaxed backdrop-blur-sm">
                <span className="text-amber-400 font-bold">WARNING:</span> Job post "Urgent Remote Data Entry" from IP 192.168.1.1 has been flagged for potential spam behavior.
              </div>
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-300 italic">
                All systems functional. No pending security patches.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
