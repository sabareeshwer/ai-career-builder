import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Globe,
  Mail,
  Compass,
  FolderOpen,
  Settings,
  LogOut,
  Sparkles,
  User as UserIcon,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'ATS Resume Builder', path: '/resume-builder', icon: FileText, highlight: 'AI ATS' },
  { name: 'Portfolio Website', path: '/portfolio-builder', icon: Globe, highlight: 'Export' },
  { name: 'Cover Letter AI', path: '/cover-letter', icon: Mail },
  { name: 'Career Advisor', path: '/career-advisor', icon: Compass, highlight: 'Roadmap' },
  { name: 'Saved Documents', path: '/saved-documents', icon: FolderOpen },
  { name: 'Profile Settings', path: '/profile', icon: Settings },
];

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col justify-between select-none">
      {/* Top Branding */}
      <div>
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80 gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white tracking-tight">AI Career Builder</h1>
            <p className="text-[10px] text-indigo-400 font-medium">Full Stack Platform</p>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm font-semibold text-slate-100 truncate">{user?.name || 'Student User'}</h2>
              <p className="text-xs text-indigo-400 truncate">{user?.targetRole || 'Software Engineer'}</p>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <div className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.highlight && (
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-400/20 text-indigo-300">
                    {item.highlight}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Quick Evaluator Tip
          </div>
          Create or customize your resume and click <b>Download PDF</b> for instant export.
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
