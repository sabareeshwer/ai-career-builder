import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AIBadge from '../components/common/AIBadge';
import {
  Sparkles,
  FileText,
  Globe,
  Mail,
  Compass,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Download,
  ShieldCheck,
  Zap,
  Code,
  Layers,
  ChevronRight,
  Star,
} from 'lucide-react';

const LandingPage = () => {
  const { user, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleDemoStart = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 overflow-hidden border-b border-slate-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Top Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Powered Full Stack Career Acceleration Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
            Land Your Dream Tech Job with{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              AI-Engineered
            </span>{' '}
            Resumes & Portfolios
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Beat Applicant Tracking Systems (ATS), auto-generate developer portfolio websites, write personalized cover letters, and unlock data-backed career roadmaps — all in one modern MERN platform.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  Start Building Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={handleDemoStart}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Instant Demo Login
                </button>
              </>
            )}
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">98.4%</div>
              <div className="text-xs text-slate-400 mt-1">ATS Parser Success Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">1-Click</div>
              <div className="text-xs text-slate-400 mt-1">Portfolio Static HTML Export</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">4 Phases</div>
              <div className="text-xs text-slate-400 mt-1">AI Guided Learning Roadmap</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Free & Open for Students</div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section id="features" className="py-24 bg-slate-950/60 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Comprehensive Feature Suite</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              Everything You Need to Dominate Your Technical Job Search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1.5 group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI ATS Resume Builder</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Build parsing-optimized resumes with 3 battle-tested ATS templates, live score audits, and instant PDF download.
              </p>
              <Link to="/resume-builder" className="text-xs font-semibold text-indigo-400 inline-flex items-center gap-1 group-hover:text-indigo-300">
                Try Resume Builder <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 transition-all hover:-translate-y-1.5 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Portfolio Generator</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Auto-generate developer portfolio sites from your experience. Switch themes, preview on mobile/desktop, and export standalone static HTML.
              </p>
              <Link to="/portfolio-builder" className="text-xs font-semibold text-purple-400 inline-flex items-center gap-1 group-hover:text-purple-300">
                Build Portfolio <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1.5 group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Cover Letter Writer</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Generate highly tailored 4-paragraph cover letters matching specific job descriptions with tone selection and one-click copy/PDF.
              </p>
              <Link to="/cover-letter" className="text-xs font-semibold text-emerald-400 inline-flex items-center gap-1 group-hover:text-emerald-300">
                Write Cover Letter <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1.5 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Career Advisor</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                Discover your top-matching career tracks, identify missing skill gaps, and follow a 4-phase milestone roadmap to reach senior roles.
              </p>
              <Link to="/career-advisor" className="text-xs font-semibold text-amber-400 inline-flex items-center gap-1 group-hover:text-amber-300">
                Explore Roadmaps <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 border-b border-slate-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Simple 4-Step Process</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
              From Blank Page to Job-Ready Assets in Minutes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">1</div>
              <h4 className="font-bold text-base mb-2">Input Profile Data</h4>
              <p className="text-xs text-slate-400">Fill in education, technical competencies, projects, and career aspirations.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">2</div>
              <h4 className="font-bold text-base mb-2">AI Optimization</h4>
              <p className="text-xs text-slate-400">Our engine crafts ATS bullet points, generates summaries, and calculates parse scores.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-pink-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">3</div>
              <h4 className="font-bold text-base mb-2">Preview & Customize</h4>
              <p className="text-xs text-slate-400">Live split-screen editing with 3 ATS templates and dynamic theme pickers.</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center relative">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mx-auto mb-4">4</div>
              <h4 className="font-bold text-base mb-2">Export & Apply</h4>
              <p className="text-xs text-slate-400">Download pristine PDFs, export self-hosted HTML portfolio websites, and save to MongoDB.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Traditional vs AI Career Builder */}
      <section className="py-20 bg-slate-950/40 border-b border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">Why It Works</h2>
            <p className="text-3xl font-extrabold text-white">Traditional Resumes vs. AI Career Builder</p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-4 sm:p-5">Feature</th>
                  <th className="p-4 sm:p-5 text-slate-400">Traditional Methods</th>
                  <th className="p-4 sm:p-5 text-indigo-400 font-bold bg-indigo-500/10">AI Career Builder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">ATS Parsing Verification</td>
                  <td className="p-4 sm:p-5 text-rose-400">❌ High risk of rejection by Taleo/Workday</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-medium bg-indigo-500/5">✅ Guaranteed 95%+ ATS Compliance</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Portfolio Deployment</td>
                  <td className="p-4 sm:p-5 text-slate-400">Requires days of CSS coding & hosting setup</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-medium bg-indigo-500/5">✅ 1-Click Static HTML Export ready for GitHub Pages</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Cover Letter Personalization</td>
                  <td className="p-4 sm:p-5 text-slate-400">Generic cut-and-paste templates</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-medium bg-indigo-500/5">✅ AI crafted to target job descriptions & tone</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-semibold text-slate-200">Skill Gap Diagnosis</td>
                  <td className="p-4 sm:p-5 text-slate-400">Unclear why applications fail</td>
                  <td className="p-4 sm:p-5 text-emerald-400 font-medium bg-indigo-500/5">✅ Missing skills tags & curated 4-phase roadmap</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-indigo-950 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to Accelerate Your Tech Career Today?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mb-8">
              Generate your first ATS-friendly resume, launch your developer portfolio, and get tailored career advice in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-100 transition-all shadow-lg hover:scale-105"
              >
                Create Free Account
              </Link>
              <button
                onClick={handleDemoStart}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-200 border border-indigo-500/40 transition-all hover:scale-105"
              >
                Launch Instant Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
