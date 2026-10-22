import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resumeAPI } from '../api/client';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {
  ModernATSTemplate,
  ExecutiveATSTemplate,
  TechATSTemplate,
} from '../components/resume/ResumeTemplates';
import AIBadge from '../components/common/AIBadge';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import {
  FileText,
  Sparkles,
  Save,
  Download,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Eye,
  Layers,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

const emptyResume = {
  title: 'Full Stack Engineer ATS Resume',
  template: 'modern',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    professionalTitle: 'Full Stack Developer',
  },
  summary: '',
  skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript (ES6+)', 'Tailwind CSS', 'RESTful APIs', 'Git & GitHub'],
  education: [
    {
      institution: 'University College of Engineering',
      degree: 'Bachelor of Technology',
      fieldOfStudy: 'Computer Science & Engineering',
      startDate: '2022',
      endDate: '2026',
      gpa: '8.8 / 10',
      details: 'Specialization in Full Stack Web Technologies & Software Architecture',
    },
  ],
  experience: [
    {
      company: 'TechCorp Solutions',
      position: 'Full Stack Developer Intern',
      location: 'Remote',
      startDate: 'Jan 2025',
      endDate: 'Jun 2025',
      current: false,
      description: 'Engineered high-performance web applications using the MERN stack.',
      bullets: [
        'Architected RESTful microservices with Node.js & Express, reducing API response latency by 28%.',
        'Implemented JWT authentication with role-based access control protecting 50+ endpoints.',
        'Built responsive client dashboards in React 19 and Tailwind CSS with sub-second page loads.',
      ],
    },
  ],
  projects: [
    {
      title: 'AI Career Builder Platform',
      description: 'Architected end-to-end career acceleration system with ATS resume scoring, portfolio export, and AI recommendations.',
      technologies: 'React, Node.js, Express, MongoDB, Tailwind CSS, Google Gemini API',
      liveUrl: 'https://demo.example.com',
      githubUrl: 'https://github.com/example/ai-career-builder',
    },
    {
      title: 'Cloud Document Collaborator',
      description: 'Engineered real-time markdown editor with WebSocket synchronization and instant PDF rendering.',
      technologies: 'TypeScript, React, Socket.io, Node.js, Docker',
      liveUrl: '',
      githubUrl: '',
    },
  ],
  certifications: [
    {
      title: 'Full Stack Web Development Professional',
      issuer: 'Coursera / Meta',
      date: '2025',
      credentialUrl: '',
    },
  ],
  achievements: [
    {
      title: '1st Prize - College Hackathon 2025',
      description: 'Built an AI-assisted healthcare workflow system within 36 hours.',
    },
  ],
  atsScore: 89,
};

const sampleResumeData = {
  ...emptyResume,
  personalInfo: {
    fullName: 'Alex Rivera',
    email: 'alex.rivera@college.edu',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA (Open to Relocation)',
    website: 'https://alexrivera.dev',
    linkedin: 'linkedin.com/in/alexrivera-fsd',
    github: 'github.com/alexrivera-fsd',
    professionalTitle: 'Full Stack Software Engineer',
  },
  summary:
    'Results-driven and detail-oriented Full Stack Developer with extensive project experience building scalable MERN web applications, RESTful APIs, and cloud microservices. Proven track record of reducing system latency, engineering intuitive UI/UX with modern React, and collaborating within agile software engineering teams.',
};

const ResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');
  const navigate = useNavigate();
  const { user, showToast } = useAuth();

  const [resume, setResume] = useState(() => ({
    ...sampleResumeData,
    personalInfo: {
      ...sampleResumeData.personalInfo,
      fullName: user?.name || sampleResumeData.personalInfo.fullName,
      email: user?.email || sampleResumeData.personalInfo.email,
    },
  }));

  const [saving, setSaving] = useState(false);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [analyzingATS, setAnalyzingATS] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [newSkill, setNewSkill] = useState('');
  const [atsReport, setAtsReport] = useState(null);

  const previewRef = useRef(null);

  // Load existing resume if editing
  useEffect(() => {
    if (resumeId) {
      const loadResume = async () => {
        try {
          const res = await resumeAPI.getById(resumeId);
          if (res.data.success && res.data.resume) {
            setResume(res.data.resume);
            if (res.data.resume.atsAnalysis) {
              setAtsReport(res.data.resume.atsAnalysis);
            }
          }
        } catch (err) {
          showToast('Failed to load requested resume', 'error');
        }
      };
      loadResume();
    }
  }, [resumeId]);

  // Handle Form Change
  const handlePersonalChange = (field, value) => {
    setResume((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // Add / Remove Skills
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !resume.skills.includes(newSkill.trim())) {
      setResume((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setResume((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Dynamic Array Entries (Education, Experience, Projects)
  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', details: '' },
      ],
    }));
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resume.education];
    updated[index][field] = value;
    setResume((prev) => ({ ...prev, education: updated }));
  };

  const removeEducation = (index) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '', bullets: [''] },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index][field] = value;
    setResume((prev) => ({ ...prev, experience: updated }));
  };

  const addExpBullet = (expIndex) => {
    const updated = [...resume.experience];
    updated[expIndex].bullets = [...(updated[expIndex].bullets || []), ''];
    setResume((prev) => ({ ...prev, experience: updated }));
  };

  const updateExpBullet = (expIndex, bulletIndex, value) => {
    const updated = [...resume.experience];
    updated[expIndex].bullets[bulletIndex] = value;
    setResume((prev) => ({ ...prev, experience: updated }));
  };

  const removeExpBullet = (expIndex, bulletIndex) => {
    const updated = [...resume.experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    setResume((prev) => ({ ...prev, experience: updated }));
  };

  const removeExperience = (index) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  const addProject = () => {
    setResume((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { title: '', description: '', technologies: '', liveUrl: '', githubUrl: '' },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    const updated = [...resume.projects];
    updated[index][field] = value;
    setResume((prev) => ({ ...prev, projects: updated }));
  };

  const removeProject = (index) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // AI Summary Generator
  const handleGenerateSummary = async () => {
    setGeneratingSummary(true);
    try {
      const res = await resumeAPI.generateSummary({
        name: resume.personalInfo.fullName,
        role: resume.personalInfo.professionalTitle,
        skills: resume.skills,
        experienceYears: '1-3 years of college capstone & internship experience',
        highlights: resume.projects.map((p) => p.title).join(', '),
      });

      if (res.data.success && res.data.summary) {
        setResume((prev) => ({ ...prev, summary: res.data.summary }));
        showToast('AI Professional Summary Generated!');
      }
    } catch (err) {
      showToast('Error generating AI summary', 'error');
    } finally {
      setGeneratingSummary(false);
    }
  };

  // Run ATS Analysis
  const handleRunATSReview = async () => {
    setAnalyzingATS(true);
    try {
      const res = await resumeAPI.reviewATS({
        resumeData: resume,
        targetRole: resume.personalInfo.professionalTitle || 'Software Engineer',
      });
      if (res.data.success) {
        setAtsReport(res.data.analysis);
        setResume((prev) => ({ ...prev, atsScore: res.data.score }));
        showToast(`ATS Score Audited: ${res.data.score}%`);
      }
    } catch (err) {
      showToast('ATS review failed', 'error');
    } finally {
      setAnalyzingATS(false);
    }
  };

  // Save Resume to MongoDB
  const handleSaveResume = async () => {
    setSaving(true);
    try {
      if (resumeId) {
        await resumeAPI.update(resumeId, resume);
        showToast('Resume updated in MongoDB database!');
      } else {
        const res = await resumeAPI.create(resume);
        if (res.data.success && res.data.resume) {
          showToast('Resume saved to MongoDB database!');
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
          navigate(`/resume-builder?id=${res.data.resume._id || res.data.resume.id}`, { replace: true });
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save resume', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Export PDF
  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;
    setDownloadingPDF(true);

    try {
      showToast('Rendering high-resolution ATS PDF...', 'info');

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${resume.personalInfo.fullName.replace(/\s+/g, '_') || 'Resume'}_ATS.pdf`;
      pdf.save(fileName);

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      showToast('PDF Resume downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      // Fallback to print
      window.print();
    } finally {
      setDownloadingPDF(false);
    }
  };

  return (
    <DashboardLayout title="AI ATS Resume Builder">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={resume.title}
            onChange={(e) => setResume((prev) => ({ ...prev, title: e.target.value }))}
            className="px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-bold text-white focus:border-indigo-500 outline-none max-w-xs"
          />

          {/* Template Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setResume((prev) => ({ ...prev, template: 'modern' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                resume.template === 'modern' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Modern ATS
            </button>
            <button
              onClick={() => setResume((prev) => ({ ...prev, template: 'executive' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                resume.template === 'executive' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setResume((prev) => ({ ...prev, template: 'tech' }))}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                resume.template === 'tech' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tech Clean
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunATSReview}
            disabled={analyzingATS}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {analyzingATS ? 'Auditing...' : `ATS Score (${resume.atsScore || 85}%)`}
          </button>

          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-indigo-400" />
            {saving ? 'Saving...' : 'Save to DB'}
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={downloadingPDF}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Download className="w-3.5 h-3.5" />
            {downloadingPDF ? 'Exporting...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ATS Analysis Drawer (If Audited) */}
      {atsReport && (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-white">
                ATS Compatibility Audit: <span className="text-emerald-400">{atsReport.score || resume.atsScore}% Score</span>
              </h3>
            </div>
            <AIBadge compact />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold text-slate-200 block mb-1">Key Strengths Detected:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                {atsReport.strengths?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <span className="font-semibold text-amber-300 block mb-1">ATS Optimization Suggestions:</span>
              <ul className="list-disc list-inside space-y-1 text-amber-200/90">
                {atsReport.suggestions?.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Split-Screen: Builder Form & Live ATS Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Section Navigation Tabs */}
          <div className="flex overflow-x-auto gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'personal', label: 'Personal' },
              { id: 'summary', label: 'Summary' },
              { id: 'skills', label: 'Skills' },
              { id: 'experience', label: 'Experience' },
              { id: 'projects', label: 'Projects' },
              { id: 'education', label: 'Education' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-3 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  activeSection === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Cards */}
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 max-h-[750px] overflow-y-auto">
            {/* 1. Personal Info */}
            {activeSection === 'personal' && (
              <div className="space-y-3.5">
                <h3 className="font-bold text-sm text-white">Personal & Contact Info</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={resume.personalInfo.fullName}
                    onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Target Title</label>
                    <input
                      type="text"
                      value={resume.personalInfo.professionalTitle}
                      onChange={(e) => handlePersonalChange('professionalTitle', e.target.value)}
                      placeholder="Full Stack Software Engineer"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={resume.personalInfo.email}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={resume.personalInfo.phone}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                      placeholder="+1 (555) 234-5678"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={resume.personalInfo.location}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                      placeholder="City, State"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn Profile</label>
                    <input
                      type="text"
                      value={resume.personalInfo.linkedin}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">GitHub Profile</label>
                    <input
                      type="text"
                      value={resume.personalInfo.github}
                      onChange={(e) => handlePersonalChange('github', e.target.value)}
                      placeholder="github.com/username"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Professional Summary */}
            {activeSection === 'summary' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Professional Summary</h3>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={generatingSummary}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-600/50 flex items-center gap-1.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {generatingSummary ? 'Crafting...' : 'AI Generate Summary'}
                  </button>
                </div>
                <textarea
                  rows={6}
                  value={resume.summary}
                  onChange={(e) => setResume((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="A concise, high-impact overview of your technical background..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
                />
                <p className="text-[11px] text-slate-400">
                  Tip: Keep summaries under 4 sentences focusing on core tech competencies and problem-solving impact.
                </p>
              </div>
            )}

            {/* 3. Skills */}
            {activeSection === 'skills' && (
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white">Technical Skills</h3>
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. Docker, TypeScript, GraphQL"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                  >
                    Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {resume.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Experience */}
            {activeSection === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Work & Internships</h3>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-600/50 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>

                {resume.experience.map((exp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Position #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeExperience(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateExperience(idx, 'position', e.target.value)}
                        placeholder="Job Title / Role"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(idx, 'company', e.target.value)}
                        placeholder="Company Name"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                        placeholder="Start Date (e.g. Jan 2025)"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                        placeholder="End Date (or Present)"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>

                    {/* Bullet Points */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-slate-300">Action Bullets</span>
                        <button
                          type="button"
                          onClick={() => addExpBullet(idx)}
                          className="text-[10px] text-indigo-400 hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>
                      {exp.bullets?.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-1.5">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateExpBullet(idx, bIdx, e.target.value)}
                            placeholder="Engineered X using Y, achieving Z% improvement..."
                            className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeExpBullet(idx, bIdx)}
                            className="text-slate-500 hover:text-rose-400 px-1"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 5. Projects */}
            {activeSection === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Engineering Projects</h3>
                  <button
                    type="button"
                    onClick={addProject}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-600/50 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                {resume.projects.map((proj, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Project #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeProject(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(idx, 'title', e.target.value)}
                      placeholder="Project Title"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                    />

                    <input
                      type="text"
                      value={proj.technologies}
                      onChange={(e) => updateProject(idx, 'technologies', e.target.value)}
                      placeholder="Tech Stack (e.g. React, Node.js, MongoDB)"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                    />

                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(idx, 'description', e.target.value)}
                      placeholder="Brief problem statement and engineering implementation..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 6. Education */}
            {activeSection === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Education & Degrees</h3>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-600/50 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add School
                  </button>
                </div>

                {resume.education.map((edu, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-indigo-400">Education #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(idx, 'institution', e.target.value)}
                      placeholder="College or University"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(idx, 'degree', e.target.value)}
                        placeholder="Degree (e.g. B.Tech)"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(idx, 'fieldOfStudy', e.target.value)}
                        placeholder="Major (e.g. Computer Science)"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateEducation(idx, 'startDate', e.target.value)}
                        placeholder="Start Year"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateEducation(idx, 'endDate', e.target.value)}
                        placeholder="End Year"
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Live Preview Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-slate-200">Real-Time ATS Document Preview</span>
            </div>
            <span className="text-[11px] bg-slate-900 px-2.5 py-0.5 rounded-full border border-slate-800">
              Template: <b className="text-white capitalize">{resume.template}</b>
            </span>
          </div>

          {/* Paper Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950 p-2 shadow-2xl">
            <div ref={previewRef} className="max-w-[800px] mx-auto overflow-hidden">
              {resume.template === 'executive' ? (
                <ExecutiveATSTemplate resume={resume} />
              ) : resume.template === 'tech' ? (
                <TechATSTemplate resume={resume} />
              ) : (
                <ModernATSTemplate resume={resume} />
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ResumeBuilder;
