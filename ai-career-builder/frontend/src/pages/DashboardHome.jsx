import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI, portfolioAPI, coverLetterAPI, careerAPI } from '../api/client';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {
  FileText,
  Globe,
  Mail,
  Compass,
  Plus,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  CheckCircle2,
  ExternalLink,
  Trash2,
  Clock,
  Zap,
} from 'lucide-react';

const DashboardHome = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [latestCareer, setLatestCareer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [rRes, pRes, cRes, carRes] = await Promise.allSettled([
          resumeAPI.getAll(),
          portfolioAPI.getAll(),
          coverLetterAPI.getAll(),
          careerAPI.getLatest(),
        ]);

        if (rRes.status === 'fulfilled' && rRes.value.data.success) {
          setResumes(rRes.value.data.resumes || []);
        }
        if (pRes.status === 'fulfilled' && pRes.value.data.success) {
          setPortfolios(pRes.value.data.portfolios || []);
        }
        if (cRes.status === 'fulfilled' && cRes.value.data.success) {
          setCoverLetters(cRes.value.data.letters || []);
        }
        if (carRes.status === 'fulfilled' && carRes.value.data.success) {
          setLatestCareer(carRes.value.data.recommendation || null);
        }
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute average ATS Score
  const avgAtsScore = resumes.length > 0
    ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 85), 0) / resumes.length)
    : 88;

  return (
    <DashboardLayout title="Dashboard Overview">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/50 via-slate-900 to-purple-900/40 border border-indigo-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Full Stack Development (FSD) Project Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Targeting <span className="text-indigo-300 font-semibold">{user?.targetRole || 'Full Stack Engineer'}</span>. Your documents and ATS metrics are synced and ready for evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/resume-builder"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              New ATS Resume
            </Link>
            <Link
              to="/portfolio-builder"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Globe className="w-4 h-4 text-purple-400" />
              Build Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Resumes Created</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{resumes.length}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            ATS Compliant & PDF Ready
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portfolios Built</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{portfolios.length}</div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-2 font-medium">
            <ExternalLink className="w-3.5 h-3.5" />
            Exportable to Static HTML
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cover Letters</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white">{coverLetters.length}</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-medium">
            <Zap className="w-3.5 h-3.5" />
            AI Tailored to Companies
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg ATS Parse Score</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-amber-300">{avgAtsScore}%</div>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-2 font-medium">
            <Award className="w-3.5 h-3.5" />
            High Pass Rate for Tech Screenings
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">Quick Creation Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/resume-builder"
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">ATS Resume Builder</h3>
            <p className="text-xs text-slate-400 mt-1">Multi-entry form, AI summaries, live preview, 3 templates, and PDF export.</p>
          </Link>

          <Link
            to="/portfolio-builder"
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/40 hover:bg-slate-900 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors">Portfolio Generator</h3>
            <p className="text-xs text-slate-400 mt-1">Generate modern single-page sites and download standalone HTML files.</p>
          </Link>

          <Link
            to="/cover-letter"
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/40 hover:bg-slate-900 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">AI Cover Letter</h3>
            <p className="text-xs text-slate-400 mt-1">Personalized cover letters tailored directly to job descriptions.</p>
          </Link>

          <Link
            to="/career-advisor"
            className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-900 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">Career Recommendation</h3>
            <p className="text-xs text-slate-400 mt-1">Gap analysis, matching roles, and a step-by-step 4-phase learning roadmap.</p>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Documents & Career Insight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Resumes & Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Your Saved Resumes</h2>
            <Link to="/saved-documents" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {resumes.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-300">No resumes created yet</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Create your first ATS-optimized resume using our guided builder.
              </p>
              <Link
                to="/resume-builder"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Build First Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 3).map((res) => (
                <div
                  key={res._id || res.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600/15 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      ATS
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{res.title || 'ATS Resume'}</h4>
                      <p className="text-xs text-slate-400">
                        Template: <span className="capitalize text-slate-300">{res.template || 'Modern'}</span> • Last updated {new Date(res.updatedAt || res.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                      {res.atsScore || 85}% ATS Score
                    </span>
                    <Link
                      to={`/resume-builder?id=${res._id || res.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                    >
                      Edit / Export
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Career Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">AI Career Roadmap</h2>
            <Link to="/career-advisor" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
              Full Advisor <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            {latestCareer && latestCareer.recommendedRoles?.[0] ? (
              <>
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400">Top Recommended Role</span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {latestCareer.recommendedRoles[0].title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-emerald-400">
                      {latestCareer.recommendedRoles[0].matchPercentage}% Skill Match
                    </span>
                    <span className="text-xs text-slate-500">•</span>
                    <span className="text-xs text-slate-400">
                      {latestCareer.recommendedRoles[0].salaryRange?.split('/')[0] || '$85k - $130k'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-3">
                  <span className="text-xs font-semibold text-slate-300 block mb-2">Recommended Next Topics:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {latestCareer.recommendedRoles[0].missingSkills?.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 text-[11px] border border-indigo-500/20">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to="/career-advisor"
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold text-center block transition-colors"
                >
                  View 4-Phase Roadmap
                </Link>
              </>
            ) : (
              <div className="text-center py-4">
                <Compass className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-200">No Career Analysis Run Yet</h4>
                <p className="text-[11px] text-slate-400 mt-1 mb-3">
                  Analyze your technical skills against industry demand.
                </p>
                <Link
                  to="/career-advisor"
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs inline-block"
                >
                  Run Career Advisor
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
