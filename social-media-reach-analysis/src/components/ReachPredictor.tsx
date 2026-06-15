import { useState, FormEvent } from 'react';
import { Platform, ContentType, ContentCategory, PredictionResult } from '../types';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  Calendar, 
  HelpCircle, 
  AlertTriangle,
  FileText,
  ThumbsUp,
  BrainCircuit,
  Maximize2
} from 'lucide-react';
import { motion } from 'motion/react';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ReachPredictor() {
  // Input parameters state
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [contentType, setContentType] = useState<ContentType>('text');
  const [category, setCategory] = useState<ContentCategory>('educational');
  const [scheduledHour, setScheduledHour] = useState(10); // 10:00 AM
  const [scheduledDay, setScheduledDay] = useState(2); // Tuesday
  const [rawHashtags, setRawHashtags] = useState('');

  // Results state
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [copyIndex, setCopyIndex] = useState<number | null>(null);
  const [copyOriginal, setCopyOriginal] = useState(false);

  // Auto-adjust content formats to match platforms logically
  const handlePlatformChange = (pf: Platform) => {
    setPlatform(pf);
    if (pf === 'tiktok' || pf === 'youtube') {
      setContentType('video');
    } else if (pf === 'instagram') {
      setContentType('carousel');
    } else {
      setContentType('text');
    }
  };

  const handlePredict = async (e: FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;

    setLoading(true);
    setResult(null);

    // Process hashtags
    const hashtags = rawHashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

    try {
      const response = await fetch('/api/ai-predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          contentType,
          category,
          caption,
          scheduledHour,
          scheduledDay,
          hashtags
        })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.result);
        setIsSimulated(!!data.simulated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopyIndex(index);
    setTimeout(() => setCopyIndex(null), 2000);
  };

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(caption);
    setCopyOriginal(true);
    setTimeout(() => setCopyOriginal(false), 2000);
  };

  // Color grade based on estimated score
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Draft Parameters form (Left) */}
      <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
          <BrainCircuit className="text-indigo-600" size={20} />
          <div>
            <h2 className="text-md font-bold font-display text-slate-900">AI Draft Predictor & Optimizer</h2>
            <p className="text-slate-400 text-xs">Run draft evaluations and gather layout updates using Gemini.</p>
          </div>
        </div>

        <form onSubmit={handlePredict} className="space-y-4">
          {/* Target social platform */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Target Social Channel</label>
            <div className="grid grid-cols-5 gap-1.5">
              {(['instagram', 'linkedin', 'twitter', 'tiktok', 'youtube'] as Platform[]).map((pf) => (
                <button
                  key={pf}
                  type="button"
                  onClick={() => handlePlatformChange(pf)}
                  className={`py-2 text-[10px] font-bold rounded-xl border capitalize transition-all cursor-pointer ${
                    platform === pf 
                      ? 'bg-slate-900 text-white border-slate-950 shadow-sm' 
                      : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {pf === 'twitter' ? 'X' : pf}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Format specifier */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Content Format</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as ContentType)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500"
              >
                <option value="text">Long-form Text</option>
                <option value="image">Single Image</option>
                <option value="carousel">Carousel Album</option>
                <option value="video">Short-form Video</option>
                <option value="link">Interactive Link</option>
                <option value="poll">Live Audience Poll</option>
              </select>
            </div>

            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category niche</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ContentCategory)}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500"
              >
                <option value="educational">Educational / Guide</option>
                <option value="promotional">Promotional Announcement</option>
                <option value="entertainment">Entertainment / Meme</option>
                <option value="bts">Behind-The-Scenes</option>
                <option value="news">Breaking Tech News</option>
              </select>
            </div>
          </div>

          {/* Draft text */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Draft Caption Content</label>
              <span className="text-[10px] text-slate-400 font-mono font-bold">{caption.length} chars</span>
            </div>
            <textarea
              required
              rows={5}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Paste your potential caption draft here... include hooks, explanations, or calls to action."
              className="w-full p-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none leading-relaxed transition-all"
            />
          </div>

          {/* Hashtags input */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Hashtags (Comma separated)</label>
            <input
              type="text"
              placeholder="e.g. Growth, AI, Techtrends"
              value={rawHashtags}
              onChange={(e) => setRawHashtags(e.target.value)}
              className="w-full px-4 py-2.5 text-xs font-medium text-slate-700 placeholder:text-slate-400 border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
            />
          </div>

          {/* Scheduled post time parameters */}
          <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-2">Scheduling Targets</span>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                  <Clock size={12} /> Target Hour
                </label>
                <select
                  value={scheduledHour}
                  onChange={(e) => setScheduledHour(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 focus:outline-none"
                >
                  {HOURS.map(h => (
                    <option key={h} value={h}>
                      {h === 0 ? '12:00 AM midnight' : h === 12 ? '12:00 PM noon' : h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                  <Calendar size={12} /> Target Day
                </label>
                <select
                  value={scheduledDay}
                  onChange={(e) => setScheduledDay(parseInt(e.target.value, 10))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-600 focus:outline-none"
                >
                  {DAYS.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Analysis submit button */}
          <button
            type="submit"
            disabled={loading || !caption.trim()}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
              loading || !caption.trim()
                ? 'bg-slate-100 text-slate-300 border-none cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Synthesizing post dynamics...
              </>
            ) : (
              <>
                <Sparkles size={14} className="animate-pulse" />
                Evaluate and Optimize reach
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results screen (Right) */}
      <div className="lg:col-span-7">
        {!result && !loading && (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center min-h-[460px]">
            <Sparkles className="text-slate-300 mb-4 animate-bounce" size={40} />
            <h3 className="text-md font-bold font-display text-slate-700">Awaiting Post Evaluation</h3>
            <p className="text-slate-400 text-xs mt-2 max-w-sm leading-relaxed mx-auto">
              Draft your upcoming post caption on the left side, assign schedule targets, and click evaluate. 
              The server will execute machine cognitive checks to predict reach and optimize format layouts.
            </p>
          </div>
        )}

        {loading && (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm h-full flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-50 overflow-hidden">
              <div className="h-full bg-indigo-600 rounded animate-infinite-loading" style={{ width: '40%' }} />
            </div>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              className="text-indigo-600 mb-4"
            >
              <BrainCircuit size={48} />
            </motion.div>
            <h3 className="text-md font-bold font-display text-slate-800 animate-pulse">Running advanced reach projections</h3>
            <p className="text-slate-400 text-xs mt-2 max-w-sm text-center leading-relaxed font-semibold">
              Analyzing lexical sentiment patterns, checking optimal time alignment grids, benchmarking hastags, and prompting Gemini to prepare rewrite variants...
            </p>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Top overview card metrics */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-md font-bold font-display text-slate-900">Reach analysis report</h2>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      {isSimulated ? 'Local Diagnostics Engine' : 'Groud Link: Gemini 3.5'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">Optimized recommendations structured specifically for your stats.</p>
                </div>
                {/* Score badge */}
                <div className={`px-4 py-3 rounded-2xl border text-center ${getScoreColorClass(result.score)}`}>
                  <div className="text-2xl font-black font-display font-mono">{result.score}</div>
                  <div className="text-[9px] font-bold uppercase tracking-widest">Quality score</div>
                </div>
              </div>

              {/* Min - Exp - Max Reach display */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Min Organic Reach</span>
                  <span className="text-sm font-bold font-mono text-slate-800 mt-1.5 block">{result.predictedReach.low.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Safe baseline</span>
                </div>
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-xl p-3.5 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Expected Reach</span>
                  <span className="text-md font-extrabold font-mono text-indigo-700 mt-1 block">{result.predictedReach.expected.toLocaleString()}</span>
                  <span className="text-[9px] text-indigo-400 block mt-0.5 font-bold">Standard estimate</span>
                </div>
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5 text-center font-semibold">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Viral Potential</span>
                  <span className="text-sm font-bold font-mono text-emerald-700 mt-1.5 block">+{result.predictedReach.high.toLocaleString()}</span>
                  <span className="text-[9px] text-emerald-400 block mt-0.5 font-medium">Spike potential</span>
                </div>
              </div>

              {/* Side facts */}
              <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-100 pt-5">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected Engagement Rate</span>
                  <span className="text-base font-bold font-mono text-slate-800 mt-1 block">{result.predictedEngagementRate}%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Caption Hook Grade</span>
                  <span className="text-sm font-extrabold text-indigo-600 mt-1 block">{result.analysis.hookQuality}</span>
                </div>
              </div>
            </div>

            {/* Critique checklist */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 mb-4">Strategic critique</h3>
              
              <div className="space-y-4">
                {/* Strengths list */}
                <div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block mb-1">Key Strengths</span>
                  <ul className="space-y-1.5">
                    {result.analysis.strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500 mt-0.5 font-bold">✓</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses list */}
                {result.analysis.weaknesses.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider block mb-1">Items to Optimize</span>
                    <ul className="space-y-1.5">
                      {result.analysis.weaknesses.map((weak, idx) => (
                        <li key={idx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                          <span className="text-rose-400 mt-0.5">⚠️</span> {weak}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Timing Critique */}
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1 bg-white px-2 py-0.5 rounded-md w-max border border-slate-100">
                    <Clock size={12} className="text-indigo-600" /> Optimal schedule review
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {result.analysis.optimalTimeAnalysis}
                  </p>
                </div>
              </div>
            </div>

            {/* AI optimized rewrite options */}
            <div className="bg-slate-900 border border-slate-950 rounded-2xl p-6 shadow-md text-white">
              <div className="flex items-center gap-2 pb-3 border-b border-indigo-950 mb-5">
                <Sparkles className="text-indigo-400 animate-pulse" size={18} />
                <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Gemini Optimized Layout Variations</h3>
              </div>

              <div className="space-y-5">
                {result.optimizedVariants.map((v, idx) => (
                  <div key={idx} className="bg-slate-950 border border-indigo-950 rounded-xl p-4 relative group">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">{v.title}</span>
                        <p className="text-[10px] text-slate-400 italic mt-1">{v.justification}</p>
                      </div>
                      
                      {/* Interactive Copy action */}
                      <button
                        onClick={() => handleCopyToClipboard(v.caption, idx)}
                        className={`p-2 rounded-lg cursor-pointer border transition-all ${
                          copyIndex === idx
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-750'
                        }`}
                        title="Copy to clipboard"
                      >
                        {copyIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>

                    <div className="mt-4 bg-[#050811] p-3 rounded-lg border border-indigo-990 font-mono text-[11px] whitespace-pre-wrap text-slate-300 leading-relaxed overflow-x-auto select-all">
                      {v.caption}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {v.suggestedHashtags.map((tag, tIdx) => (
                        <span key={tIdx} className="text-indigo-400/80 font-semibold font-mono text-[10px]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Copy Original button */}
              <div className="mt-5 border-t border-indigo-950/50 pt-4 flex justify-between items-center text-xs text-slate-400">
                <span>Want to keep your original?</span>
                <button
                  onClick={handleCopyOriginal}
                  className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  {copyOriginal ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copyOriginal ? 'Copied Original!' : 'Copy original draft'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
