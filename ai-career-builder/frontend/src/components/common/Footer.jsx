import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, Database, ShieldCheck, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Footer = () => {
  const { systemStatus } = useAuth();

  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white">AI Career Builder</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Stack Development (FSD) College Capstone Project. Empowering students and job seekers with automated ATS-friendly resumes, developer portfolio generators, and AI career guidance.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Platform Active & Production Ready
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform Modules</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/resume-builder" className="hover:text-indigo-400 transition-colors">AI ATS Resume Builder</Link>
              </li>
              <li>
                <Link to="/portfolio-builder" className="hover:text-indigo-400 transition-colors">AI Portfolio Website Generator</Link>
              </li>
              <li>
                <Link to="/cover-letter" className="hover:text-indigo-400 transition-colors">AI Cover Letter Writer</Link>
              </li>
              <li>
                <Link to="/career-advisor" className="hover:text-indigo-400 transition-colors">AI Career Recommendation Engine</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-indigo-400 transition-colors">Student Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Architecture & Tech Stack */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Technology Stack</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center gap-1.5"><Code2 className="w-3.5 h-3.5 text-sky-400" /> Frontend: React 19, Vite, Tailwind CSS</li>
              <li className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-emerald-400" /> Backend: Node.js, Express, MongoDB</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Security: JWT & bcrypt Password Hashing</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI: Google Gemini Pro & Simulation Engine</li>
            </ul>
          </div>

          {/* Academic Transparency */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">System Health</h4>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span>Database:</span>
                <span className="font-semibold text-emerald-400">
                  {systemStatus?.database?.connected ? 'MongoDB Live' : 'Active (File-Backed)'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>AI Engine:</span>
                <span className="font-semibold text-indigo-400">
                  {systemStatus?.aiEngine?.isConfigured ? 'Gemini 1.5' : 'Simulation Engine'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Export Engine:</span>
                <span className="font-semibold text-slate-300">HTML5 + Client PDF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI Career Builder • Full Stack Web Development Capstone Project</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Submission & Faculty Review
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
