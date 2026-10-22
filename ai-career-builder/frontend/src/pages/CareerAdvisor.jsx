import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { careerAPI } from '../api/client';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AIBadge from '../components/common/AIBadge';
import confetti from 'canvas-confetti';
import {
  Compass,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  DollarSign,
  ChevronRight,
  Zap,
} from 'lucide-react';

const CareerAdvisor = () => {
  const { user, showToast } = useAuth();

  const [degree, setDegree] = useState('B.Tech / B.E.');
  const [major, setMajor] = useState('Computer Science & Engineering');
  const [experienceLevel, setExperienceLevel] = useState('Student / Fresher');
  const [skills, setSkills] = useState('React, Node.js, Express, MongoDB, JavaScript, Tailwind CSS, Git');
  const [interests, setInterests] = useState('Full Stack Web Architecture, Cloud Deployment, AI Integrations');

  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [aiInfo, setAiInfo] = useState({ isDemo: false, engine: '' });

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await careerAPI.getLatest();
        if (res.data.success && res.data.recommendation) {
          setRecommendation(res.data.recommendation);
        }
      } catch (err) {
        console.warn('Error fetching career recommendation:', err);
      }
    };
    fetchLatest();
  }, []);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await careerAPI.analyze({
        degree,
        major,
        experienceLevel,
        skills,
        interests,
      });

      if (res.data.success && res.data.recommendation) {
        setRecommendation(res.data.recommendation);
        setAiInfo({
          isDemo: res.data.isDemoMode,
          engine: res.data.aiEngine,
        });
        showToast('AI Career Roadmap and Role Analysis Complete!');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    } catch (err) {
      showToast('Career analysis failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="AI Career Recommendation & Roadmap">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Career Intelligence & Skill Gap Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-white">Target Your Ideal Career Trajectory</h2>
          <p className="text-xs text-slate-300 mt-1">
            Analyze your academic background and skills against live market demand to unlock a 4-phase learning roadmap.
          </p>
        </div>

        <AIBadge isDemo={aiInfo.isDemo} engineName={aiInfo.engine} compact />
      </div>

      {/* Input Parameters Card */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center justify-between">
          <span>Your Educational Profile & Skills</span>
          <button
            type="button"
            onClick={() => {
              setSkills('React, Node.js, Express, MongoDB, Docker, TypeScript, Tailwind CSS, Git, Python');
              setInterests('Full Stack Web Architecture, Cloud Computing, GenAI Engineering');
            }}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5" /> Preload College Profile
          </button>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Degree Program</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Major / Discipline</label>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            >
              <option value="Student / Fresher">College Student / Fresher</option>
              <option value="Entry-Level (0-2 Yrs)">Entry-Level (0-2 Yrs)</option>
              <option value="Junior-Mid (2-4 Yrs)">Junior-Mid (2-4 Yrs)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Technical Skills (Comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Node.js, MongoDB..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Career Interests & Domains</label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Web Development, Cloud, AI..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:opacity-90 text-slate-950 font-sans text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          {loading ? 'AI Analyzing Career Tracks & Market Demand...' : 'Generate Career Recommendations & Roadmap'}
        </button>
      </div>

      {/* Analysis Results */}
      {recommendation && (
        <div className="space-y-6">
          {/* Section 1: Recommended Roles */}
          <div>
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              Recommended Career Matches & Skill Gap Diagnosis
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendation.recommendedRoles?.map((role, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm text-white">{role.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-semibold">{role.salaryRange}</span>
                        <span>•</span>
                        <span className="text-indigo-300">{role.demandLevel}</span>
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                      {role.matchPercentage}% Match
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{role.description}</p>

                  {/* Matching Skills */}
                  <div>
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      Matching Skills Verified:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.matchingSkills?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] border border-emerald-500/20 font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <span className="text-[11px] font-semibold text-amber-400 block mb-1">
                      Critical Skills to Learn Next:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {role.missingSkills?.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-[10px] border border-amber-500/20 font-medium">
                          + {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 4-Phase Learning Roadmap */}
          {recommendation.learningRoadmap && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    Personalized 4-Phase Milestone Learning Roadmap
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Step-by-step curriculum to bridge skill gaps and achieve production competency.
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                  16-Week Plan
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendation.learningRoadmap.map((phase, pIdx) => (
                  <div key={pIdx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-indigo-400">{phase.phase}</span>
                      <span className="text-slate-500 font-medium">{phase.timeframe}</span>
                    </div>

                    <h4 className="font-bold text-xs text-white">{phase.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{phase.objective}</p>

                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      {phase.modules?.map((mod, mIdx) => (
                        <div key={mIdx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                          <div className="font-semibold text-slate-200">{mod.title}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">Resources: {mod.resources}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Strategic Career Tips */}
          {recommendation.generalAdvice && (
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                Strategic Career Advancement Tips
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                {recommendation.generalAdvice.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default CareerAdvisor;
