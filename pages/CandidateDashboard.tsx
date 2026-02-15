import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ApplicationStatus } from '../types';
import { Clock, CheckCircle, Calendar, FileText, MapPin, Video, Building2, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard: React.FC = () => {
  const { user, applications, jobs } = useAppContext();
  const myApplications = applications.filter(a => a.candidateId === user?.id);
  const scheduledInterviews = myApplications.filter(a => a.status === ApplicationStatus.INTERVIEW_SCHEDULED && a.interviewDetails);
  
  const [activeTab, setActiveTab] = useState<'APPS' | 'INTERVIEWS'>('APPS');

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'bg-slate-100 text-slate-600';
      case ApplicationStatus.UNDER_REVIEW: return 'bg-blue-50 text-blue-600';
      case ApplicationStatus.SHORTLISTED: return 'bg-purple-50 text-purple-600';
      case ApplicationStatus.INTERVIEW_SCHEDULED: return 'bg-amber-50 text-amber-600';
      case ApplicationStatus.HIRED: return 'bg-emerald-50 text-emerald-600';
      case ApplicationStatus.REJECTED: return 'bg-red-50 text-red-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Hello, {user?.name}!</h1>
          <p className="text-slate-500 mt-2 font-medium">Your career command center.</p>
        </div>
        <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:shadow-blue-200 transition-all hover:bg-blue-700 active:scale-95">
          Find New Opportunities
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-[10px] font-black uppercase tracking-widest">Applied</div>
              <div className="text-3xl font-black text-slate-900">{myApplications.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-[10px] font-black uppercase tracking-widest">Interviews</div>
              <div className="text-3xl font-black text-amber-500">{scheduledInterviews.length}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-[10px] font-black uppercase tracking-widest">Active Leads</div>
              <div className="text-3xl font-black text-blue-500">
                {myApplications.filter(a => a.status === ApplicationStatus.SHORTLISTED).length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-[10px] font-black uppercase tracking-widest">Hired</div>
              <div className="text-3xl font-black text-emerald-500">
                {myApplications.filter(a => a.status === ApplicationStatus.HIRED).length}
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('APPS')}
              className={`px-6 py-4 font-black text-sm transition-all border-b-4 ${activeTab === 'APPS' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              My Applications
            </button>
            <button 
              onClick={() => setActiveTab('INTERVIEWS')}
              className={`px-6 py-4 font-black text-sm transition-all border-b-4 ${activeTab === 'INTERVIEWS' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              Interview Schedule ({scheduledInterviews.length})
            </button>
          </div>

          <div className="space-y-4">
            {activeTab === 'APPS' ? (
              myApplications.length > 0 ? (
                myApplications.map(app => (
                  <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-xl border border-slate-100 group-hover:bg-blue-50 transition-colors">
                          {app.jobTitle.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{app.jobTitle}</h3>
                          <div className="flex items-center text-sm text-slate-500 gap-4 mt-1 font-medium">
                            <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1" /> Verified Employer</span>
                            <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {new Date(app.appliedDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                          {app.status.replace('_', ' ')}
                        </span>
                        <Link to={`/job/${app.jobId}`} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all">
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-20 text-center rounded-[3rem] border-4 border-dashed border-slate-100">
                  <FileText className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-500 font-bold text-lg">No applications yet.</p>
                  <Link to="/" className="text-blue-600 font-black hover:underline mt-2 block">Browse Job Listings</Link>
                </div>
              )
            ) : (
              scheduledInterviews.length > 0 ? (
                scheduledInterviews.map(app => (
                  <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-amber-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6">
                       <span className="bg-amber-100 text-amber-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                         Round Confirmed
                       </span>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 mb-1">{app.interviewDetails?.name}</h3>
                        <p className="text-slate-500 font-medium">For <span className="text-blue-600 font-black">{app.jobTitle}</span></p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Date & Time</label>
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            <Calendar className="w-4 h-4 text-blue-500" /> 
                            {new Date(app.interviewDetails!.date).toLocaleDateString()} at {app.interviewDetails!.time}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mode</label>
                          <div className="flex items-center gap-2 text-slate-700 font-bold">
                            {app.interviewDetails!.mode === 'ONLINE' ? <Video className="w-4 h-4 text-emerald-500" /> : <MapPin className="w-4 h-4 text-orange-500" />}
                            {app.interviewDetails!.mode}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Location / Link</label>
                          <div className="flex items-center gap-2 text-blue-600 font-bold truncate">
                            {app.interviewDetails!.mode === 'ONLINE' ? (
                              <a href={app.interviewDetails!.locationLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:underline">
                                <ExternalLink className="w-4 h-4" /> Join Meeting
                              </a>
                            ) : (
                              <span className="text-slate-700">{app.interviewDetails!.locationLink}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {app.interviewDetails!.notes && (
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Instructions from Employer</label>
                          <p className="text-slate-600 text-sm italic font-medium">"{app.interviewDetails!.notes}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white p-20 text-center rounded-[3rem] border-4 border-dashed border-slate-100">
                  <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-500 font-bold text-lg">No interviews scheduled yet.</p>
                  <p className="text-slate-400 text-sm mt-1">Employers will schedule rounds after shortlisting.</p>
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">Profile Strength</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">Complete your profile to unlock 3x more interview invites from top companies.</p>
              <div className="w-full bg-slate-800 h-3 rounded-full mb-8 overflow-hidden">
                <div className="bg-blue-500 h-3 rounded-full w-[65%] shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:w-[70%] transition-all duration-700"></div>
              </div>
              <Link to="/profile" className="block w-full bg-white text-slate-900 text-center py-4 rounded-2xl font-black hover:bg-slate-50 transition-all shadow-xl active:scale-95">
                Optimize Profile
              </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]"></div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-8">Recommended For You</h3>
            <div className="space-y-8">
              {jobs.slice(0, 3).map(job => (
                <Link key={job.id} to={`/job/${job.id}`} className="group block">
                  <div className="font-black text-slate-800 group-hover:text-blue-600 transition-colors mb-1">{job.title}</div>
                  <div className="text-sm flex justify-between">
                    <span className="text-slate-400 font-bold">{job.companyName}</span>
                    <span className="text-emerald-600 font-black">{job.salary}</span>
                  </div>
                </Link>
              ))}
            </div>
            <button className="w-full mt-10 text-blue-600 text-sm font-black border-t pt-6 border-slate-50 hover:text-blue-700 transition-colors">
              View All Matches
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;