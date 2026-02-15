
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, ChevronRight, Navigation, Share2, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { JobStatus } from '../types';

const Home: React.FC = () => {
  const { jobs } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const activeJobs = jobs.filter(j => j.status === JobStatus.ACTIVE);
  const [filteredJobs, setFilteredJobs] = useState(activeJobs);

  useEffect(() => {
    setFilteredJobs(activeJobs);
  }, [jobs]);

  const handleSearch = () => {
    const filtered = activeJobs.filter(j => 
      (j.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
       j.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      j.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation("Mumbai, MH"); 
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  const handleQuickShare = (e: React.MouseEvent, jobId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/#/job/${jobId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(jobId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-slate-50 py-24 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 -skew-x-12 transform translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8">
            Find Your <span className="text-blue-600">Dream Job</span> Today
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
            Connecting talented professionals with top companies. Explore thousands of job opportunities across tech, design, and more.
          </p>

          <div className="bg-white p-3 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] flex flex-col md:flex-row max-w-4xl mx-auto border border-slate-100">
            <div className="flex-grow flex items-center px-6 py-4 border-b md:border-b-0 md:border-r border-slate-100">
              <Search className="w-6 h-6 text-slate-300 mr-3" />
              <input 
                type="text" 
                placeholder="Job title, skills..." 
                className="w-full outline-none text-slate-800 bg-transparent font-bold text-lg placeholder:text-slate-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex-grow flex items-center px-6 py-4 relative group">
              <MapPin className="w-6 h-6 text-slate-300 mr-3" />
              <input 
                type="text" 
                placeholder="City or remote" 
                className="w-full outline-none text-slate-800 bg-transparent font-bold text-lg placeholder:text-slate-300"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <button 
                onClick={detectLocation}
                title="Locate Me"
                className={`p-2 rounded-xl transition-all ${isLocating ? 'text-blue-600 animate-spin' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'}`}
              >
                <Navigation className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl active:scale-95"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Featured Jobs */}
      <div className="max-w-7xl mx-auto py-24 px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Available Roles</h2>
            <p className="text-slate-500 font-medium">Discover active opportunities from verified companies</p>
          </div>
        </div>

        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map(job => (
              <Link key={job.id} to={`/job/${job.id}`} className="group bg-white border border-slate-100 p-8 rounded-[2.5rem] hover:shadow-2xl transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-6 flex items-center gap-2">
                  <button 
                    onClick={(e) => handleQuickShare(e, job.id)}
                    className="bg-white/80 backdrop-blur-sm p-2 rounded-xl border border-slate-100 text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-1.5 shadow-sm"
                    title="Quick Share"
                  >
                    {copiedId === job.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                  </button>
                  <span className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest px-3 py-1.5 rounded-full border border-slate-100">
                    {job.type}
                  </span>
                </div>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-contain p-2" />
                    ) : (
                      <div className="text-blue-600 font-black text-2xl uppercase">{job.companyName.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight text-xl">{job.title}</h3>
                    <p className="text-sm text-slate-400 font-bold">{job.companyName}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                  {job.skills.slice(0, 3).map(skill => (
                    <span key={skill} className="bg-slate-50 text-slate-500 text-[11px] px-3 py-1.5 rounded-xl border border-slate-100 font-bold">{skill}</span>
                  ))}
                </div>

                <div className="flex justify-between items-center border-t pt-6 border-slate-50">
                  <div className="flex items-center text-slate-400 font-bold text-sm">
                    <MapPin className="w-4 h-4 mr-1.5 text-blue-500" />
                    {job.location}
                  </div>
                  <div className="font-black text-slate-900 text-lg">{job.salary}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">No matching jobs found</h3>
            <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or location.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
