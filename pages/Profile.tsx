
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, UserRole } from '../types';
import { User as UserIcon, Mail, MapPin, Globe, Github, Linkedin, Briefcase, FileText, Upload, Save, Building2, Loader2, Sparkles, CheckCircle2, Pencil, Image as ImageIcon, Camera, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

const Profile: React.FC = () => {
  const { user, updateUser } = useAppContext();
  const [editing, setEditing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseSuccess, setParseSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);
  const teamPhotosInputRef = useRef<HTMLInputElement>(null);

  // Local state for form editing
  const [formData, setFormData] = useState<Partial<User>>({});

  // Initialize form data when entering edit mode or restoring from localStorage
  useEffect(() => {
    if (editing && user) {
      const savedDraft = localStorage.getItem(`profile_draft_${user.id}`);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      } else {
        resetForm();
      }
    }
  }, [editing, user?.id]);

  // Persist changes to localStorage while editing
  useEffect(() => {
    if (editing && user && Object.keys(formData).length > 0) {
      localStorage.setItem(`profile_draft_${user.id}`, JSON.stringify(formData));
    }
  }, [formData, editing, user?.id]);

  const resetForm = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        location: user.location || '',
        bio: user.bio || '',
        companyName: user.companyName || '',
        companyLogo: user.companyLogo || '',
        profilePic: user.profilePic || '',
        skills: user.skills || [],
        website: user.website || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        teamPhotos: user.teamPhotos || [],
        cultureDescription: user.cultureDescription || '',
      });
    }
  };

  // Check if there are unsaved changes by comparing formData with current user data
  const isDirty = useMemo(() => {
    if (!user || !editing) return false;
    
    // Simple comparison for essential fields
    const compareFields: (keyof User)[] = [
      'name', 'email', 'location', 'bio', 'companyName', 
      'companyLogo', 'profilePic', 'website', 'githubUrl', 
      'linkedinUrl', 'cultureDescription'
    ];

    for (const field of compareFields) {
      if ((formData[field] || '') !== (user[field] || '')) return true;
    }

    // Array comparisons
    if (JSON.stringify(formData.skills) !== JSON.stringify(user.skills || [])) return true;
    if (JSON.stringify(formData.teamPhotos) !== JSON.stringify(user.teamPhotos || [])) return true;

    return false;
  }, [formData, user, editing]);

  if (!user) return null;

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateUser(formData);
    setEditing(false);
    setSaveSuccess(true);
    localStorage.removeItem(`profile_draft_${user.id}`);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmed) return;
    }
    setEditing(false);
    localStorage.removeItem(`profile_draft_${user.id}`);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast file to avoid unknown type issues
    const file = e.target.files?.[0] as File | undefined;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange('companyLogo', reader.result as string);
      };
      // Fixed: Cast file to any to satisfy readAsDataURL when File type is ambiguous in the build context
      reader.readAsDataURL(file as any);
    }
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Explicitly cast file to avoid unknown type issues
    const file = e.target.files?.[0] as File | undefined;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange('profilePic', reader.result as string);
      };
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
          const newPhotos = [...(formData.teamPhotos || []), reader.result as string];
          handleInputChange('teamPhotos', newPhotos);
        };
        // Fixed: Cast file to any to satisfy readAsDataURL when File type is ambiguous in the build context
        reader.readAsDataURL(file as any);
      });
    }
  };

  const removeTeamPhoto = (index: number) => {
    const filtered = (formData.teamPhotos || []).filter((_, i) => i !== index);
    handleInputChange('teamPhotos', filtered);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    // Explicitly cast to avoid unknown type errors from some compiler settings
    const file = target.files?.[0] as File | undefined;
    if (!file) return;

    setIsParsing(true);
    setParseSuccess(false);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          if (typeof result === 'string') {
            const base64 = result.split(',')[1];
            resolve(base64);
          } else {
            reject(new Error("Failed to read file as base64 string"));
          }
        };
        reader.onerror = () => reject(new Error("File reading failed"));
        // Fixed: Cast file to any to satisfy readAsDataURL when File type is ambiguous in the build context
        reader.readAsDataURL(file as any);
      });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: file.type || 'application/pdf',
              },
            },
            {
              text: "Analyze this resume and extract the following information. Be accurate and professional. If information is missing, use reasonable defaults or empty strings.",
            },
          ],
        },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Full name of the candidate" },
              email: { type: Type.STRING, description: "Email address" },
              skills: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "List of top 5 technical skills" 
              },
              location: { type: Type.STRING, description: "City and State/Country" },
              bio: { type: Type.STRING, description: "A professional summary or bio (max 150 characters)" },
            },
            required: ["name", "email", "skills", "location", "bio"],
          },
        },
      });

      const rawText = response.text;
      if (rawText) {
        const extractedData = JSON.parse(rawText);
        if (editing) {
          setFormData(prev => ({ ...prev, ...extractedData }));
        } else {
          // If not currently editing, enter editing mode and apply extracted data
          setEditing(true);
          setFormData(prev => ({ ...prev, ...extractedData }));
        }
        setParseSuccess(true);
        setTimeout(() => setParseSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      alert("Failed to parse resume. Please try again or fill manually.");
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentAvatar = editing ? formData.profilePic : user.profilePic;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500 mt-1">Manage your identity and branding on JOB CONNECT</p>
        </div>
        <div className="flex gap-4 items-center">
          {saveSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" /> Profile Updated!
            </div>
          )}
          {parseSuccess && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl text-sm font-bold border border-blue-100">
              <Sparkles className="w-4 h-4" /> AI Auto-filled!
            </div>
          )}
          {!editing && (
            <button 
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white font-bold flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all shadow-lg hover:bg-blue-700 active:scale-95"
            >
              <Pencil className="w-4 h-4" /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8 pb-24">
        {/* Basic Info Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="relative group">
              <div 
                className={`w-32 h-32 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-400 overflow-hidden border-4 border-white shadow-inner relative ${editing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                onClick={() => editing && profilePicInputRef.current?.click()}
              >
                {currentAvatar ? (
                   <img src={currentAvatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-16 h-16 text-slate-300" />
                )}
                {editing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              {editing && (
                <button 
                  onClick={() => profilePicInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2.5 rounded-xl shadow-lg hover:bg-blue-700 transition-all border-4 border-white"
                >
                  <Upload className="w-4 h-4" />
                </button>
              )}
              <input 
                type="file" 
                ref={profilePicInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleProfilePicUpload} 
              />
            </div>
            
            <div className="flex-grow space-y-4 w-full">
              {editing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.name || ''} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-lg font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none w-full focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email || ''} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-lg text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none w-full focus:ring-2 focus:ring-blue-500" 
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Location</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={formData.location || ''} 
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="e.g. Mumbai, Maharashtra"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-slate-900">{user.name}</h2>
                  <div className="flex flex-wrap gap-4 text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {user.email}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {user.location || 'Location Not Set'}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest border ${
                      user.role === UserRole.CANDIDATE 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : 'bg-purple-50 text-purple-600 border-purple-100'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Candidate Specific: Resume & Skills */}
        {user.role === UserRole.CANDIDATE && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" /> Professional Experience
              </h3>
              {isParsing && (
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Resume...
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange}
            />

            {(!editing || isParsing) && (
              <div 
                onClick={() => !isParsing && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all cursor-pointer relative overflow-hidden group
                  ${isParsing ? 'bg-slate-50 border-blue-200 cursor-not-allowed' : 'border-slate-100 hover:border-blue-400 hover:bg-blue-50/30'}
                `}
              >
                {isParsing ? (
                  <div className="flex flex-col items-center">
                    <Sparkles className="w-12 h-12 text-blue-500 mb-4 animate-bounce" />
                    <p className="text-blue-600 font-bold text-lg">AI Resume Extraction...</p>
                    <p className="text-slate-400 text-sm mt-2">Automatically updating your profile data</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-slate-700 font-bold text-lg">Upload Resume to Auto-Fill</p>
                    <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">Update your profile info instantly by uploading your latest resume.</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 space-y-4">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-widest px-1">Top Skills</h4>
              {editing ? (
                 <input 
                   type="text" 
                   value={(formData.skills || []).join(', ')} 
                   onChange={(e) => handleInputChange('skills', e.target.value.split(',').map(s => s.trim()))}
                   placeholder="e.g. React, TypeScript, UI Design, Backend Development"
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" 
                 />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(user.skills || []).length > 0 ? user.skills?.map((skill, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium border border-slate-200">
                      {skill}
                    </span>
                  )) : <p className="text-slate-400 italic text-sm">No skills listed yet.</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Common Section: Bio & About */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" /> {user.role === UserRole.CANDIDATE ? 'Professional Bio' : 'About Company'}
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Description</label>
              {editing ? (
                <textarea 
                  value={formData.bio || ''} 
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder={user.role === UserRole.CANDIDATE ? "Tell us about your professional journey..." : "Describe your company culture, values, and mission..."}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none transition-all"
                />
              ) : (
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {user.bio || (user.role === UserRole.CANDIDATE ? 'Add a professional summary to help recruiters find you.' : 'Add a company description to attract top talent.')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Employer Specific: Branding */}
        {user.role === UserRole.EMPLOYER && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-purple-600" /> Company Identity & Branding
            </h3>
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Company Legal Name</label>
                  {editing ? (
                    <input 
                      type="text" 
                      value={formData.companyName || ''} 
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="e.g. Acme Innovations Pvt Ltd"
                      className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-bold" 
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-bold text-slate-800">
                      {user.companyName || 'Not Specified'}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Corporate Website</label>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                    <Globe className="w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="https://company.com" 
                      value={formData.website || ''}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="bg-transparent outline-none flex-grow text-sm disabled:opacity-50" 
                      disabled={!editing} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Brand Logo</label>
                <div className="flex items-center gap-6">
                  <div className="w-32 h-32 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden bg-white">
                    {(editing ? formData.companyLogo : user.companyLogo) ? (
                      <img src={editing ? formData.companyLogo : user.companyLogo} className="w-full h-full object-contain p-2" alt="Company Logo" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  {editing && (
                    <div className="space-y-2">
                      <button 
                        onClick={() => logoInputRef.current?.click()}
                        className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" /> Upload Brand Logo
                      </button>
                    </div>
                  )}
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoUpload} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Company Culture Description</label>
                {editing ? (
                  <textarea 
                    value={formData.cultureDescription || ''} 
                    onChange={(e) => handleInputChange('cultureDescription', e.target.value)}
                    placeholder="Describe your company work life, environment, and values..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none transition-all"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                    {user.cultureDescription || 'Add a culture description to attract top talent.'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Team & Office Photos</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(editing ? formData.teamPhotos : user.teamPhotos)?.map((photo, i) => (
                    <div key={i} className="aspect-video bg-slate-50 rounded-xl relative overflow-hidden group border border-slate-100">
                      <img src={photo} alt={`Team ${i}`} className="w-full h-full object-cover" />
                      {editing && (
                        <button 
                          onClick={() => removeTeamPhoto(i)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {editing && (
                    <button 
                      onClick={() => teamPhotosInputRef.current?.click()}
                      className="aspect-video bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-all"
                    >
                      <Plus className="w-6 h-6 mb-1" />
                      <span className="text-[10px] font-bold">Add Photo</span>
                    </button>
                  )}
                </div>
                <input 
                  type="file" 
                  ref={teamPhotosInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple 
                  onChange={handleTeamPhotoUpload} 
                />
              </div>
            </div>
          </div>
        )}

        {/* Social Links & Portfolio for Candidates */}
        {user.role === UserRole.CANDIDATE && (
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
               <Globe className="w-5 h-5 text-blue-600" /> Presence & Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Portfolio / Website</label>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="https://yourportfolio.com" 
                    value={formData.website || ''}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="bg-transparent outline-none flex-grow text-sm disabled:opacity-50" 
                    disabled={!editing} 
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">GitHub Profile</label>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Github className="w-5 h-5 text-slate-700" />
                  <input 
                    type="text" 
                    placeholder="github.com/yourusername" 
                    value={formData.githubUrl || ''}
                    onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                    className="bg-transparent outline-none flex-grow text-sm disabled:opacity-50" 
                    disabled={!editing} 
                  />
                </div>
              </div>
              <div className="space-y-4 md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">LinkedIn Profile</label>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                  <Linkedin className="w-5 h-5 text-blue-700" />
                  <input 
                    type="text" 
                    placeholder="linkedin.com/in/yourprofile" 
                    value={formData.linkedinUrl || ''}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    className="bg-transparent outline-none flex-grow text-sm disabled:opacity-50" 
                    disabled={!editing} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {editing && (
          <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white/80 backdrop-blur-xl border-t border-slate-200 p-6 flex justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
            <div className="max-w-4xl w-full flex gap-4 items-center">
              {isDirty && (
                <div className="hidden md:flex items-center gap-2 text-amber-600 font-bold text-sm mr-auto bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
                  <AlertTriangle className="w-4 h-4" /> Unsaved Changes
                </div>
              )}
              <div className="flex gap-4 w-full md:w-auto">
                <button 
                  onClick={handleSave}
                  className="flex-grow md:flex-none bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  <Save className="w-5 h-5" /> Confirm & Save
                </button>
                <button 
                  onClick={handleCancel}
                  className="px-8 bg-slate-100 text-slate-700 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
