import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import PendingNotice from '../components/Common/PendingNotice';

export function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('analyst');
  const [email, setEmail] = useState('analyst@fraud-detector.local');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [environment, setEnvironment] = useState('rf-balanced');
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    // Check real backend status
    api
      .checkRoot()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@fraud-detector.local');
    } else {
      setEmail('analyst@fraud-detector.local');
    }
  };

  const handleDemoAutofill = (role) => {
    handleRoleSelect(role);
    setPassword('demo1234');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole, email, environment);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-0 md:p-6 lg:p-8 bg-[#080D17]">
      <div className="w-full max-w-[1440px] min-h-[900px] bg-[#0B111E] rounded-none md:rounded-2xl border border-[#1E293B] shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* LEFT PANEL: Hero Brand & Project Overview */}
        <aside className="w-full lg:w-[520px] lg:min-w-[520px] grid-bg-mesh border-b lg:border-b-0 lg:border-r border-[#1E293B] p-8 lg:p-12 flex flex-col justify-between relative">
          <div>
            {/* Top Brand Header */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#2A3A54] flex items-center justify-center text-[#4CD7F6] shadow-sm">
                  <span className="material-symbols-outlined text-2xl fill">shield</span>
                </div>
                <div>
                  <span className="text-base font-bold text-[#F8FAFC] block leading-tight">
                    Fraud Detection & Drift System
                  </span>
                  <span className="text-xs text-[#06B6D4] font-medium">
                    Academic Capstone Project | FastAPI & MySQL
                  </span>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F172A] border border-[#1E293B] text-xs text-[#94A3B8]">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Model Active</span>
              </div>
            </div>

            {/* Hero Title */}
            <div className="mt-12 lg:mt-14">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-[#4CD7F6] text-xs font-medium mb-4">
                <span className="material-symbols-outlined text-sm">school</span>
                <span>Undergraduate Senior Project</span>
              </div>
              <h1 className="text-3xl lg:text-[34px] font-bold text-[#F8FAFC] leading-snug tracking-tight">
                Fraud Detection & Drift Monitoring
              </h1>
              <p className="mt-3 text-sm text-[#94A3B8] leading-relaxed">
                An applied machine learning system designed to flag suspicious financial transactions
                and monitor real-time distribution drift across feature vectors.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-md bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">verified</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F8FAFC]">92.4% Model Precision</span>
                    <span className="text-xs text-emerald-400 font-medium">Test Set</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] truncate">
                    Trained on synthetic credit card fraud benchmark dataset
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-md bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">insights</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F8FAFC]">SHAP TreeExplainer</span>
                    <span className="text-xs text-[#06B6D4]">Local SHAP</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] truncate">
                    Feature attribution bar plots for flagged transactions
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#0F172A]/80 border border-[#1E293B] backdrop-blur-sm">
                <div className="w-9 h-9 rounded-md bg-[#06B6D4]/10 text-[#06B6D4] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">monitoring</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#F8FAFC]">
                      Population Stability Index
                    </span>
                    <span className="text-xs text-emerald-400 font-mono">PSI: 0.082</span>
                  </div>
                  <p className="text-xs text-[#94A3B8] truncate">
                    Drift tracking across batch inference distributions
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-8 pt-6 border-t border-[#1E293B] flex items-center justify-between text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#06B6D4]">code</span>
              <span>Python • scikit-learn • FastAPI</span>
            </div>
            <span>v1.0.0</span>
          </div>
        </aside>

        {/* RIGHT PANEL: Login Form */}
        <main className="flex-1 bg-[#0B111E] p-6 sm:p-10 lg:p-14 flex flex-col justify-between overflow-y-auto">
          {/* Status Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  apiOnline === true
                    ? 'bg-emerald-400'
                    : apiOnline === false
                    ? 'bg-amber-400'
                    : 'bg-slate-500 animate-pulse'
                }`}
              ></span>
              <span className="text-xs font-medium text-[#94A3B8]">
                {apiOnline === true
                  ? 'FastAPI Backend Online'
                  : apiOnline === false
                  ? 'Backend Disconnected (Port 8000)'
                  : 'Checking API Status...'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
              <span className="material-symbols-outlined text-sm">database</span>
              <span>MySQL Local Instance</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="w-full max-w-[440px] mx-auto py-6">
            <div className="mb-6 text-left">
              <h2 className="text-2xl font-bold text-[#F8FAFC] tracking-tight">Portal Access</h2>
              <p className="text-sm text-[#94A3B8] mt-1.5">
                Authenticate with your project credentials to enter the workspace.
              </p>
            </div>

            {/* Role Toggle */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#94A3B8] mb-2">Select User Role</label>
              <div className="grid grid-cols-2 p-1 rounded-lg bg-[#070C16] border border-[#1E293B]">
                <button
                  type="button"
                  onClick={() => handleRoleSelect('analyst')}
                  className={`py-2 px-4 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    selectedRole === 'analyst'
                      ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#2A3A54] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#06B6D4]">
                    fact_check
                  </span>
                  <span>Analyst</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleSelect('admin')}
                  className={`py-2 px-4 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-2 ${
                    selectedRole === 'admin'
                      ? 'bg-[#0F172A] text-[#F8FAFC] border border-[#2A3A54] shadow-sm'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC] border border-transparent'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-[#06B6D4]">
                    admin_panel_settings
                  </span>
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5" htmlFor="emailField">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <span className="material-symbols-outlined text-lg">alternate_email</span>
                  </div>
                  <input
                    id="emailField"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-[#070C16] border border-[#1E293B] text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#06B6D4] transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-[#F8FAFC]" htmlFor="passwordField">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setPassword('demo1234')}
                    className="text-xs text-[#06B6D4] hover:underline font-medium"
                  >
                    Fill Default
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <span className="material-symbols-outlined text-lg">lock</span>
                  </div>
                  <input
                    id="passwordField"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-11 rounded-lg bg-[#070C16] border border-[#1E293B] text-xs text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#06B6D4] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#64748B] hover:text-[#F8FAFC]"
                  >
                    <span className="material-symbols-outlined text-base">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#F8FAFC] mb-1.5">
                  Environment / Model
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <span className="material-symbols-outlined text-lg">hub</span>
                  </div>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rounded-lg bg-[#070C16] border border-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#06B6D4] transition-all appearance-none cursor-pointer"
                  >
                    <option value="rf-balanced">Random Forest Classifier (v1.0 - Balanced via SMOTE)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#64748B]">
                    <span className="material-symbols-outlined text-sm">unfold_more</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-10 px-4 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#080D17] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-[#06B6D4]/10 cursor-pointer"
                >
                  <span>Sign In to Dashboard</span>
                  <span className="material-symbols-outlined text-base font-bold">arrow_forward</span>
                </button>
              </div>
            </form>

            <div className="mt-4">
              <PendingNotice
                feature="Backend Authentication API"
                endpoint="POST /auth/login"
                sourceFile="routes/users.py (Pending backend implementation)"
                description="Dedicated JWT/session authentication route is pending in backend. Quick demo credentials below allow role-based evaluation."
              />
            </div>

            {/* Demo Accounts */}
            <div className="mt-5 p-3 rounded-lg bg-[#0F172A] border border-[#1E293B] text-xs">
              <div className="flex items-center justify-between text-[#94A3B8] mb-2">
                <div className="flex items-center gap-1.5 font-medium text-[#F8FAFC]">
                  <span className="material-symbols-outlined text-sm text-[#06B6D4]">account_circle</span>
                  <span>Demo Test Accounts</span>
                </div>
                <span className="text-[11px] text-[#64748B]">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoAutofill('analyst')}
                  className="p-2 rounded-lg bg-[#070C16] hover:bg-[#161F33] border border-[#1E293B] text-left transition-colors"
                >
                  <span className="text-xs text-[#F8FAFC] font-medium block">Analyst</span>
                  <span className="text-[10px] text-[#64748B] block truncate">
                    analyst@fraud-detector.local
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoAutofill('admin')}
                  className="p-2 rounded-lg bg-[#070C16] hover:bg-[#161F33] border border-[#1E293B] text-left transition-colors"
                >
                  <span className="text-xs text-[#F8FAFC] font-medium block">Admin</span>
                  <span className="text-[10px] text-[#64748B] block truncate">
                    admin@fraud-detector.local
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom notice */}
          <div className="pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#06B6D4]">info</span>
              <span>
                Evaluation Environment: <span className="text-[#94A3B8]">Local Development</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#06B6D4]"></span>
              <span>Model Drift Logging Active</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default LoginPage;
