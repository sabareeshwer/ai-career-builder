import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { portfolioAPI } from '../api/client';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import confetti from 'canvas-confetti';
import {
  Globe,
  Save,
  Download,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  Code,
  Mail,
  Palette,
} from 'lucide-react';

const defaultPortfolio = {
  title: 'Alex Rivera - Developer Portfolio',
  theme: 'elegant-indigo', // 'cyber-dark' | 'elegant-indigo' | 'minimal-light'
  hero: {
    name: 'Alex Rivera',
    tagline: 'Full Stack Engineer & AI Specialist',
    headline: 'Architecting scalable web applications, REST microservices, and AI integrations.',
    bio: 'Senior Computer Science student with a deep passion for scalable system design, clean UI/UX architecture, and cloud workflows.',
    avatarUrl: '',
    socials: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'alex.rivera@college.edu',
    },
  },
  about: {
    story:
      'I am an aspiring full stack developer passionate about building high-impact software that solves real-world operational challenges. Throughout my academic career, I have engineered multiple end-to-end applications adhering to production-ready design patterns.',
    experienceYears: '2+',
    projectsCount: '12+',
    satisfiedClients: '100%',
    interests: ['Distributed Systems', 'Generative AI', 'Cloud Architecture', 'Web Performance'],
  },
  skills: [
    { name: 'React 19 & Next.js', category: 'Frontend', level: 90 },
    { name: 'Node.js & Express', category: 'Backend', level: 88 },
    { name: 'MongoDB & Mongoose', category: 'Database', level: 85 },
    { name: 'TypeScript & JavaScript', category: 'Language', level: 92 },
    { name: 'Tailwind CSS', category: 'Frontend', level: 95 },
    { name: 'Docker & Git', category: 'DevOps', level: 80 },
  ],
  projects: [
    {
      title: 'AI Career Builder Platform',
      description: 'Full stack career acceleration platform with ATS resume auditing, portfolio generation, and AI roadmaps.',
      tags: ['React', 'Node.js', 'MongoDB', 'Tailwind', 'AI API'],
      demoUrl: 'https://example.com/demo',
      githubUrl: 'https://github.com/example/ai-career-builder',
      featured: true,
    },
    {
      title: 'DevNexus Cloud Workspace',
      description: 'Collaborative code snippet sharing portal with real-time comments and syntax highlighting.',
      tags: ['MERN Stack', 'Socket.io', 'Tailwind CSS'],
      demoUrl: 'https://example.com/workspace',
      githubUrl: 'https://github.com/example/devnexus',
      featured: false,
    },
  ],
  experience: [
    {
      role: 'Full Stack Developer Intern',
      company: 'TechCorp Innovations',
      duration: 'Jan 2025 - Jun 2025',
      description: 'Engineered REST microservices and responsive dashboards, optimizing response times by 28%.',
    },
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institution: 'College of Engineering',
      year: '2022 - 2026',
      grade: '8.8 GPA',
    },
  ],
  contact: {
    email: 'alex.rivera@college.edu',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    customMessage: 'Always open to discussing software engineering roles, internships, and open-source collaborations.',
  },
};

