import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';

export const ModernATSTemplate = ({ resume }) => {
  const { personalInfo = {}, summary = '', skills = [], education = [], experience = [], projects = [], certifications = [] } = resume || {};

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-10 font-sans leading-relaxed text-xs shadow-xl min-h-[1050px] print:p-0 print:shadow-none">
      {/* Header */}
      <div className="border-b-2 border-indigo-600 pb-5 mb-5 text-center sm:text-left sm:flex sm:justify-between sm:items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-sm font-semibold text-indigo-600 mt-1">
            {personalInfo.professionalTitle || 'Software Engineer'}
          </p>
        </div>
        <div className="mt-3 sm:mt-0 text-slate-600 space-y-1 text-right text-[11px]">
          {personalInfo.email && <div className="flex items-center sm:justify-end gap-1.5"><Mail className="w-3 h-3 text-indigo-500" />{personalInfo.email}</div>}
          {personalInfo.phone && <div className="flex items-center sm:justify-end gap-1.5"><Phone className="w-3 h-3 text-indigo-500" />{personalInfo.phone}</div>}
          {personalInfo.location && <div className="flex items-center sm:justify-end gap-1.5"><MapPin className="w-3 h-3 text-indigo-500" />{personalInfo.location}</div>}
          <div className="flex items-center sm:justify-end gap-3 pt-1">
            {personalInfo.linkedin && <span className="text-indigo-600 font-medium">LinkedIn</span>}
            {personalInfo.github && <span className="text-indigo-600 font-medium">GitHub</span>}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-slate-700 leading-normal text-[11px] text-justify">{summary}</p>
        </div>
      )}

      {/* Core Technical Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
            Technical Proficiencies
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-medium text-[10px] border border-slate-200">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
            Work Experience
          </h2>
          <div className="space-y-3.5">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-[11px] text-indigo-600 font-medium">{exp.company} {exp.location && `• ${exp.location}`}</div>
                {exp.description && <p className="text-slate-600 text-[11px] mt-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700 text-[11px]">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-tight">{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
            Key Engineering Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{proj.title}</span>
                  {proj.technologies && <span className="text-[10px] text-slate-500 italic">[{proj.technologies}]</span>}
                </div>
                <p className="text-slate-700 text-[11px] mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-[11px] text-slate-600">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
                <div className="text-[10px] text-slate-500 font-medium">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-900 border-b border-slate-200 pb-1 mb-2">
            Certifications & Credentials
          </h2>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
            {certifications.map((c, idx) => (
              <li key={idx}><span className="font-medium text-slate-900">{c.title}</span> - {c.issuer} ({c.date})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const ExecutiveATSTemplate = ({ resume }) => {
  const { personalInfo = {}, summary = '', skills = [], education = [], experience = [], projects = [] } = resume || {};

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-10 font-serif leading-relaxed text-xs shadow-xl min-h-[1050px] print:p-0 print:shadow-none">
      {/* Formal Centered Header */}
      <div className="text-center border-b border-slate-400 pb-4 mb-5">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-slate-900 font-sans">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-700 mt-1">
          {personalInfo.professionalTitle || 'Executive Professional'}
        </p>
        <div className="flex flex-wrap justify-center items-center gap-2 mt-2 text-[10px] text-slate-600 font-sans">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Executive Summary */}
      {summary && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Executive Summary
          </h2>
          <p className="text-slate-700 text-[11px] leading-relaxed text-justify">{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-slate-900 text-xs">{exp.position}</span>
                  <span className="text-[10px] text-slate-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="font-semibold text-[11px] text-slate-700 italic">{exp.company}, {exp.location}</div>
                {exp.description && <p className="text-slate-700 text-[11px] mt-1">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700 text-[11px]">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-slate-900 text-xs font-sans">{edu.degree} in {edu.fieldOfStudy}</span>
                  <div className="text-[11px] text-slate-700 italic">{edu.institution} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                </div>
                <span className="text-[10px] text-slate-600 font-sans">{edu.startDate} - {edu.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-300 pb-0.5 mb-2 font-sans">
            Core Competencies
          </h2>
          <p className="text-slate-700 text-[11px] font-sans">
            {skills.join('  •  ')}
          </p>
        </div>
      )}
    </div>
  );
};

export const TechATSTemplate = ({ resume }) => {
  const { personalInfo = {}, summary = '', skills = [], education = [], experience = [], projects = [] } = resume || {};

  return (
    <div className="bg-white text-slate-900 p-8 sm:p-10 font-sans leading-relaxed text-xs shadow-xl min-h-[1050px] print:p-0 print:shadow-none border-t-4 border-slate-900">
      {/* Header */}
      <div className="pb-4 mb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {personalInfo.fullName || 'Developer Name'}
        </h1>
        <div className="text-sm font-bold text-slate-700 mt-0.5 font-mono">
          &gt; {personalInfo.professionalTitle || 'Full Stack Engineer'}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[10px] text-slate-600 font-mono">
          {personalInfo.email && <span>email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>tel: {personalInfo.phone}</span>}
          {personalInfo.github && <span>github: {personalInfo.github}</span>}
          {personalInfo.linkedin && <span>linkedin: {personalInfo.linkedin}</span>}
        </div>
      </div>

      {/* Technical Skills Header First for Engineering Parsing */}
      {skills && skills.length > 0 && (
        <div className="mb-5 bg-slate-50 p-3 rounded border border-slate-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 font-mono mb-1.5">
            // Core Technical Stack
          </div>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="bg-white border border-slate-300 text-slate-800 px-2 py-0.5 rounded text-[10px] font-mono font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1 mb-1.5">
            // About & Profile
          </div>
          <p className="text-slate-700 text-[11px] leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Projects First for Tech Focus */}
      {projects && projects.length > 0 && (
        <div className="mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1 mb-2">
            // Featured Engineering Projects
          </div>
          <div className="space-y-3">
            {projects.map((p, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{p.title}</span>
                  {p.technologies && <span className="font-mono text-[10px] text-slate-500">{p.technologies}</span>}
                </div>
                <p className="text-slate-700 text-[11px] mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1 mb-2">
            // Work Experience
          </div>
          <div className="space-y-3">
            {experience.map((exp, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-xs">{exp.position} @ {exp.company}</span>
                  <span className="font-mono text-[10px] text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.description && <p className="text-slate-700 text-[11px] mt-0.5">{exp.description}</p>}
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700 text-[11px]">
                    {exp.bullets.map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1 mb-2">
            // Education & Academics
          </div>
          <div className="space-y-2">
            {education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-baseline">
                <div>
                  <div className="font-bold text-slate-900 text-xs">{edu.degree} in {edu.fieldOfStudy}</div>
                  <div className="text-[11px] text-slate-600">{edu.institution} {edu.gpa && `| GPA: ${edu.gpa}`}</div>
                </div>
                <div className="font-mono text-[10px] text-slate-500">{edu.startDate} - {edu.endDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
