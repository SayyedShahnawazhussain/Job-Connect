
import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Building2, Globe, MapPin, Briefcase, Mail, ArrowRight, Pencil, Save, X, Upload, Trash2, Plus, Camera, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';

const CompanyBranding: React.FC = () => {
  const { id } = useParams();
  const { jobs, user, updateUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // File inputs refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const teamPhotosInputRef = useRef<HTMLInputElement>(null);

  // Local state for live editing
  const [editData, setEditData] = useState({
    companyName: '',
    location: '',
    website: '',
    bio: '',
    cultureDescription: '',
    companyLogo: '',
    teamPhotos: [] as string[]
  });

  const isOwner = user?.id === id && user?.role === UserRole.EMPLOYER;

  // Sync edit data from user profile if owner, or fallback to jobs data
  useEffect(() => {
    if (user && isOwner) {
      setEditData({
        companyName: user.companyName || '',
        location: user.location || '',
        website: user.website || '',
        bio: user.bio || '',
        cultureDescription: user.cultureDescription || '',
        companyLogo: user.companyLogo || '',
        teamPhotos: user.teamPhotos || []
      });
    } else {
      // For public view of other companies, try to get some data from jobs
      const employerJobs = jobs.filter(j => j.employerId === id);
      if (employerJobs.length > 0) {
        setEditData({
          companyName: employerJobs[0].companyName,
          location: employerJobs[0].location,
          website: 'https://company.com', // Mocked as we don't have full user directory
          bio: 'Innovative technology leader focused on building the future.',
          cultureDescription: 'A collaborative and inclusive environment where everyone can grow.',
          companyLogo: employerJobs[0].companyLogo || '',
          teamPhotos: []
        });
      }
    }
  }, [id, user, jobs, isOwner]);

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (isOwner) {
      updateUser(editData);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast to avoid unknown type issues from FileList indexer in some TS environments
    const file = e.target.files?.[0] as File | undefined;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleInputChange('companyLogo', reader.result as string);
      // Fixed: Cast file to any to satisfy readAsDataURL when File type is ambiguous in the build context
      reader.readAsDataURL(file as any);
    }
  };

  const handleTeamPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          const newPhotos = [...editData.teamPhotos, reader.result as string];
          handleInputChange('teamPhotos', newPhotos);
        };
        // Fixed: Cast file to any to satisfy readAsDataURL when File type is ambiguous in the build context
        reader.readAsDataURL(file as any);
      });
    }
  };

  const removeTeamPhoto = (index: number) => {
    const filtered = editData.teamPhotos.filter((_, i) => i !== index);
    handleInputChange('teamPhotos', filtered);
  };

  const employerJobs = jobs.filter(j => j.employerId === id && j.status === 'ACTIVE');

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Hero Header */}
      <div className="relative h-[450px] bg-slate-900 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-purple-900/40 z-0"></div>
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {/* Floating Edit Controls */}
        {isOwner && (
          <div className="absolute top-8 right-8 z-50 flex gap-3">
            {saveSuccess && (
              <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-4">
                <CheckCircle2 className="w-4 h-4" /> Branding Saved!
              </div>
            )}
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all shadow-2xl backdrop-blur-md active:scale-95 ${
                isEditing 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
              }`}
            >
              {isEditing ? <><Save className="w-5 h-5" /> Save Branding</> : <><Pencil className="w-4 h-4" /> Edit Branding Page</>}
            </button>
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="p-3 bg-white/10 text-white border border-white/20 rounded-2xl hover:bg-red-500/20 hover:text-red-400 transition-all backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <div className="relative group inline-block">
            <div className={`w-32 h-32 md:w-40 md:h-40 bg-white rounded-[2.5rem] p-6 shadow-2xl mx-auto mb-8 flex items-center justify-center border-4 border-slate-800 overflow-hidden relative ${isEditing ? 'cursor-pointer' : ''}`}
                 onClick={() => isEditing && logoInputRef.current?.click()}>
              {editData.companyLogo ? (
                <img src={editData.companyLogo} alt={editData.companyName} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-16 h-16 text-blue-600" />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              )}
            </div>
            <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
          </div>

          {isEditing ? (
            <div className="space-y-4">
              <input 
                type="text"
                value={editData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="bg-white/10 border-b-2 border-blue-500 text-4xl md:text-5xl font-black text-white text-center outline-none w-full placeholder:text-white/20"
                placeholder="Company Name"
              />
              <div className="flex justify-center items-center gap-6 mt-6">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <input 
                    type="text"
                    value={editData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-transparent text-slate-300 outline-none w-40"
                    placeholder="Location"
                  />
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <input 
                    type="text"
                    value={editData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="bg-transparent text-slate-300 outline-none w-48"
                    placeholder="website.com"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg">{editData.companyName || 'Your Company Name'}</h1>
              <div className="flex justify-center items-center gap-8 mt-6 text-slate-300 font-bold tracking-wide">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5"><MapPin className="w-4 h-4 text-blue-400" /> {editData.location || 'Location Not Set'}</span>
                {editData.website && (
                  <a href={editData.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-full border border-blue-500/30 hover:bg-blue-600/30 transition-all">
                    <Globe className="w-4 h-4" /> {editData.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-20 px-6 grid grid-cols-1 lg:grid-cols-3 gap-20">
        {/* Left Column: About & Culture */}
        <div className="lg:col-span-2 space-y-20">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Mission & Vision</h2>
            </div>
            {isEditing ? (
              <textarea 
                value={editData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[2.5rem] outline-none focus:border-blue-500 focus:bg-white transition-all text-xl text-slate-600 leading-relaxed min-h-[200px] resize-none"
                placeholder="Describe your company's mission and journey..."
              />
            ) : (
              <p className="text-2xl text-slate-600 leading-relaxed font-light">
                {editData.bio || "Add an inspiring bio to attract candidates to your mission."}
              </p>
            )}
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-1 bg-purple-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Working at {editData.companyName}</h2>
            </div>
            <div className="bg-slate-50 p-12 rounded-[3.5rem] border border-slate-100 relative overflow-hidden group shadow-inner">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
               {isEditing ? (
                 <textarea 
                   value={editData.cultureDescription}
                   onChange={(e) => handleInputChange('cultureDescription', e.target.value)}
                   className="w-full bg-white border border-slate-200 p-6 rounded-3xl outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg text-slate-700 italic min-h-[150px] relative z-10"
                   placeholder="Describe your company culture, work life balance, and values..."
                 />
               ) : (
                 <p className="text-xl text-slate-700 leading-relaxed relative z-10 italic font-medium text-center">
                   "{editData.cultureDescription || 'Share the unique values and culture that make your workplace special.'}"
                 </p>
               )}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 relative z-10">
                  {['Transparency', 'Ownership', 'Impact', 'Innovation'].map(val => (
                    <div key={val} className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-sm text-center border border-white flex items-center justify-center">
                       <span className="font-bold text-slate-800 text-sm">{val}</span>
                    </div>
                  ))}
               </div>
            </div>
          </section>

          <section>
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-blue-600 rounded-full"></div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Environment</h2>
              </div>
              {isEditing && (
                <button 
                  onClick={() => teamPhotosInputRef.current?.click()}
                  className="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-5 h-5" /> Add Office Photos
                </button>
              )}
              <input type="file" ref={teamPhotosInputRef} className="hidden" accept="image/*" multiple onChange={handleTeamPhotoUpload} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {editData.teamPhotos.length > 0 ? (
                 editData.teamPhotos.map((photo, i) => (
                   <div key={i} className={`rounded-[2rem] overflow-hidden shadow-xl group relative ${i === 0 ? 'md:col-span-2' : ''}`}>
                      <img src={photo} alt="Team" className="w-full h-full object-cover aspect-video hover:scale-105 transition-transform duration-700" />
                      {isEditing && (
                        <button 
                          onClick={() => removeTeamPhoto(i)}
                          className="absolute top-4 right-4 bg-red-500 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                   </div>
                 ))
               ) : (
                 <div className="col-span-full py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] text-center">
                    <ImageIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No environment photos yet.</p>
                 </div>
               )}
            </div>
          </section>
        </div>

        {/* Right Column: Open Positions */}
        <div className="space-y-10">
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 sticky top-24">
            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
               <Briefcase className="w-7 h-7 text-blue-600" /> Currently Hiring
            </h3>
            <div className="space-y-4">
              {employerJobs.length > 0 ? (
                employerJobs.map(job => (
                  <Link key={job.id} to={`/job/${job.id}`} className="block p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
                    <div className="font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors text-lg">{job.title}</div>
                    <div className="flex justify-between items-center text-sm text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium"><MapPin className="w-4 h-4 text-blue-400" /> {job.location}</span>
                      <span className="font-black text-slate-900">{job.salary}</span>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 italic">
                  <p>No active openings at this time.</p>
                </div>
              )}
            </div>
            
            <div className="mt-12 pt-10 border-t border-slate-100">
               <div className="flex items-center gap-5 mb-8">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                     <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-lg">Never miss an update</h4>
                    <p className="text-sm text-slate-500">Get notified about new roles</p>
                  </div>
               </div>
               <div className="relative">
                  <input 
                    type="email" 
                    placeholder="name@example.com" 
                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 transition-all font-medium" 
                  />
                  <button className="absolute right-2 top-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-95">
                     <ArrowRight className="w-6 h-6" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default CompanyBranding;
