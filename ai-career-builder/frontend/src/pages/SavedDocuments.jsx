import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, portfolioAPI, coverLetterAPI } from '../api/client';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {
  FolderOpen,
  FileText,
  Globe,
  Mail,
  Trash2,
  Edit3,
  Download,
  ExternalLink,
  Plus,
  Clock,
} from 'lucide-react';

const SavedDocuments = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'resumes' | 'portfolios' | 'letters'
  const [resumes, setResumes] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [r, p, l] = await Promise.allSettled([
        resumeAPI.getAll(),
        portfolioAPI.getAll(),
        coverLetterAPI.getAll(),
      ]);

      if (r.status === 'fulfilled' && r.value.data.success) setResumes(r.value.data.resumes || []);
      if (p.status === 'fulfilled' && p.value.data.success) setPortfolios(p.value.data.portfolios || []);
      if (l.status === 'fulfilled' && l.value.data.success) setLetters(l.value.data.letters || []);
    } catch {
      showToast('Error loading documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDeleteResume = async (id) => {
    if (window.confirm('Delete this resume from MongoDB?')) {
      try {
        await resumeAPI.delete(id);
        setResumes((prev) => prev.filter((r) => r._id !== id && r.id !== id));
        showToast('Resume deleted');
      } catch {
        showToast('Delete failed', 'error');
      }
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (window.confirm('Delete this portfolio?')) {
      try {
        await portfolioAPI.delete(id);
        setPortfolios((prev) => prev.filter((p) => p._id !== id && p.id !== id));
        showToast('Portfolio deleted');
      } catch {
        showToast('Delete failed', 'error');
      }
    }
  };

  const handleDeleteLetter = async (id) => {
    if (window.confirm('Delete this cover letter?')) {
      try {
        await coverLetterAPI.delete(id);
        setLetters((prev) => prev.filter((l) => l._id !== id && l.id !== id));
        showToast('Cover letter deleted');
      } catch {
        showToast('Delete failed', 'error');
      }
    }
  };

  return (
    <DashboardLayout title="Saved Documents">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-400" />
            Centralized Document Repository
          </h2>
          <p className="text-xs text-slate-400">
            Manage your saved resumes, developer portfolio builds, and company cover letters.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          {['all', 'resumes', 'portfolios', 'letters'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
          Loading stored records...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Resumes */}
          {(activeTab === 'all' || activeTab === 'resumes') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" /> Resumes ({resumes.length})
                </h3>
                <Link to="/resume-builder" className="text-xs text-indigo-400 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Create New
                </Link>
              </div>

              {resumes.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
                  No resumes saved yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resumes.map((r) => (
                    <div key={r._id || r.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-sm text-white">{r.title || 'Resume'}</h4>
                          <span className="text-[11px] text-slate-400 capitalize">{r.template || 'Modern'} Template</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                          {r.atsScore || 85}% ATS
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <Link
                          to={`/resume-builder?id=${r._id || r.id}`}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 font-semibold hover:bg-indigo-600/30 flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteResume(r._id || r.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Portfolios */}
          {(activeTab === 'all' || activeTab === 'portfolios') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" /> Portfolios ({portfolios.length})
                </h3>
                <Link to="/portfolio-builder" className="text-xs text-purple-400 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Build New
                </Link>
              </div>

              {portfolios.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
                  No portfolios saved yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolios.map((p) => (
                    <div key={p._id || p.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{p.title || 'Developer Portfolio'}</h4>
                        <span className="text-[11px] text-purple-400 font-medium">Theme: {p.theme}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <Link
                          to={`/portfolio-builder?id=${p._id || p.id}`}
                          className="px-3 py-1.5 rounded-lg bg-purple-600/20 text-purple-300 font-semibold hover:bg-purple-600/30 flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePortfolio(p._id || p.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cover Letters */}
          {(activeTab === 'all' || activeTab === 'letters') && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-400" /> Cover Letters ({letters.length})
                </h3>
                <Link to="/cover-letter" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" /> Write New
                </Link>
              </div>

              {letters.length === 0 ? (
                <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
                  No cover letters saved yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {letters.map((l) => (
                    <div key={l._id || l.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3">
                      <div>
                        <h4 className="font-bold text-sm text-white">{l.jobTitle} @ {l.companyName}</h4>
                        <span className="text-[11px] text-slate-400">Tone: {l.tone}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <Link
                          to={`/cover-letter?id=${l._id || l.id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-300 font-semibold hover:bg-emerald-600/30 flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> View / Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteLetter(l._id || l.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default SavedDocuments;
