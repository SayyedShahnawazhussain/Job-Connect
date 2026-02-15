
import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  MapPin, Building2, Clock, ArrowLeft, CheckCircle, Share2, Globe, 
  Edit2, Trash2, Copy, MessageCircle, Linkedin, Check, FileText, Upload, X, Loader2 
} from 'lucide-react';
import { UserRole, JobStatus } from '../types';

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const { jobs, applyForJob, user, applications, isOwnerOrAdmin, deleteJob, updateUser } = useAppContext();
  const navigate = useNavigate();
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Application Modal States
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [tempName, setTempName] = useState(user?.name || '');
  const [tempResume, setTempResume] = useState<string | null>(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const job = jobs.find(j => j.id === id);
  const alreadyApplied = user && applications.some(a => a.jobId === id && a.candidateId === user.id);

  if (!job || job.status === JobStatus.DELETED) return <div className="p-20 text-center text-slate-500 font-bold">This job is no longer available.</div>;

  const jobUrl = window.location.href;
  const shareText = `Check out this job: ${job.title} at ${job.companyName} on JOB CONNECT!`;

  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if profile is complete (Name and Resume)
    if (!user.resumeUrl) {
      setShowApplyModal(true);
      return;
    }

    applyForJob(job.id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setResumeFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setTempResume(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompleteAndApply = () => {
    if (!tempResume && !user?.resumeUrl) {
      alert("Please upload your resume first.");
      return;
    }

    // Update profile first
    updateUser({
      name: tempName,
      resumeUrl: tempResume || user?.resumeUrl
    });

    // Then apply
    applyForJob(job.id);
    setShowApplyModal(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(job.id);
      navigate('/dashboard');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + jobUrl)}`;
    window.open(url, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link to="/" className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Search
          </Link>
          
          <div className="flex gap-3 relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Share2 className="w-4 h-4" /> Share
            </button>

            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <button 
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm font-bold text-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <Copy className="w-4 h-4 text-slate-400" /> Copy Link
                    </div>
                    {copied && <Check className="w-4 h-4 text-emerald-500" />}
                  </button>
                  <button 
                    onClick={shareOnWhatsApp}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-sm font-bold text-slate-700"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-500" /> WhatsApp
                  </button>
                  <button 
                    onClick={shareOnLinkedIn}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm font-bold text-slate-700"
                  >
                    <Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn
                  </button>
                </div>
              </>
            )}

            {isOwnerOrAdmin(job) && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                  <Edit2 className="w-4 h-4" /> Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 rounded-xl text-sm font-bold text-red-600 hover:bg-red-100 shadow-sm transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
          <div className="h-40 bg-slate-900 relative">
            <div className="absolute inset-0 bg-blue-600/10"></div>
            <Link to={`/company/${job.employerId}`} className="absolute -bottom-10 left-10 p-4 bg-white rounded-3xl shadow-2xl border border-slate-100 w-32 h-32 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
              {job.companyLogo ? (
                <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain p-2" />
              ) : (
                <div className="text-4xl font-black text-blue-600 uppercase">{job.companyName.charAt(0)}</div>
              )}
            </Link>
          </div>

          <div className="pt-16 pb-10 px-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                  <Link to={`/company/${job.employerId}`} className="flex items-center text-blue-600 hover:underline"><Building2 className="w-4 h-4 mr-1" /> {job.companyName}</Link>
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.type}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                    job.status === JobStatus.ACTIVE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    job.status === JobStatus.PENDING ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                 }`}>
                   {job.status}
                 </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-y border-slate-50 py-10 mb-10">
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Salary Range</div>
                <div className="text-xl font-extrabold text-slate-900">{job.salary}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Job Type</div>
                <div className="text-xl font-extrabold text-slate-900">{job.type}</div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Posted On</div>
                <div className="text-xl font-extrabold text-slate-900">{new Date(job.postedAt).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none mb-12">
              <h2 className="text-xl font-bold mb-4">Job Description</h2>
              <p className="text-slate-600 leading-relaxed mb-8">{job.description}</p>
              
              <h3 className="text-lg font-bold mb-4">Required Skills</h3>
              <div className="flex flex-wrap gap-2 mb-10">
                {job.skills.map(skill => (
                  <span key={skill} className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {user?.role === UserRole.CANDIDATE && job.status === JobStatus.ACTIVE && (
              <div className="sticky bottom-0 bg-white pt-6 border-t border-slate-50">
                {alreadyApplied ? (
                  <div className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-emerald-100">
                    <CheckCircle className="w-6 h-6" /> You have applied for this job
                  </div>
                ) : (
                  <button 
                    onClick={handleApply}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98]"
                  >
                    Apply For Job (One Click)
                  </button>
                )}
              </div>
            )}
            
            {job.status !== JobStatus.ACTIVE && user?.role === UserRole.CANDIDATE && (
               <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-center font-bold text-sm">
                 Applications are currently not being accepted for this position.
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Profile & Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] px-6">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Complete Application</h3>
                <p className="text-slate-500 text-sm font-medium">Please provide your details to apply</p>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                <input 
                  type="text" 
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800 transition-all"
                  placeholder="Enter your professional name"
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Upload Resume (PDF/DOC)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${tempResume ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100 hover:border-blue-400 hover:bg-blue-50/30'}`}
                >
                  <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  <div className="flex flex-col items-center">
                    {isUploading ? (
                      <Loader2 className="w-10 h-10 text-blue-600 mb-3 animate-spin" />
                    ) : tempResume ? (
                      <div className="flex flex-col items-center">
                        <CheckCircle className="w-10 h-10 text-emerald-500 mb-3" />
                        <p className="text-emerald-700 font-bold truncate max-w-[200px]">{resumeFileName}</p>
                        <p className="text-emerald-500 text-xs mt-1">Ready to apply!</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-10 h-10 text-blue-600 mb-3" />
                        <p className="text-slate-800 font-bold">Choose a file</p>
                        <p className="text-slate-400 text-xs mt-1">PDF, DOC, DOCX up to 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleCompleteAndApply}
                  disabled={!tempResume && !user?.resumeUrl}
                  className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black text-lg hover:bg-blue-700 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" /> Confirm & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