const PortfolioBuilder = () => {
  const [searchParams] = useSearchParams();
  const portfolioId = searchParams.get('id');
  const { user, showToast } = useAuth();

  const [portfolio, setPortfolio] = useState(() => ({
    ...defaultPortfolio,
    hero: {
      ...defaultPortfolio.hero,
      name: user?.name || defaultPortfolio.hero.name,
      socials: {
        ...defaultPortfolio.hero.socials,
        email: user?.email || defaultPortfolio.hero.socials.email,
      },
    },
  }));

  const [saving, setSaving] = useState(false);
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    if (portfolioId) {
      const load = async () => {
        try {
          const res = await portfolioAPI.getById(portfolioId);
          if (res.data.success && res.data.portfolio) {
            setPortfolio(res.data.portfolio);
          }
        } catch {
          showToast('Could not load requested portfolio', 'error');
        }
      };
      load();
    }
  }, [portfolioId]);

  // Save Portfolio
  const handleSave = async () => {
    setSaving(true);
    try {
      if (portfolioId) {
        await portfolioAPI.update(portfolioId, portfolio);
        showToast('Portfolio updated successfully!');
      } else {
        const res = await portfolioAPI.create(portfolio);
        if (res.data.success) {
          showToast('Portfolio saved to database!');
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
        }
      }
    } catch (err) {
      showToast('Error saving portfolio', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export Static HTML Website
  const handleExportHTML = () => {
    try {
      const isDark = portfolio.theme !== 'minimal-light';
      const bgStyle = isDark
        ? 'background: linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%); color: #f8fafc;'
        : 'background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%); color: #0f172a;';

      const cardStyle = isDark
        ? 'background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1);'
        : 'background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.05);';

      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.hero.name} - ${portfolio.hero.tagline}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; ${bgStyle} min-height: 100vh; line-height: 1.6; }
    .container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
    header { padding: 90px 0 60px; text-align: center; }
    .badge { display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); margin-bottom: 20px; }
    h1 { font-size: 3.2rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 16px; background: linear-gradient(135deg, #6366f1, #a855f7, #ec4899); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p.lead { font-size: 1.25rem; opacity: 0.85; max-width: 650px; margin: 0 auto 30px; }
    .links { display: flex; justify-content: center; gap: 16px; margin-bottom: 40px; flex-wrap: wrap; }
    .btn { display: inline-flex; align-items: center; padding: 12px 26px; border-radius: 12px; font-weight: 600; text-decoration: none; transition: 0.2s ease; cursor: pointer; }
    .btn-primary { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: #fff; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35); }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(99, 102, 241, 0.5); }
    .btn-secondary { background: rgba(255,255,255,0.1); color: inherit; border: 1px solid rgba(255,255,255,0.2); }
    .btn-secondary:hover { background: rgba(255,255,255,0.18); transform: translateY(-2px); }
    section { padding: 60px 0; }
    .section-title { font-size: 1.85rem; font-weight: 700; margin-bottom: 30px; text-align: center; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
    .card { ${cardStyle} border-radius: 18px; padding: 24px; backdrop-filter: blur(12px); transition: transform 0.25s ease; }
    .card:hover { transform: translateY(-4px); }
    .skill-pill { display: inline-block; padding: 6px 14px; border-radius: 8px; font-size: 0.85rem; font-weight: 600; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; margin: 4px; }
    .proj-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 8px; }
    .proj-desc { font-size: 0.95rem; opacity: 0.8; margin-bottom: 16px; }
    .tag-container { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
    .proj-tag { font-size: 0.75rem; padding: 4px 8px; border-radius: 6px; background: rgba(255,255,255,0.08); }
    footer { text-align: center; padding: 50px 0 30px; opacity: 0.6; font-size: 0.85rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">🚀 Open to Opportunities</div>
      <h1>${portfolio.hero.name}</h1>
      <p class="lead">${portfolio.hero.headline || portfolio.hero.tagline}</p>
      <div class="links">
        ${portfolio.hero.socials?.email ? `<a class="btn btn-primary" href="mailto:${portfolio.hero.socials.email}">Contact Me</a>` : ''}
        ${portfolio.hero.socials?.github ? `<a class="btn btn-secondary" href="${portfolio.hero.socials.github}" target="_blank">GitHub</a>` : ''}
        ${portfolio.hero.socials?.linkedin ? `<a class="btn btn-secondary" href="${portfolio.hero.socials.linkedin}" target="_blank">LinkedIn</a>` : ''}
      </div>
    </header>

    ${portfolio.about?.story ? `
    <section>
      <h2 class="section-title">About Me</h2>
      <div class="card" style="max-width: 800px; margin: 0 auto; text-align: center;">
        <p style="font-size: 1.05rem; line-height: 1.8;">${portfolio.about.story}</p>
      </div>
    </section>
    ` : ''}

    ${portfolio.skills && portfolio.skills.length > 0 ? `
    <section>
      <h2 class="section-title">Technical Skills</h2>
      <div class="card" style="text-align: center; max-width: 800px; margin: 0 auto;">
        ${portfolio.skills.map(s => `<span class="skill-pill">${s.name || s}</span>`).join('')}
      </div>
    </section>
    ` : ''}

    ${portfolio.projects && portfolio.projects.length > 0 ? `
    <section>
      <h2 class="section-title">Featured Projects</h2>
      <div class="grid">
        ${portfolio.projects.map(p => `
          <div class="card">
            <div class="proj-title">${p.title}</div>
            <div class="proj-desc">${p.description}</div>
            ${p.tags && p.tags.length > 0 ? `
              <div class="tag-container">
                ${p.tags.map(t => `<span class="proj-tag">${t}</span>`).join('')}
              </div>
            ` : ''}
            <div style="display: flex; gap: 10px;">
              ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank" class="btn btn-primary" style="padding: 6px 14px; font-size: 0.85rem;">Live Demo</a>` : ''}
              ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank" class="btn btn-secondary" style="padding: 6px 14px; font-size: 0.85rem;">Source Code</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
    ` : ''}

    <footer>
      Exported from AI Career Builder • Static Portfolio Deployment Ready
    </footer>
  </div>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${portfolio.hero.name.replace(/\s+/g, '_')}_portfolio.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      showToast('Static HTML Portfolio downloaded! Open in any browser or upload to GitHub Pages.');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  const isDarkTheme = portfolio.theme !== 'minimal-light';

  return (
    <DashboardLayout title="AI Portfolio Website Builder">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* Theme Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2 pr-1 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-indigo-400" /> Theme:
            </span>
            <button
              onClick={() => setPortfolio((p) => ({ ...p, theme: 'elegant-indigo' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                portfolio.theme === 'elegant-indigo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Indigo Glow
            </button>
            <button
              onClick={() => setPortfolio((p) => ({ ...p, theme: 'cyber-dark' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                portfolio.theme === 'cyber-dark' ? 'bg-slate-800 text-purple-300' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cyber Dark
            </button>
            <button
              onClick={() => setPortfolio((p) => ({ ...p, theme: 'minimal-light' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                portfolio.theme === 'minimal-light' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'
              }`}
            >
              Minimal Light
            </button>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewport('desktop')}
              title="Desktop View"
              className={`p-1.5 rounded-lg ${viewport === 'desktop' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              title="Tablet View"
              className={`p-1.5 rounded-lg ${viewport === 'tablet' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              title="Mobile View"
              className={`p-1.5 rounded-lg ${viewport === 'mobile' ? 'bg-slate-800 text-indigo-400' : 'text-slate-500'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            {saving ? 'Saving...' : 'Save Portfolio'}
          </button>

          <button
            onClick={handleExportHTML}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/25 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            Export Static HTML Website
          </button>
        </div>
      </div>

      {/* Main Grid: Configurator (Left) & Live Browser Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Configurator (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex overflow-x-auto gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            {['hero', 'about', 'skills', 'projects', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 rounded-lg font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-h-[750px] overflow-y-auto">
            {activeTab === 'hero' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Hero Header Information</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={portfolio.hero.name}
                    onChange={(e) => setPortfolio((p) => ({ ...p, hero: { ...p.hero, name: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tagline / Professional Title</label>
                  <input
                    type="text"
                    value={portfolio.hero.tagline}
                    onChange={(e) => setPortfolio((p) => ({ ...p, hero: { ...p.hero, tagline: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Headline Hook</label>
                  <textarea
                    rows={2}
                    value={portfolio.hero.headline}
                    onChange={(e) => setPortfolio((p) => ({ ...p, hero: { ...p.hero, headline: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">GitHub URL</label>
                    <input
                      type="text"
                      value={portfolio.hero.socials.github}
                      onChange={(e) =>
                        setPortfolio((p) => ({
                          ...p,
                          hero: { ...p.hero, socials: { ...p.hero.socials, github: e.target.value } },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={portfolio.hero.socials.linkedin}
                      onChange={(e) =>
                        setPortfolio((p) => ({
                          ...p,
                          hero: { ...p.hero, socials: { ...p.hero.socials, linkedin: e.target.value } },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">About Me Story</h3>
                <textarea
                  rows={6}
                  value={portfolio.about.story}
                  onChange={(e) => setPortfolio((p) => ({ ...p, about: { ...p.about, story: e.target.value } }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Skills Showcase</h3>
                {portfolio.skills.map((skill, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        const updated = [...portfolio.skills];
                        updated[idx].name = e.target.value;
                        setPortfolio((p) => ({ ...p, skills: updated }));
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                    />
                    <input
                      type="number"
                      value={skill.level}
                      onChange={(e) => {
                        const updated = [...portfolio.skills];
                        updated[idx].level = Number(e.target.value);
                        setPortfolio((p) => ({ ...p, skills: updated }));
                      }}
                      className="w-16 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white outline-none text-center"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = portfolio.skills.filter((_, i) => i !== idx);
                        setPortfolio((p) => ({ ...p, skills: updated }));
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPortfolio((p) => ({
                      ...p,
                      skills: [...p.skills, { name: 'New Skill', category: 'General', level: 85 }],
                    }))
                  }
                  className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <h3 className="font-bold text-sm text-white">Portfolio Projects</h3>
                {portfolio.projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-purple-400">Project #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = portfolio.projects.filter((_, i) => i !== idx);
                          setPortfolio((p) => ({ ...p, projects: updated }));
                        }}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...portfolio.projects];
                        updated[idx].title = e.target.value;
                        setPortfolio((p) => ({ ...p, projects: updated }));
                      }}
                      placeholder="Title"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                    />
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...portfolio.projects];
                        updated[idx].description = e.target.value;
                        setPortfolio((p) => ({ ...p, projects: updated }));
                      }}
                      placeholder="Description"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPortfolio((p) => ({
                      ...p,
                      projects: [
                        ...p.projects,
                        { title: 'New Web App', description: 'Engineered with MERN stack.', tags: ['React', 'Node.js'], demoUrl: '', githubUrl: '', featured: false },
                      ],
                    }))
                  }
                  className="text-xs text-purple-400 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Project
                </button>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Contact Info</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={portfolio.contact.email}
                    onChange={(e) => setPortfolio((p) => ({ ...p, contact: { ...p.contact, email: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={portfolio.contact.location}
                    onChange={(e) => setPortfolio((p) => ({ ...p, contact: { ...p.contact, location: e.target.value } }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Live Device Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span>Interactive Portfolio Simulator ({viewport.toUpperCase()} Mode)</span>
          </div>

          <div
            className={`transition-all duration-300 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden ${
              viewport === 'mobile'
                ? 'w-[360px]'
                : viewport === 'tablet'
                ? 'w-[640px]'
                : 'w-full max-w-[850px]'
            }`}
          >
            {/* Mock Browser Header */}
            <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="px-4 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-[10px] text-slate-400 truncate max-w-[200px]">
                https://{portfolio.hero.name.toLowerCase().replace(/\s+/g, '')}.dev
              </div>
              <span className="text-[10px] text-indigo-400 font-semibold">{portfolio.theme}</span>
            </div>

            {/* Portfolio Web Page Mockup */}
            <div
              className={`p-6 sm:p-8 max-h-[720px] overflow-y-auto leading-relaxed ${
                isDarkTheme
                  ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-100'
                  : 'bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900'
              }`}
            >
              {/* Hero */}
              <div className="text-center py-8">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
                  🚀 Available for Full Stack Roles
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                  {portfolio.hero.name || 'Developer Name'}
                </h1>
                <p className="text-sm font-medium opacity-80 mt-1">{portfolio.hero.tagline}</p>
                <p className="text-xs opacity-70 max-w-md mx-auto mt-2">{portfolio.hero.headline}</p>

                <div className="flex justify-center gap-2 mt-4">
                  <a
                    href={`mailto:${portfolio.hero.socials.email}`}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs shadow"
                  >
                    Contact Me
                  </a>
                  {portfolio.hero.socials.github && (
                    <a
                      href={portfolio.hero.socials.github}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-200 text-xs border border-slate-700"
                    >
                      GitHub
                    </a>
                  )}
                </div>
              </div>

              {/* Skills Section */}
              {portfolio.skills.length > 0 && (
                <div className="py-6 border-t border-slate-800/40">
                  <h3 className="text-center font-bold text-sm mb-3">Core Technical Skills</h3>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {portfolio.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Grid */}
              {portfolio.projects.length > 0 && (
                <div className="py-6 border-t border-slate-800/40">
                  <h3 className="text-center font-bold text-sm mb-4">Featured Projects</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {portfolio.projects.map((p, i) => (
                      <div
                        key={i}
                        className={`p-3.5 rounded-xl border ${
                          isDarkTheme
                            ? 'bg-slate-900/80 border-slate-800'
                            : 'bg-white border-slate-200 shadow-sm'
                        }`}
                      >
                        <h4 className="font-bold text-xs">{p.title}</h4>
                        <p className="text-[11px] opacity-75 mt-1">{p.description}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {p.tags?.map((t, ti) => (
                            <span key={ti} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioBuilder;
