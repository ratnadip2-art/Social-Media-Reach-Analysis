import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  changeValue?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
  subtitle?: string;
}

export function MetricCard({
  id,
  title,
  value,
  changeValue,
  changeType = 'positive',
  icon,
  subtitle
}: MetricCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)' }}
      className="bg-white border border-slate-100 rounded-2xl p-6 relative overflow-hidden transition-all"
    >
      <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-br from-indigo-50/20 to-transparent rounded-full -mr-6 -mt-6" />
      
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider uppercase">{title}</span>
          <h3 className="text-2xl font-bold font-display text-slate-900 mt-2 font-mono">{value}</h3>
        </div>
        <div className="p-3 bg-slate-50 text-indigo-600 rounded-xl border border-slate-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {changeValue ? (
          <div className="flex items-center gap-1.5">
            <span className={`px-2.5 py-1 rounded-full font-semibold font-mono ${
              changeType === 'positive' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : changeType === 'negative'
                ? 'bg-rose-50 text-rose-700 border border-rose-100'
                : 'bg-slate-100 text-slate-600 border border-slate-200'
            }`}>
              {changeType === 'positive' ? '↑' : changeType === 'negative' ? '↓' : '•'} {changeValue}
            </span>
            <span className="text-slate-400 font-medium">{subtitle || 'vs last period'}</span>
          </div>
        ) : (
          <span className="text-slate-400 font-medium">{subtitle || 'Aggregate overall data'}</span>
        )}
      </div>
    </motion.div>
  );
}
