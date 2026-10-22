import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coverLetterAPI } from '../api/client';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AIBadge from '../components/common/AIBadge';
import jsPDF from 'jspdf';
import confetti from 'canvas-confetti';
import {
  Mail,
  Sparkles,
  Copy,
  Download,
  Save,
  Check,
  Building,
  Briefcase,
  FileText,
  Zap,
} from 'lucide-react';

const CoverLetterGenerator = () => {
  const [searchParams] = useSearchParams();
  const letterId = searchParams.get('id');
  const { user, showToast } = useAuth();

  const [formData, setFormData] = useState({
    title: 'Software Engineer Application',
    applicantName: user?.name || 'Alex Rivera',
    email: user?.email || 'alex.rivera@college.edu',
    phone: '+1 (555) 234-5678',
    recipientRole: 'Hiring Manager',
    companyName: 'CloudScale Technologies',
    jobTitle: 'Full Stack Engineer',
    jobDescription: 'Seeking an enthusiastic Full Stack Engineer to architect modern React microservices, design scalable Node.js backend APIs, and collaborate with agile engineering squads.',
    relevantSkills: 'React 19, Node.js, Express, MongoDB, Tailwind CSS, REST APIs, Git',
    tone: 'professional',
  });

  const [generatedLetter, setGeneratedLetter] = useState('');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [aiInfo, setAiInfo] = useState({ isDemo: false, engine: '' });

  useEffect(() => {
    if (letterId) {
      const load = async () => {
        try {
          const res = await coverLetterAPI.getById(letterId);
          if (res.data.success && res.data.letter) {
            const l = res.data.letter;
            setFormData({
              title: l.title || '',
              applicantName: l.applicantName || '',
              email: l.email || '',
              phone: l.phone || '',
              recipientRole: l.recipientRole || '',
              companyName: l.companyName || '',
              jobTitle: l.jobTitle || '',
              jobDescription: l.jobDescription || '',
              relevantSkills: Array.isArray(l.keySkills) ? l.keySkills.join(', ') : '',
              tone: l.tone || 'professional',
            });
            setGeneratedLetter(l.content || '');
          }
        } catch {
          showToast('Failed to load requested cover letter', 'error');
        }
      };
      load();
    }
  }, [letterId]);

  // Handle Form Change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // AI Generation
  const handleGenerate = async () => {
    if (!formData.companyName || !formData.jobTitle) {
      showToast('Please provide Company Name and Job Title', 'error');
      return;
    }

    setGenerating(true);
    try {
      const res = await coverLetterAPI.generateAI({
        ...formData,
        relevantSkills: formData.relevantSkills.split(',').map((s) => s.trim()),
      });

      if (res.data.success && res.data.content) {
        setGeneratedLetter(res.data.content);
        setAiInfo({
          isDemo: res.data.isDemoMode,
          engine: res.data.aiEngine,
        });
        showToast('Personalized AI Cover Letter generated!');
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.7 } });
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'AI Generation failed', 'error');
    } finally {
      setGenerating(false);
    }
  };

  // Save to MongoDB
  const handleSave = async () => {
    if (!generatedLetter) {
      showToast('Generate a cover letter first before saving', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        content: generatedLetter,
        keySkills: formData.relevantSkills.split(',').map((s) => s.trim()),
      };

      if (letterId) {
        await coverLetterAPI.update(letterId, payload);
        showToast('Cover letter updated in MongoDB!');
      } else {
        await coverLetterAPI.create(payload);
        showToast('Cover letter saved to MongoDB!');
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.8 } });
      }
    } catch (err) {
      showToast('Failed to save cover letter', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Copy to Clipboard
  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    showToast('Cover letter copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Export PDF
  const handleDownloadPDF = () => {
    if (!generatedLetter) return;
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(formData.applicantName, 20, 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`${formData.email} • ${formData.phone}`, 20, 26);
      doc.setLineWidth(0.5);
      doc.line(20, 30, 190, 30);

      doc.setFontSize(11);
      const splitText = doc.splitTextToSize(generatedLetter, 170);
      doc.text(splitText, 20, 42);

      const fileName = `${formData.companyName.replace(/\s+/g, '_')}_Cover_Letter.pdf`;
      doc.save(fileName);
      showToast('PDF Cover Letter exported!');
    } catch (err) {
      showToast('PDF export failed', 'error');
    }
  };

  return (
    <DashboardLayout title="AI Cover Letter Generator">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-emerald-400" />
            Tailored AI Cover Letter Writer
          </h2>
          <p className="text-xs text-slate-400">
            Generate customized 4-paragraph applications aligning your skills with specific job descriptions.
          </p>
        </div>

        <AIBadge isDemo={aiInfo.isDemo} engineName={aiInfo.engine} compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Form Column (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Target Opportunity Details</h3>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  title: 'Full Stack Engineer Application',
                  applicantName: user?.name || 'Alex Rivera',
                  email: user?.email || 'alex.rivera@college.edu',
                  phone: '+1 (555) 234-5678',
                  recipientRole: 'Engineering Hiring Team',
                  companyName: 'Stripe',
                  jobTitle: 'Software Engineer - Developer Infrastructure',
                  jobDescription:
                    'Building reliable, highly scalable developer platforms and REST APIs supporting global payments infrastructure.',
                  relevantSkills: 'React, Node.js, TypeScript, Distributed Systems, REST APIs, Git',
                  tone: 'enthusiastic',
                })
              }
              className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5" /> Preload Demo Role
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                placeholder="Google, Stripe, etc."
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleChange('jobTitle', e.target.value)}
                placeholder="Full Stack Engineer"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Recipient Name/Role</label>
              <input
                type="text"
                value={formData.recipientRole}
                onChange={(e) => handleChange('recipientRole', e.target.value)}
                placeholder="Hiring Manager"
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Writing Tone</label>
              <select
                value={formData.tone}
                onChange={(e) => handleChange('tone', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 capitalize"
              >
                <option value="professional">Professional & Confident</option>
                <option value="enthusiastic">Enthusiastic & Driven</option>
                <option value="concise">Concise & Direct</option>
                <option value="creative">Creative & Impactful</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Relevant Skills to Highlight</label>
            <input
              type="text"
              value={formData.relevantSkills}
              onChange={(e) => handleChange('relevantSkills', e.target.value)}
              placeholder="React, Node.js, Express, MongoDB..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Job Description or Role Context</label>
            <textarea
              rows={4}
              value={formData.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
              placeholder="Paste excerpt from job posting..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'AI Generating Application...' : 'Generate AI Cover Letter'}
          </button>
        </div>

        {/* Output & Editor Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-200">Generated Cover Letter (Editable)</span>
            {generatedLetter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-indigo-400" />
                  Save
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  PDF
                </button>
              </div>
            )}
          </div>

          {/* Letter Document Preview Box */}
          <div className="rounded-2xl border border-slate-800 bg-white text-slate-900 p-8 sm:p-10 shadow-2xl min-h-[550px]">
            {generatedLetter ? (
              <textarea
                rows={18}
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full h-full bg-transparent border-none outline-none resize-none font-sans text-xs leading-relaxed text-slate-800"
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400">
                <Mail className="w-12 h-12 text-slate-300 mb-3" />
                <h4 className="font-bold text-sm text-slate-700">Ready to Write Your Cover Letter</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Fill in the company name and role on the left, then click "Generate AI Cover Letter".
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CoverLetterGenerator;
