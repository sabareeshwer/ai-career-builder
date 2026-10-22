import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import {
  User,
  Mail,
  Briefcase,
  Lock,
  Save,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateProfile, showToast, systemStatus } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Full Stack Engineer');
  const [bio, setBio] = useState(user?.bio || '');
  const [skills, setSkills] = useState(
    Array.isArray(user?.skills) ? user.skills.join(', ') : 'React, Node.js, Express, MongoDB, Tailwind CSS'
  );
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      targetRole,
      bio,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (password.trim()) {
      payload.password = password;
    }

    const res = await updateProfile(payload);
    setSaving(false);
    if (res.success) {
      setPassword('');
    }
  };

  return (
    <DashboardLayout title="Profile & Account Settings">
      <div className="max-w-3xl space-y-6">
        {/* Profile Card Header */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-extrabold text-2xl text-white shadow-lg">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-indigo-400 font-medium">{user?.targetRole}</p>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Personal & Career Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Job Role</label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Technical Competencies (Comma separated)
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 leading-relaxed"
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Change Password (Leave blank to keep current)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New password (min 6 characters)"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>

        {/* System & Storage Diagnostics */}
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs space-y-2">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Architecture & Security
          </h4>
          <p className="text-slate-400">
            Passwords are hashed using 10 salt rounds with <b>bcryptjs</b>. Sessions are authenticated via stateless <b>JSON Web Tokens (JWT)</b> with 7-day expiration.
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-slate-300">
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
              Database Mode: <b className="text-emerald-400">{systemStatus?.database?.connected ? 'MongoDB' : 'Resilient File Store'}</b>
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800">
              AI Provider: <b className="text-indigo-400">{systemStatus?.aiEngine?.provider || 'Simulation Engine'}</b>
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileSettings;
