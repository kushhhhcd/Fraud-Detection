import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import MetricCard from '../components/Common/MetricCard';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';

export function ModelHealthPage({ onTriggerRetrain }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [threshold, setThreshold] = useState(0.7);
  const [curveTab, setCurveTab] = useState('pr'); // 'pr' | 'roc' | 'lift'

  // Add Model Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newModel, setNewModel] = useState({
    model_id: `mod_${Date.now().toString().slice(-4)}`,
    model_name: 'Random Forest (Tuned v1.2)',
    model_accuracy: 94.8,
    model_precision: 92.4,
    model_recall: 88.1,
    model_f1_score: 0.902,
    model_roc_auc: 0.942,
    model_status: 'Active',
  });

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    try {
      const data = await api.getModels();
      if (Array.isArray(data) && data.length > 0) {
        setModels(data);
      } else {
        // Default models benchmark if none in DB yet
        setModels([
          {
            model_id: 'rf_smote_v1.0',
            model_name: 'Random Forest (Tuned + SMOTE)',
            model_accuracy: 94.8,
            model_precision: 92.4,
            model_recall: 88.1,
            model_f1_score: 0.902,
            model_roc_auc: 0.942,
            model_status: 'Active',
            model_training_time: new Date().toISOString(),
          },
          {
            model_id: 'rf_baseline_v0.9',
            model_name: 'Random Forest (Baseline)',
            model_accuracy: 91.2,
            model_precision: 89.5,
            model_recall: 81.2,
            model_f1_score: 0.851,
            model_roc_auc: 0.91,
            model_status: 'Baseline',
            model_training_time: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            model_id: 'rf_raw_v0.8',
            model_name: 'Random Forest (Unbalanced Benchmark)',
            model_accuracy: 86.4,
            model_precision: 83.1,
            model_recall: 74.6,
            model_f1_score: 0.786,
            model_roc_auc: 0.865,
            model_status: 'Archived',
            model_training_time: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error('Error fetching models:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModel = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        model_id: newModel.model_id,
        model_name: newModel.model_name,
        model_accuracy: parseFloat(newModel.model_accuracy),
        model_precision: parseFloat(newModel.model_precision),
        model_recall: parseFloat(newModel.model_recall),
        model_f1_score: parseFloat(newModel.model_f1_score),
        model_roc_auc: parseFloat(newModel.model_roc_auc),
        model_status: newModel.model_status,
      };
      const created = await api.createModel(payload);
      setModels((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
    } catch (err) {
      alert(`Failed to save model: ${err.message}`);
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (!window.confirm(`Delete model ${modelId}?`)) return;
    try {
      await api.deleteModel(modelId);
      setModels((prev) => prev.filter((m) => m.model_id !== modelId));
    } catch (err) {
      alert(`Failed to delete model: ${err.message}`);
    }
  };

  const activeModel = models[0] || {};
  // Compute dynamic stats based on slider threshold
  const dynamicPrecision = (92.4 + (threshold - 0.7) * 12).toFixed(1);
  const dynamicRecall = (88.1 - (threshold - 0.7) * 16).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="bg-[#131D31] border border-[#1E293B] rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">
              Model Health & Validation Performance
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/70 text-cyan-300 text-[11px] font-mono border border-cyan-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              FastAPI /models
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Holdout split validation metrics evaluated with scikit-learn metrics suite
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            type="button"
            className="h-8 px-3 bg-[#0F172A] border border-[#1E293B] text-slate-200 hover:text-white text-xs font-medium rounded hover:bg-[#1A263E] transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm text-cyan-400">add</span>
            <span>Record Experiment</span>
          </button>
          <button
            onClick={onTriggerRetrain}
            type="button"
            className="h-8 px-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm font-bold">bolt</span>
            <span>Retrain Pipeline</span>
          </button>
        </div>
      </section>

      {/* 6 Bento Metric Cards Row */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#131D31] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Precision
            </span>
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {activeModel.model_precision || 92.4}%
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">+1.2%</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: &gt;90%</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
              Met
            </span>
          </div>
        </div>

        <div className="bg-[#131D31] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Recall
            </span>
            <span className="material-symbols-outlined text-emerald-400 text-sm">check_circle</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {activeModel.model_recall || 88.1}%
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">+2.4%</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Target: &gt;85%</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
              Met
            </span>
          </div>
        </div>

        <div className="bg-[#131D31] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              F2-Score
            </span>
            <span className="material-symbols-outlined text-cyan-400 text-sm">shield</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">0.898</span>
            <span className="text-[11px] text-emerald-400 font-semibold">+0.015</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">Fraud Focus (β=2)</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
              Met
            </span>
          </div>
        </div>

        <div className="bg-[#131D31] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              F1-Score
            </span>
            <span className="material-symbols-outlined text-slate-400 text-sm">analytics</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {activeModel.model_f1_score || 0.902}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">+0.018</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Harmonic Mean</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
              Met
            </span>
          </div>
        </div>

        <div className="bg-[#131D31] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              ROC-AUC
            </span>
            <span className="material-symbols-outlined text-cyan-400 text-sm">show_chart</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">
              {activeModel.model_roc_auc || 0.942}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">+0.021</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Baseline: 0.910</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
              Met
            </span>
          </div>
        </div>

        <div className="bg-[#131D31] border border-[#1E293B] rounded-lg p-3.5 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              PR-AUC
            </span>
            <span className="material-symbols-outlined text-cyan-400 text-sm">area_chart</span>
          </div>
          <div className="flex items-baseline justify-between py-0.5">
            <span className="text-2xl font-bold text-white tracking-tight">0.915</span>
            <span className="text-[11px] text-emerald-400 font-semibold">+0.012</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#1E293B] flex items-center justify-between text-[11px] text-slate-400">
            <span>Curve Integral</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-400 font-medium text-[10px]">
              Met
            </span>
          </div>
        </div>
      </section>

      {/* Middle Grid: 60% Left (Curves) / 40% Right (Confusion Matrix) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT 60%: Precision-Recall & ROC Curve */}
        <div className="lg:col-span-7 bg-[#131D31] border border-[#1E293B] rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-white">Precision-Recall & ROC Curve Analysis</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0F172A] text-cyan-400 border border-[#1E293B]">
                Holdout Split: 2,964 Evals
              </span>
            </div>

            <div className="flex items-center bg-[#0F172A] p-0.5 rounded border border-[#1E293B] text-[11px]">
              <button
                onClick={() => setCurveTab('pr')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  curveTab === 'pr'
                    ? 'bg-[#1E293B] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                type="button"
              >
                P-R Curve
              </button>
              <button
                onClick={() => setCurveTab('roc')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  curveTab === 'roc'
                    ? 'bg-[#1E293B] text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                type="button"
              >
                ROC Curve
              </button>
            </div>
          </div>

          {/* SVG Visual */}
          <div className="relative w-full h-56 my-3 flex flex-col justify-end px-1 select-none">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
              <line stroke="#1E293B" strokeWidth="1" x1="0" x2="500" y1="40" y2="40" />
              <line stroke="#1E293B" strokeWidth="1" x1="0" x2="500" y1="80" y2="80" />
              <line stroke="#1E293B" strokeWidth="1" x1="0" x2="500" y1="120" y2="120" />
              <line stroke="#1E293B" strokeWidth="1" x1="0" x2="500" y1="160" y2="160" />

              {/* Baseline curve */}
              <path
                d="M 0 30 Q 140 35, 260 55 T 350 95 T 440 160 T 500 195"
                fill="none"
                stroke="#64748B"
                strokeDasharray="4 3"
                strokeWidth="2"
              />

              {/* Primary SMOTE curve */}
              <path
                d="M 0 14 Q 160 16, 280 32 T 350 56 T 450 130 T 500 195"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="2.5"
              />

              {/* Dynamic Cutoff Indicator */}
              <line
                stroke="#94A3B8"
                strokeDasharray="3 2"
                strokeWidth="1.5"
                x1={threshold * 500}
                x2={threshold * 500}
                y1="0"
                y2="200"
              />
              <circle
                cx={threshold * 500}
                cy="56"
                fill="#06B6D4"
                r="5"
                stroke="#0B111E"
                strokeWidth="2"
              />
            </svg>

            {/* Floating Badge */}
            <div
              className="absolute top-4 bg-[#080E1B] text-white px-3 py-1.5 rounded-md border border-cyan-500/50 shadow-xl font-mono text-[11px] flex items-center gap-2"
              style={{ left: `${Math.min(Math.max(threshold * 100, 20), 75)}%` }}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span>Cutoff: <strong className="text-cyan-400">τ = {threshold}</strong></span>
              <span className="text-slate-600">|</span>
              <span>P: <strong className="text-white">{dynamicPrecision}%</strong></span>
              <span className="text-slate-600">|</span>
              <span>R: <strong className="text-white">{dynamicRecall}%</strong></span>
            </div>
          </div>

          {/* Decision Boundary Slider */}
          <div className="flex flex-col gap-2.5 pt-3 border-t border-[#1E293B]">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-white font-medium">
                  <span className="w-3 h-1 bg-cyan-400 rounded"></span> Random Forest (SMOTE)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-500 border-t border-dashed"></span> Unbalanced Baseline
                </span>
              </div>
              <span className="font-mono text-white px-2 py-0.5 rounded bg-[#0F172A] border border-[#1E293B]">
                PR-AUC: 0.915
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#0F172A] px-3.5 py-2 rounded-lg border border-[#1E293B]">
              <span className="text-xs font-medium text-slate-300 whitespace-nowrap">
                Decision Boundary Slider:
              </span>
              <input
                type="range"
                min="0.10"
                max="0.95"
                step="0.01"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-[#1E293B] rounded-lg cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 bg-[#131D31] rounded border border-[#1E293B]">
                τ = {threshold}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT 40%: Confusion Matrix Breakdown */}
        <div className="lg:col-span-5 bg-[#131D31] border border-[#1E293B] rounded-lg p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
              <div>
                <h2 className="text-sm font-bold text-white">Confusion Matrix Breakdown</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Test cohort split (imbalanced fraud 6.5%)
                </p>
              </div>
              <span className="text-[11px] font-mono bg-[#0F172A] text-slate-300 px-2.5 py-1 rounded border border-[#1E293B] font-semibold">
                N = 2,964
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>True Positives (TP)</span>
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                </div>
                <div className="text-2xl font-bold text-white my-1 font-mono">172</div>
                <div className="text-[10px] text-emerald-300">Detected Fraudulent Cases</div>
              </div>

              <div className="p-3 bg-amber-950/20 border border-amber-500/40 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
                  <span>False Positives (FP)</span>
                  <span className="material-symbols-outlined text-sm">error_outline</span>
                </div>
                <div className="text-2xl font-bold text-white my-1 font-mono">14</div>
                <div className="text-[10px] text-amber-300">False Alarms (Legit Blocked)</div>
              </div>

              <div className="p-3 bg-red-950/20 border border-red-500/40 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-semibold text-red-400">
                  <span>False Negatives (FN)</span>
                  <span className="material-symbols-outlined text-sm">warning</span>
                </div>
                <div className="text-2xl font-bold text-white my-1 font-mono">23</div>
                <div className="text-[10px] text-red-300">Missed Fraud Transactions</div>
              </div>

              <div className="p-3 bg-emerald-950/20 border border-emerald-500/40 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-400">
                  <span>True Negatives (TN)</span>
                  <span className="material-symbols-outlined text-sm">verified</span>
                </div>
                <div className="text-2xl font-bold text-white my-1 font-mono">2,755</div>
                <div className="text-[10px] text-emerald-300">Legitimate Cleared Accurately</div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#0F172A] rounded-lg border border-[#1E293B] flex flex-col gap-1.5">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Validation Summary: Fraud Class Performance
            </div>
            <div className="flex items-center justify-between pt-0.5">
              <div>
                <span className="text-[10px] text-slate-400 block">Precision</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">
                  {dynamicPrecision}%
                </span>
              </div>
              <div className="h-6 w-px bg-[#1E293B]"></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Recall</span>
                <span className="text-sm font-bold text-cyan-400 font-mono">
                  {dynamicRecall}%
                </span>
              </div>
              <div className="h-6 w-px bg-[#1E293B]"></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Specificity</span>
                <span className="text-sm font-bold text-slate-200 font-mono">99.5%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SECTION: Model Lifecycle & Training History */}
      <section className="bg-[#131D31] border border-[#1E293B] rounded-lg p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white">Model Lifecycle & Training History</h2>
            <span className="text-xs text-slate-400 font-mono">FastAPI /models</span>
          </div>
          <span className="text-xs text-slate-400">Total Models: {models.length}</span>
        </div>

        <div className="overflow-x-auto border border-[#1E293B] rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0F172A] h-9 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#1E293B]">
                <th className="px-4 py-2">Model ID & Name</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Precision</th>
                <th className="px-4 py-2 text-right">Recall</th>
                <th className="px-4 py-2 text-right">F1-Score</th>
                <th className="px-4 py-2 text-right">ROC-AUC</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] font-mono">
              {models.map((m) => (
                <tr key={m.model_id} className="hover:bg-[#1A263D]/40 transition-colors">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-cyan-400 text-base">
                        psychology
                      </span>
                      <div>
                        <span className="font-semibold text-white font-sans block">
                          {m.model_name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{m.model_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-sans">
                    <StatusBadge
                      status={m.model_status === 'Active' ? 'active' : 'info'}
                      label={m.model_status}
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right text-white font-semibold">
                    {m.model_precision}%
                  </td>
                  <td className="px-4 py-2.5 text-right text-white font-semibold">
                    {m.model_recall}%
                  </td>
                  <td className="px-4 py-2.5 text-right text-cyan-400 font-semibold">
                    {m.model_f1_score}
                  </td>
                  <td className="px-4 py-2.5 text-right text-white font-semibold">
                    {m.model_roc_auc}
                  </td>
                  <td className="px-4 py-2.5 text-right font-sans">
                    <button
                      onClick={() => handleDeleteModel(m.model_id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-red-900/80 text-slate-400 hover:text-white text-xs transition-colors"
                      title="Delete model from database"
                      type="button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal: Add Model Experiment */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record ML Model Experiment"
        icon="psychology"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateModel} className="space-y-3 text-xs font-sans">
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
              Model ID (Unique)
            </label>
            <input
              type="text"
              required
              value={newModel.model_id}
              onChange={(e) => setNewModel({ ...newModel, model_id: e.target.value })}
              className="w-full h-8 px-2.5 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400 font-mono"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
              Model Name
            </label>
            <input
              type="text"
              required
              value={newModel.model_name}
              onChange={(e) => setNewModel({ ...newModel, model_name: e.target.value })}
              className="w-full h-8 px-2.5 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
                Precision (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={newModel.model_precision}
                onChange={(e) => setNewModel({ ...newModel, model_precision: parseFloat(e.target.value) || 0 })}
                className="w-full h-8 px-2 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
                Recall (%)
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={newModel.model_recall}
                onChange={(e) => setNewModel({ ...newModel, model_recall: parseFloat(e.target.value) || 0 })}
                className="w-full h-8 px-2 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
                F1 Score
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={newModel.model_f1_score}
                onChange={(e) => setNewModel({ ...newModel, model_f1_score: parseFloat(e.target.value) || 0 })}
                className="w-full h-8 px-2 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
                ROC-AUC
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={newModel.model_roc_auc}
                onChange={(e) => setNewModel({ ...newModel, model_roc_auc: parseFloat(e.target.value) || 0 })}
                className="w-full h-8 px-2 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase text-slate-400 block mb-1 font-semibold">
              Status
            </label>
            <select
              value={newModel.model_status}
              onChange={(e) => setNewModel({ ...newModel, model_status: e.target.value })}
              className="w-full h-8 px-2 bg-[#0F172A] border border-[#223049] rounded text-xs text-white focus:border-cyan-400"
            >
              <option value="Active">Active</option>
              <option value="Baseline">Baseline</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-[#1E293B] pt-3 mt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="h-7 px-3 rounded bg-[#0F172A] border border-[#223049] text-slate-300 text-xs hover:bg-[#1A263D] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-7 px-3.5 rounded bg-cyan-500 text-[#041E26] font-semibold text-xs hover:bg-cyan-400 transition-colors"
            >
              Save Model
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ModelHealthPage;
