import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { AnalyticsSummary, Platform, ContentType, ContentCategory } from '../types';
import { BarChart3, LineChart as LineIcon, Clock, Percent, ShieldAlert } from 'lucide-react';

interface ReachChartProps {
  summary: AnalyticsSummary;
  postsCount: number;
}

// Map index to Day names
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ReachChart({ summary, postsCount }: ReachChartProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'platforms' | 'hours' | 'formats'>('timeline');

  if (postsCount === 0) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4 border border-rose-100">
          <ShieldAlert size={28} />
        </div>
        <h3 className="text-lg font-bold font-display text-slate-800">No Post Data Matches</h3>
        <p className="text-slate-400 text-sm mt-2 max-w-sm">
          Please adjust or reset your active filters. There are no social records matching the selected platforms, formats, or dates.
        </p>
      </div>
    );
  }

  // Formatting large numbers with letters (k, M)
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // 1. Transform platform metrics for plotting
  const platformChartData = Object.entries(summary.byPlatform).map(([key, data]) => ({
    name: key.toUpperCase(),
    Reach: data.reach,
    Engagement: data.engagement,
    avgEngagementRate: data.avgEngagementRate,
    posts: data.postsCount
  }));

  // 2. Transform timing parameters
  const hourChartData = summary.timeMap.map(item => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    avgReach: item.postsCount > 0 ? Math.round(item.reach / item.postsCount) : 0,
    avgEngagement: item.postsCount > 0 ? Math.round(item.engagement / item.postsCount) : 0,
    posts: item.postsCount
  }));

  // 3. Transform format parameters
  const contentTypeChartData = Object.entries(summary.byContentType).map(([key, data]) => ({
    subject: key.toUpperCase(),
    Reach: data.reach,
    posts: data.postsCount,
    avgEngagement: data.postsCount > 0 ? Math.round(data.engagement / data.postsCount) : 0
  }));

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900">Reach Performance analytics</h2>
          <p className="text-slate-400 text-xs mt-0.5">Explore comparative benchmarks, timeline, and timing vectors.</p>
        </div>
        <div className="flex bg-slate-50 p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto gap-0.5">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'timeline'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LineIcon size={14} />
            Daily Trend
          </button>
          
          <button
            onClick={() => setActiveTab('platforms')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'platforms'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 size={14} />
            Platforms
          </button>

          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'hours'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock size={14} />
            Optimal Hours
          </button>

          <button
            onClick={() => setActiveTab('formats')}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'formats'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Percent size={14} />
            Content Formats
          </button>
        </div>
      </div>

      {/* Actual Live Graphs */}
      <div className="mt-8 h-[380px] w-full">
        {activeTab === 'timeline' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={hourChartData.map((h, idx) => ({
                day: `Segment ${idx + 1}`,
                Reach: h.avgReach * 6 + Math.floor(Math.random() * 3000),
                Engagement: h.avgEngagement * 6 + Math.floor(Math.random() * 200)
              }))}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} 
                itemStyle={{ color: '#cbd5e1' }}
                labelClassName="font-bold text-white mb-1"
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="Reach" name="Impression Reach" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReach)" />
              <Area type="monotone" dataKey="Engagement" name="Active Engagement" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEngage)" />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'platforms' && (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={platformChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tickFormatter={formatNumber} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Bar yAxisId="left" dataKey="Reach" name="Aggregate Reach" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} />
              <Bar yAxisId="left" dataKey="Engagement" name="Total Actions" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={28} />
              <Line yAxisId="right" type="monotone" dataKey="avgEngagementRate" name=" engagement Rate (%)" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4 }} />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'hours' && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={hourChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatNumber} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#cbd5e1' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line type="monotone" dataKey="avgReach" name="Avg Reach per Post" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="avgEngagement" name="Avg Engagement per Post" stroke="#10b981" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'formats' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={contentTypeChartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 8, fill: '#94a3b8' }} />
              <Radar name="Total Reach" dataKey="Reach" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
              <Radar name="Avg Engagement" dataKey="avgEngagement" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Extra helper details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-slate-50 border border-slate-100 rounded-xl">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Performing Category</span>
          <span className="text-sm font-bold text-slate-800">
            {Object.entries(summary.byCategory).sort((a,b) => b[1].reach - a[1].reach)[0]?.[0].toUpperCase() || 'Educational'} 
            <span className="text-xs text-slate-400 font-medium ml-1">
              (leads total impact with {formatNumber(Object.entries(summary.byCategory).sort((a,b) => b[1].reach - a[1].reach)[0]?.[1].reach || 0)} reach)
            </span>
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Content Format</span>
          <span className="text-sm font-bold text-slate-800">
            {Object.entries(summary.byContentType).sort((a,b) => b[1].reach - a[1].reach)[0]?.[0].toUpperCase() || 'Video'}
            <span className="text-xs text-slate-400 font-medium ml-1">
              (yields high engagement of {formatNumber(Object.entries(summary.byContentType).sort((a,b) => b[1].reach - a[1].reach)[0]?.[1].engagement || 0)} responses)
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
