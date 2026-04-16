import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, CreditCard, Compass, ShieldAlert, HeartPulse, Settings as SettingsIcon, LogOut, Sun, Moon } from 'lucide-react';

const LINKS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'My Debts', icon: CreditCard, path: '/debts' },
  { name: 'Strategy', icon: Compass, path: '/strategy' },
  { name: 'Rules Engine', icon: ShieldAlert, path: '/rules' },
  { name: 'AI Coach', icon: HeartPulse, path: '/coach' },
  { name: 'Settings', icon: SettingsIcon, path: '/settings' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="font-bold text-lg">Debt Helper</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          {LINKS.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-500'
                    : 'text-secondary hover:bg-hover hover:text-primary'
                }`
              }
            >
              <link.icon className="w-5 h-5" />
              {link.name}
            </NavLink>
          ))}
          {user?.email === 'admin@debthelper.com' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'text-secondary hover:bg-hover hover:text-primary'
                }`
              }
            >
              <ShieldAlert className="w-5 h-5" />
              Admin
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">
              {user?.name?.[0] || user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-muted truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="flex-1 btn btn-ghost justify-center h-9 p-0"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={logout}
              className="flex-1 btn btn-ghost justify-center h-9 p-0 text-red-500 hover:text-red-400"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-area">
        <header className="topnav">
          <h1 className="text-sm font-medium text-secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>
        </header>
        <div className="page-content">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
