import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  BrainCircuit,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import type { PageId, Theme } from '../types';

interface AppLayoutProps {
  page: PageId;
  setPage: (p: PageId) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  children: ReactNode;
}

export function AppLayout({
  theme,
  setTheme,
  children,
}: AppLayoutProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 transition-colors duration-200 dark:bg-[#0B1020] dark:text-slate-100 bg-saas-grid">
      {/* Mobile Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200/80 bg-white transition-transform duration-250 ease-in-out dark:border-white/[0.08] dark:bg-[#111831] ${
          mobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-full flex-col justify-between">
          <div>
            {/* Logo and Brand Header */}
            <div className="flex h-20 items-center justify-between border-b border-slate-100 px-5 dark:border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
                  <BrainCircuit size={22} />
                </div>
                <div>
                  <div className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">
                    Retail Intelligence
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                    ML Prediction
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden dark:hover:bg-slate-800 dark:hover:text-white transition"
                onClick={() => setMobileDrawerOpen(false)}
                aria-label="Close navigation sidebar"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation links */}
            <div className="p-3">
              <button
                type="button"
                className="group flex w-full items-center gap-3 rounded-xl bg-blue-600 px-3.5 py-2.5 text-left text-[14px] font-semibold text-white shadow-sm shadow-blue-500/30 transition"
              >
                <BrainCircuit size={18} className="text-blue-100" />
                <span>Sales Prediction</span>
                <span className="ml-auto h-2 w-2 rounded-full bg-emerald-300" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-md md:px-7 dark:border-white/[0.08] dark:bg-[#0B1020]/85">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden dark:border-white/[0.08] dark:text-slate-300 dark:hover:bg-slate-800 transition"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="text-[16px] font-bold tracking-tight text-slate-900 dark:text-white">
              Retail Intelligence
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Inference Ready</span>
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:border-white/[0.08] dark:bg-[#111831] dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition"
              aria-label="Toggle visual color theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 py-4 text-center text-xs text-slate-500 dark:border-white/[0.06] dark:text-slate-400">
          <p className="font-medium text-slate-700 dark:text-slate-300">
            Created by <span className="font-semibold text-slate-900 dark:text-white">Aryan Bhoya</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
