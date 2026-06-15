/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  SocialPost, 
  FilterParams, 
  AnalyticsSummary, 
  AIInsightReport,
  Platform,
  ContentType,
  ContentCategory
} from './types';
import { MetricCard } from './components/MetricCard';
import { ReachChart } from './components/ReachChart';
import { PostList } from './components/PostList';
import { ReachPredictor } from './components/ReachPredictor';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  Database, 
  Sparkles, 
  RotateCcw, 
  Filter, 
  TrendingUp, 
  Eye, 
  Heart, 
  Percent,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  FileText
} from 'lucide-react';

const INITIAL_FILTERS: FilterParams = {
  platforms: [],
  contentTypes: [],
  categories: [],
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'predictor' | 'history'>('dashboard');

  // Filter Engine state
  const [filters, setFilters] = useState<FilterParams>(INITIAL_FILTERS);

  // Computed data state
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [postsCount, setPostsCount] = useState(0);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  // Smart AI-Insights state
  const [aiReport, setAiReport] = useState<AIInsightReport | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [isAiSimulated, setIsAiSimulated] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Fetch metrics whenever filters change
  useEffect(() => {
    let active = true;
    async function fetchAnalytics() {
      setLoadingMetrics(true);
      try {
        const response = await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filters })
        });
        const data = await response.json();
        if (active && data.success) {
          setAnalytics(data.summary);
          setPostsCount(data.filteredCount);
          setTotalPostsCount(data.totalCount);
        }
      } catch (err) {
        console.error("Failed to load analytic payload:", err);
      } finally {
        if (active) setLoadingMetrics(false);
      }
    }

    fetchAnalytics();
    
    // Clear the active AI report when filters adjust, prompting user to audit fresh data
    setAiReport(null);
    setAiError(null);

    return () => {
      active = true;
    };
  }, [filters]);

  // Handle singular platform toggles
  const handlePlatformToggle = (platform: Platform) => {
    setFilters(prev => {
      const exist = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exist 
          ? prev.platforms.filter(p => p !== platform) 
          : [...prev.platforms, platform]
      };
    });
  };

  // Handle format tags toggles
  const handleFormatToggle = (type: ContentType) => {
    setFilters(prev => {
      const exist = prev.contentTypes.includes(type);
      return {
        ...prev,
        contentTypes: exist
          ? prev.contentTypes.filter(t => t !== type)
          : [...prev.contentTypes, type]
      };
    });
  };

  // Handle category niches toggles
  const handleCategoryToggle = (cat: ContentCategory) => {
    setFilters(prev => {
      const exist = prev.categories.includes(cat);
      return {
        ...prev,
        categories: exist
          ? prev.categories.filter(c => c !== cat)
          : [...prev.categories, cat]
      };
    });
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Dispatch API Call to retrieve Gemini smart diagnostics
  const handleRunAiAudit = async () => {
    setLoadingAi(true);
    setAiError(null);
    setAiReport(null);

    try {
      const response = await fetch('/api/ai-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filters })
      });
      const data = await response.json();
      if (data.success) {
        setAiReport(data.report);
        setIsAiSimulated(!!data.simulated);
      } else {
        setAiError(data.error || "An unexpected error occurred during AI computation.");
      }
    } catch (err: any) {
      setAiError("Connection timeout. Ensure Gemini variables are configured inside workspace secrets.");
    } finally {
      setLoadingAi(false);
    }
  };

  // UI labels formatting helper
  const getSelectedFiltersCount = () => {
    return filters.platforms.length + filters.contentTypes.length + filters.categories.length;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 🚀 Dark Display Premium Header */}
      <header className="bg-slate-950 text-white py-5 px-6 sm:px-8 border-b border-indigo-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-md">
        {/* Glow backdrop decorative accent */}
        <div className="absolute right-0 top-0 w-80 h-40 bg-gradient-to-l from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-600 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-950 border border-indigo-400/20">
            <TrendingUp size={20} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase font-mono">Data Analytics Project</span>
            <h1 className="text-lg font-bold font-display tracking-tight leading-none text-white mt-0.5">Reach Intelligence Advisor</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-900/60 border border-indigo-950/80 px-4 py-2 rounded-xl text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-slate-400">User: </span>
          <span className="text-indigo-300 font-bold">ratnadipmore2286</span>
        </div>
      </header>

      {/* Main Container Core */}
      <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 🛠️ FILTER ENGINE SIDE PANEL (Left - Col span 3) */}
        <div className="lg:col-span-3 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Filter className="text-slate-400" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Query Filters</h3>
            </div>
            {getSelectedFiltersCount() > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset all search queries and tags"
              >
                <RotateCcw size={10} />
                Reset ({getSelectedFiltersCount()})
              </button>
            )}
          </div>

          {/* Platforms Filter list */}
          <div className="space-y-2.5">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Channels</label>
            <div className="flex flex-col gap-1.5">
              {(['instagram', 'linkedin', 'twitter', 'tiktok', 'youtube'] as Platform[]).map((pf) => {
                const isActive = filters.platforms.includes(pf);
                return (
                  <button
                    key={pf}
                    onClick={() => handlePlatformToggle(pf)}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center justify-between capitalize cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-bold' 
                        : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                    }`}
                  >
                    <span>{pf === 'twitter' ? 'X (Twitter)' : pf}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-transparent'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content form formats */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Content Formats</label>
            <div className="flex flex-wrap gap-1.5">
              {(['text', 'image', 'carousel', 'video', 'link', 'poll'] as ContentType[]).map((ct) => {
                const isActive = filters.contentTypes.includes(ct);
                return (
                  <button
                    key={ct}
                    onClick={() => handleFormatToggle(ct)}
                    className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border uppercase tracking-wider cursor-pointer transition-all ${
                      isActive
                        ? 'bg-teal-50 border-teal-200 text-teal-700 font-extrabold'
                        : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {ct}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category niches */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category Niches</label>
            <div className="flex flex-col gap-1.5">
              {(['educational', 'promotional', 'entertainment', 'bts', 'news'] as ContentCategory[]).map((cat) => {
                const isActive = filters.categories.includes(cat);
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryToggle(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border text-left cursor-pointer transition-all ${
                      isActive
                        ? 'bg-slate-900 border-slate-950 text-white font-bold'
                        : 'bg-slate-50/50 border-slate-100 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {cat === 'bts' ? 'Behind-the-scenes' : cat.toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 font-mono text-center">
            Database seeding size: <span className="text-slate-600 font-bold">{postsCount}</span> / {totalPostsCount} posts matching filters.
          </div>
        </div>

        {/* 💻 MAIN WORKSPACE PANEL (Right - Col span 9) */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Dashboard Module Nav bar */}
          <div className="flex bg-slate-200/60 p-1 rounded-2xl border border-slate-200 w-max self-stretch sm:self-auto flex-wrap mb-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutDashboard size={14} />
              Performance Dashboard
            </button>

            <button
              onClick={() => setActiveTab('predictor')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                activeTab === 'predictor'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BrainCircuit size={14} />
              AI Draft Optimizer
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition-all ${
                activeTab === 'history'
                  ? 'bg-white text-slate-950 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Database size={14} />
              Historical Database
            </button>
          </div>

          {/* Tab Content Router */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 1. Quick telemetry cards */}
                {loadingMetrics ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="bg-white border border-slate-100 rounded-2xl p-6 h-32" />
                    ))}
                  </div>
                ) : analytics ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard
                      id="card_reach"
                      title="Estimated organic reach"
                      value={analytics.totalReach.toLocaleString()}
                      changeValue="+14.6%"
                      changeType="positive"
                      icon={<TrendingUp size={16} />}
                      subtitle="vs baseline target"
                    />
                    <MetricCard
                      id="card_impressions"
                      title="Total Impressions"
                      value={analytics.totalImpressions.toLocaleString()}
                      changeValue="+12.2%"
                      changeType="positive"
                      icon={<Eye size={16} />}
                      subtitle="Gross content loads"
                    />
                    <MetricCard
                      id="card_engagement"
                      title="Engagement actions"
                      value={analytics.totalEngagement.toLocaleString()}
                      changeValue="+8.3%"
                      changeType="positive"
                      icon={<Heart size={16} />}
                      subtitle="Likes, shares, clicks"
                    />
                    <MetricCard
                      id="card_rate"
                      title="Avg Engagement Rate"
                      value={`${analytics.avgEngagementRate}%`}
                      changeValue="-0.4%"
                      changeType="negative"
                      icon={<Percent size={16} />}
                      subtitle="Interaction depth ratio"
                    />
                  </div>
                ) : null}

                {/* 2. Charts and reports dual row */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Large visual charts (XL: 8 cols) */}
                  <div className="xl:col-span-8">
                    {analytics && (
                      <ReachChart summary={analytics} postsCount={postsCount} />
                    )}
                  </div>

                  {/* AI smart insights audit card (XL: 4 cols) */}
                  <div className="xl:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-1.5 text-indigo-600">
                        <Sparkles size={16} className="animate-spin" style={{ animationDuration: '6s' }} />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800">Gemini Strategy report</h3>
                      </div>
                      <span className="text-[9px] font-mono font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-md">
                        AI Powered
                      </span>
                    </div>

                    {!aiReport && !loadingAi && (
                      <div className="text-center py-6">
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Analyze content trends for the active filtered set. Our models evaluate platforms and hours dynamically.
                        </p>
                        <button
                          onClick={handleRunAiAudit}
                          disabled={postsCount === 0}
                          className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            postsCount === 0
                              ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                              : 'bg-slate-900 border-slate-950 text-white hover:bg-slate-800 shadow-sm'
                          }`}
                        >
                          <BrainCircuit size={14} />
                          Generate Audit Insights
                        </button>
                      </div>
                    )}

                    {loadingAi && (
                      <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <div className="w-8 h-8 border-3 border-indigo-150 border-t-indigo-600 rounded-full animate-spin" />
                        <span className="text-[10px] text-slate-400 font-mono font-bold animate-pulse">Running Gemini content critiques...</span>
                      </div>
                    )}

                    {aiError && (
                      <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2 text-xs text-rose-700">
                        <AlertTriangle className="shrink-0 mt-0.5" size={14} />
                        <div>
                          <span className="font-bold">Execution Warning:</span> {aiError}
                        </div>
                      </div>
                    )}

                    {aiReport && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                      >
                        {/* Executive Diagnostic paragraph */}
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Executive Summary</span>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-lg border border-slate-100/60">
                            {aiReport.executiveSummary}
                          </p>
                        </div>

                        {/* Top Strengths bullet items */}
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1">Top observations</span>
                          <ul className="space-y-1">
                            {aiReport.keyStrengths.slice(0, 3).map((str, i) => (
                              <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5 leading-relaxed font-semibold">
                                <span className="text-indigo-500 mt-0.5">✦</span> {str}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key recommended actions */}
                        <div className="border-t border-slate-100 pt-4">
                          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase block mb-1.5">Action Plan</span>
                          <div className="space-y-2">
                            {aiReport.recommendedActions.slice(0, 2).map((act, i) => (
                              <div key={i} className="flex gap-2 items-start text-xs font-semibold text-slate-700">
                                <div className="h-5 w-5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-md font-mono flex items-center justify-center shrink-0">
                                  {i + 1}
                                </div>
                                <span className="leading-snug pt-0.5">{act}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Rerun helper */}
                        <button
                          onClick={handleRunAiAudit}
                          className="w-full text-center text-[10px] text-indigo-600 hover:text-indigo-800 font-bold transition-colors mt-2 uppercase tracking-wider block border border-slate-100 py-1 rounded-md"
                        >
                          Refresh Audit Report
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'predictor' && (
              <motion.div
                key="predictor"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <ReachPredictor />
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <PostList filters={filters} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* Aesthetic humbler system footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono">
            Social Media Reach Analysis Dashboard — AI Studio Workspace 2026
          </span>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 transition-colors">Analytical Engine V1.4</span>
            <span className="text-slate-300">|</span>
            <span className="hover:text-slate-600 transition-colors">Server-Side Gemini 3.5</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
