
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Download, Eye, FileText, Github, Linkedin, Globe, User as UserIcon
} from 'lucide-react';
import { UserRole } from '../types';

const CandidateProfile: React.FC = () => {
  const { id } = useParams();
  const { registeredUsers, applications, jobs } = useAppContext();
  const navigate = useNavigate();

  const candidate = registeredUsers.find(u => u.id === id);
  const candidateApplications = applications.filter(a => a.candidateId === id);

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Candidate Not Found</h2>
          <button onClick={() => navigate(-1)} className="text-blue-600 font-bold hover:underline">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleViewResume = () => {
    if (candidate.resumeUrl) {
      window.open(candidate.resumeUrl, '_blank');
    } else {
      alert("No resume uploaded by this candidate.");
    }
  };

  const handleDownloadResume = () => {
    if (candidate.resumeUrl) {
      const link = document.createElement('a');
      link.href = candidate.resumeUrl;
      link.download = `${candidate.name}_Resume`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No resume uploaded by this candidate.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-slate-500 hover:text-blue-600 font-bold text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-32 h-32 bg-slate-100 rounded-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-inner shrink-0">
                  {candidate.profilePic ? (
                    <img src={candidate.profilePic} alt={candidate.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-16 h-16 text-slate-300" />
                  )}
                </div>
                <div className="flex-grow space-y-4">
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">{candidate.name}</h1>
                  <p className="text-slate-600 leading-relaxed font-medium text-lg">
                    {candidate.bio || "No professional summary provided."}
                  </p>
                  <div className="flex flex-wrap gap-4 text-slate-500 text-sm font-bold">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {candidate.email}</span>
                    <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {candidate.phone || 'No phone provided'}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {candidate.location || 'Location Not Set'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 space-y-10">
              <section>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" /> Experience
                </h3>
                <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {candidate.experience || "No experience details listed."}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" /> Education
                </h3>
                <div className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                  {candidate.education || "No education details listed."}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-black text-slate-900 mb-6">Skills</h3>
                <div className="flex flex-wrap gap-3">
                  {candidate.skills && candidate.skills.length > 0 ? (
                    candidate.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-2xl text-sm font-black border border-blue-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-400 italic">No skills listed.</p>
                  )}
                </div>
              </section>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
              <h3 className="text-xl font-black text-slate-900 mb-6">Applications to Your Jobs</h3>
              <div className="space-y-4">
                {candidateApplications.length > 0 ? (
                  candidateApplications.map(app => (
                    <div key={app.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900">{app.jobTitle}</div>
                        <div className="text-xs text-slate-400">Applied on {new Date(app.appliedDate).toLocaleDateString()}</div>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-white border border-slate-200 rounded-full text-slate-500">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No applications found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 sticky top-24">
              <h3 className="text-lg font-black text-slate-900 mb-6">Resume & Portfolio</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={handleViewResume}
                  className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                >
                  <Eye className="w-5 h-5" /> View Resume
                </button>
                <button 
                  onClick={handleDownloadResume}
                  className="w-full bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95"
                >
                  <Download className="w-5 h-5" /> Download PDF
                </button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                {candidate.linkedinUrl && (
                  <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 font-bold transition-colors">
                    <Linkedin className="w-5 h-5" /> LinkedIn Profile
                  </a>
                )}
                {candidate.githubUrl && (
                  <a href={candidate.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 font-bold transition-colors">
                    <Github className="w-5 h-5" /> GitHub Profile
                  </a>
                )}
                {candidate.website && (
                  <a href={candidate.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-blue-500 font-bold transition-colors">
                    <Globe className="w-5 h-5" /> Portfolio Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
