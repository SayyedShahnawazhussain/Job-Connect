
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ApplicationStatus } from '../types';
import { Clock, CheckCircle, Calendar, FileText, MapPin, Video, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CandidateDashboard: React.FC = () => {
  const { user, applications, jobs } = useAppContext();
  const myApplications = applications.filter(a => a.candidateId === user?.id);

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
          <h1 className="text-4xl font-extrabold text-slate-900">Hello, {user?.name}!</h1>
          <p className="text-slate-500 mt-2">Track and manage your career progress.</p>
        </div>
        <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
          Explore New Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-xs font-bold uppercase tracking-widest">Applied</div>
              <div className="text-3xl font-extrabold text-slate-900">{myApplications.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-xs font-bold uppercase tracking-widest">Interviews</div>
              <div className="text-3xl font-extrabold text-amber-500">
                {myApplications.filter(a => a.status === ApplicationStatus.INTERVIEW_SCHEDULED).length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-xs font-bold uppercase tracking-widest">Offers</div>
              <div className="text-3xl font-extrabold text-emerald-500">
                {myApplications.filter(a => a.status === ApplicationStatus.HIRED).length}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="text-slate-400 mb-1 text-xs font-bold uppercase tracking-widest">Rejected</div>
              <div className="text-3xl font-extrabold text-slate-300">
                {myApplications.filter(a => a.status === ApplicationStatus.REJECTED).length}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Recent Applications</h2>
          <div className="space-y-4">
            {myApplications.length > 0 ? (
              myApplications.map(app => (
                <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                        {app.jobTitle.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">{app.jobTitle}</h3>
                        <div className="flex items-center text-sm text-slate-500 gap-3">
                          <span className="flex items-center"><Building2 className="w-3.5 h-3.5 mr-1" /> Tech Company</span>
                          <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(app.status)}`}>
                        {app.status.replace('_', ' ')}
                      </span>
                      <Link to={`/job/${app.jobId}`} className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </Link>
                    </div>
                  </div>
                  
                  {app.interviewDetails && (
                    <div className="mt-6 pt-6 border-t border-slate-50">
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-amber-800 font-bold flex items-center">
                            <Calendar className="w-4 h-4 mr-2" /> 
                            Interview Scheduled: {app.interviewDetails.name}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {new Date(app.interviewDetails.date).toLocaleDateString()} at {app.interviewDetails.time}
                          </div>
                          <div className="flex items-center">
                            {app.interviewDetails.mode === 'ONLINE' ? <Video className="w-4 h-4 mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
                            {app.interviewDetails.locationLink}
                          </div>
                        </div>
                        {app.interviewDetails.notes && (
                          <div className="mt-3 text-sm text-amber-600 italic">
                            Notes: {app.interviewDetails.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 mb-6">You haven't applied to any jobs yet.</p>
                <Link to="/" className="text-blue-600 font-bold hover:underline">Start your search</Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-4">Complete Your Profile</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Profiles with 100% completion get 3x more views from recruiters.</p>
              <div className="w-full bg-slate-800 h-2 rounded-full mb-6">
                <div className="bg-blue-500 h-2 rounded-full w-[65%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              </div>
              <Link to="/profile" className="block w-full bg-white text-slate-900 text-center py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                Edit Profile
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Top Job Matches</h3>
            <div className="space-y-6">
              {jobs.slice(0, 3).map(job => (
                <Link key={job.id} to={`/job/${job.id}`} className="group block">
                  <div className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{job.title}</div>
                  <div className="text-sm text-slate-500 flex justify-between mt-1">
                    <span>{job.companyName}</span>
                    <span className="text-emerald-600 font-medium">{job.salary}</span>
                  </div>
                </Link>
              ))}
            </div>
            <button className="w-full mt-8 text-blue-600 text-sm font-bold border-t pt-4 border-slate-50 hover:text-blue-700">
              View all recommendations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export default CandidateDashboard;
