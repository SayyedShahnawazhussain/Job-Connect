
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ApplicationStatus, InterviewMode, Interview, JobStatus } from '../types';
import { Plus, Users, Briefcase, Calendar, X, Check, Search, Download, MapPin, ExternalLink, Edit2, AlertCircle, Video, MapPinned, Info, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployerDashboard: React.FC = () => {
  const { user, jobs, applications, updateApplicationStatus, scheduleInterview, postJob, deleteJob } = useAppContext();
  
  const employerJobs = jobs.filter(j => j.employerId === user?.id && j.status !== JobStatus.DELETED);
  const relevantApplications = applications.filter(a => employerJobs.some(j => j.id === a.jobId));
  
  const [activeTab, setActiveTab] = useState<'JOBS' | 'APPLICATIONS'>('APPLICATIONS');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  const [intName, setIntName] = useState('');
  const [intDate, setIntDate] = useState('');
  const [intTime, setIntTime] = useState('');
  const [intMode, setIntMode] = useState<InterviewMode>(InterviewMode.ONLINE);
  const [intLocation, setIntLocation] = useState('');
  const [intNotes, setIntNotes] = useState('');

  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobLocation, setNewJobLocation] = useState('');
  const [newJobSalary, setNewJobSalary] = useState('');
  const [newJobType, setNewJobType] = useState('Full-time');
  const [newJobDesc, setNewJobDesc] = useState('');

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    postJob({ 
      title: newJobTitle, 
      location: newJobLocation, 
      salary: newJobSalary, 
      type: newJobType,
      description: newJobDesc,
      skills: ['Required'] 
    });
    setShowJobModal(false);
    setNewJobTitle('');
    setNewJobLocation('');
    setNewJobSalary('');
    setNewJobDesc('');
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showInterviewModal) return;

    const interview: Interview = {
      id: Math.random().toString(36).substr(2, 9),
      applicationId: showInterviewModal,
      name: intName,
      date: intDate,
      time: intTime,
      mode: intMode,
      locationLink: intLocation,
      notes: intNotes
    };

    scheduleInterview(showInterviewModal, interview);
    setShowInterviewModal(null);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    
    setIntName('');
    setIntDate('');
    setIntTime('');
    setIntLocation('');
    setIntNotes('');
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.ACTIVE: return <span className="text-emerald-500 flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider"><Check className="w-3 h-3" /> Active</span>;
      case JobStatus.PENDING: return <span className="text-amber-500 flex items-center gap-1 font-bold text-[10px] uppercase tracking-wider"><AlertCircle className="w-3 h-3" /> Reviewing</span>;
      case JobStatus.INACTIVE: return <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">Inactive</span>;
      case JobStatus.REJECTED: return <span className="text-red-500 font-bold text-[10px] uppercase tracking-wider">Rejected</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {showSuccessToast && (
        <div className="fixed top-24 right-8 z-[110] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 fade-in duration-300">
          <CheckCircle2 className="w-6 h-6" />
          <span className="font-bold">Operation successful!</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Employer Hub</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-slate-500 font-medium">Manage recruitment lifecycle at {user?.companyName || 'your company'}.</p>
            <Link to={`/company/${user?.id}`} className="text-blue-600 text-sm font-bold flex items-center gap-1.5 hover:underline">
              <ExternalLink className="w-4 h-4" /> Branding Page
            </Link>
          </div>
        </div>
        <button 
          onClick={() => setShowJobModal(true)}
          className="bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 hover:bg-blue-700 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Post New Job
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-4"><Briefcase className="w-6 h-6" /></div>
          <div className="text-4xl font-black text-slate-900">{employerJobs.length}</div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">Active Job Postings</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl w-fit mb-4"><Users className="w-6 h-6" /></div>
          <div className="text-4xl font-black text-slate-900">{relevantApplications.length}</div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">Total Applicants</div>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl w-fit mb-4"><Calendar className="w-6 h-6" /></div>
          <div className="text-4xl font-black text-slate-900">
            {relevantApplications.filter(a => a.status === ApplicationStatus.INTERVIEW_SCHEDULED).length}
          </div>
          <div className="text-slate-400 text-xs font-black uppercase tracking-widest mt-2">Upcoming Interviews</div>
        </div>
      </div>

      <div className="flex border-b border-slate-200 mb-10 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('APPLICATIONS')}
          className={`px-8 py-5 font-black text-sm whitespace-nowrap transition-all border-b-4 ${activeTab === 'APPLICATIONS' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Candidate Pipelines
        </button>
        <button 
          onClick={() => setActiveTab('JOBS')}
          className={`px-8 py-5 font-black text-sm whitespace-nowrap transition-all border-b-4 ${activeTab === 'JOBS' ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
        >
          Active Job Listings
        </button>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'APPLICATIONS' && (
          <div className="space-y-6">
            {relevantApplications.length > 0 ? (
              relevantApplications.map(app => (
                <div key={app.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group">
                  <div className="flex flex-col lg:flex-row justify-between gap-8">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center font-black text-2xl text-slate-300 border border-slate-100 shadow-inner group-hover:bg-blue-50 group-hover:text-blue-300 transition-colors">
                        {app.candidateName.charAt(0)}
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-900">{app.candidateName}</h3>
                        <p className="text-slate-500 font-medium">Applied for <span className="text-blue-600 font-black">{app.jobTitle}</span></p>
                        <div className="flex flex-wrap items-center gap-4 mt-4">
                          <button className="text-xs font-black text-blue-600 flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                            <Download className="w-4 h-4" /> View Resume
                          </button>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${
                            app.status === ApplicationStatus.APPLIED ? 'bg-slate-50 text-slate-500 border-slate-100' :
                            app.status === ApplicationStatus.INTERVIEW_SCHEDULED ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            app.status === ApplicationStatus.SHORTLISTED ? 'bg-purple-50 text-purple-600 border-purple-100' :
                            app.status === ApplicationStatus.HIRED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-blue-50 text-blue-600 border-blue-100'
                          }`}>
                            {app.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {app.status === ApplicationStatus.APPLIED && (
                        <>
                          <button 
                            onClick={() => updateApplicationStatus(app.id, ApplicationStatus.SHORTLISTED)}
                            className="flex-grow lg:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-lg transition-all active:scale-95"
                          >
                            Shortlist
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(app.id, ApplicationStatus.REJECTED)}
                            className="flex-grow lg:flex-none px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      
                      {app.status === ApplicationStatus.SHORTLISTED && (
                        <button 
                          onClick={() => {
                            setShowInterviewModal(app.id);
                            setIntName(`${app.candidateName} - Interview`);
                          }}
                          className="w-full lg:w-auto px-10 py-4 bg-amber-500 text-white rounded-2xl text-sm font-black hover:bg-amber-600 shadow-lg hover:shadow-amber-200 transition-all flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-5 h-5" /> Schedule Interview
                        </button>
                      )}

                      {app.status === ApplicationStatus.INTERVIEW_SCHEDULED && (
                        <button 
                          onClick={() => updateApplicationStatus(app.id, ApplicationStatus.HIRED)}
                          className="w-full lg:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Check className="w-5 h-5" /> Mark as Hired
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
                <Users className="w-20 h-20 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-slate-900">Your pipeline is empty</h3>
                <p className="text-slate-400 mt-2 font-medium">New candidates will appear here as they apply.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'JOBS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {employerJobs.map(job => (
              <div key={job.id} className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-black text-slate-900 text-2xl mb-2 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="mt-2">{getStatusLabel(job.status)}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all">
                      <Edit2 className="w-6 h-6" />
                    </button>
                    <button onClick={() => { if(window.confirm('Delete this listing?')) deleteJob(job.id); }} className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center text-sm text-slate-500 gap-6 mb-10">
                  <span className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl"><MapPin className="w-4 h-4 text-blue-500" /> {job.location}</span>
                  <span className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-black">₹ {job.salary}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-100 pt-8">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </div>
                  <Link to={`/job/${job.id}`} className="text-blue-600 font-black text-sm hover:underline flex items-center gap-1">
                    Live View <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showJobModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[150] px-4">
          <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-black text-slate-900 tracking-tight">Post New Role</h3>
              <button onClick={() => setShowJobModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-8 h-8 text-slate-400" /></button>
            </div>
            <form onSubmit={handlePostJob} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Job Designation</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-lg transition-all"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newJobTitle}
                  onChange={(e) => setNewJobTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Working Location</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 outline-none focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                    placeholder="e.g. Mumbai, Remote"
                    value={newJobLocation}
                    onChange={(e) => setNewJobLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Annual Compensation</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 outline-none focus:ring-4 focus:ring-blue-100 font-bold transition-all"
                    placeholder="e.g. 15L - 25L"
                    value={newJobSalary}
                    onChange={(e) => setNewJobSalary(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Employment Type</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 outline-none focus:ring-4 focus:ring-blue-100 font-black transition-all appearance-none cursor-pointer"
                  value={newJobType}
                  onChange={(e) => setNewJobType(e.target.value)}
                >
                   <option>Full-time</option>
                   <option>Part-time</option>
                   <option>Contract</option>
                   <option>Remote Only</option>
                   <option>Hybrid</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role Description</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 outline-none focus:ring-4 focus:ring-blue-100 min-h-[150px] transition-all"
                  placeholder="Share details about responsibilities, team, and benefits..."
                  value={newJobDesc}
                  onChange={(e) => setNewJobDesc(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-blue-700 shadow-2xl transition-all transform active:scale-[0.98]">
                Post Job
              </button>
            </form>
          </div>
        </div>
      )}

      {showInterviewModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[150] px-4">
           <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-10">
               <div>
                 <h3 className="text-3xl font-black text-slate-900 tracking-tight">Schedule Interview</h3>
                 <p className="text-slate-400 text-sm mt-1 font-medium">Inviting candidate for the next round</p>
               </div>
               <button onClick={() => setShowInterviewModal(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X className="w-8 h-8 text-slate-400" /></button>
             </div>
             
             <form onSubmit={handleScheduleSubmit} className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Interview Round Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Technical Round 1"
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 font-bold outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                    value={intName}
                    onChange={(e) => setIntName(e.target.value)}
                    required
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 font-bold outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                      value={intDate}
                      onChange={(e) => setIntDate(e.target.value)}
                      required
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Time</label>
                    <input 
                      type="time"
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 font-bold outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                      value={intTime}
                      onChange={(e) => setIntTime(e.target.value)}
                      required
                    />
                 </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Interview Mode</label>
                  <div className="grid grid-cols-2 gap-6">
                    <button 
                      type="button" 
                      onClick={() => setIntMode(InterviewMode.ONLINE)}
                      className={`flex items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 font-black transition-all ${intMode === InterviewMode.ONLINE ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-amber-200'}`}
                    >
                      <Video className="w-5 h-5" /> Online
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIntMode(InterviewMode.OFFLINE)}
                      className={`flex items-center justify-center gap-3 p-5 rounded-[1.5rem] border-2 font-black transition-all ${intMode === InterviewMode.OFFLINE ? 'bg-amber-500 border-amber-500 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-amber-200'}`}
                    >
                      <MapPinned className="w-5 h-5" /> Offline
                    </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                    {intMode === InterviewMode.ONLINE ? 'Meeting Link (Zoom/Google Meet)' : 'Office Address'}
                  </label>
                  <input 
                    type="text" 
                    placeholder={intMode === InterviewMode.ONLINE ? 'https://meet.google.com/...' : 'Full office address...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 font-bold outline-none focus:ring-4 focus:ring-amber-100 transition-all"
                    value={intLocation}
                    onChange={(e) => setIntLocation(e.target.value)}
                    required
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Notes / Instructions</label>
                  <textarea 
                    placeholder="e.g. Please bring a copy of your ID. Ensure a stable internet connection."
                    className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] p-5 outline-none focus:ring-4 focus:ring-amber-100 min-h-[100px] transition-all"
                    value={intNotes}
                    onChange={(e) => setIntNotes(e.target.value)}
                  />
               </div>

               <button type="submit" className="w-full bg-amber-500 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-amber-600 shadow-2xl transition-all transform active:scale-[0.98]">
                 Schedule & Send Notification
               </button>
             </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default EmployerDashboard;
