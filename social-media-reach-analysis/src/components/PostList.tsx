import { useState, useEffect } from 'react';
import { SocialPost, FilterParams, Platform, ContentType } from '../types';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Tv, 
  Youtube, 
  MessageSquare, 
  Heart, 
  Forward, 
  Bookmark, 
  Search, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  CheckCircle,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

interface PostListProps {
  filters: FilterParams;
}

export function PostList({ filters }: PostListProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [sortBy, setSortBy] = useState('timestamp'); // 'timestamp', 'reach', 'engagementRate'
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);
  const limit = 8; // standard limit per page

  useEffect(() => {
    // Reset page on filter/sort changes to prevent out of bounds
    setPage(1);
  }, [filters, search, sortBy, sortOrder]);

  useEffect(() => {
    let active = true;
    async function loadPosts() {
      setLoading(true);
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filters,
            page,
            limit,
            search,
            sortBy,
            sortOrder
          })
        });
        const data = await response.json();
        if (active && data.success) {
          setPosts(data.posts);
          setTotalCount(data.totalCount);
        }
      } catch (e) {
        console.error("Failed to load posts from API", e);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      active = false;
    };
  }, [filters, search, page, sortBy, sortOrder]);

  // Platform Icon Lookup helper
  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="text-pink-600" size={18} />;
      case 'linkedin':
        return <Linkedin className="text-blue-700" size={18} />;
      case 'twitter':
        return <Twitter className="text-slate-800" size={18} />;
      case 'tiktok':
        return <Tv className="text-teal-600" size={18} />;
      case 'youtube':
        return <Youtube className="text-red-600" size={18} />;
      default:
        return <HelpCircle size={18} />;
    }
  };

  // Format rating pill style based on reach values relative to follower count
  const getReachGrade = (post: SocialPost) => {
    const ratio = post.reach / post.followers;
    if (ratio > 0.4) return { label: 'Viral Peak', style: 'bg-emerald-50 text-emerald-700 border border-emerald-100' };
    if (ratio > 0.2) return { label: 'High Impact', style: 'bg-indigo-50 text-indigo-700 border border-indigo-100' };
    if (ratio > 0.1) return { label: 'Steady', style: 'bg-slate-50 text-slate-700 border border-slate-200' };
    return { label: 'Suppressed', style: 'bg-amber-50 text-amber-700 border border-amber-100' };
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const handleNextPage = () => {
    if (page < totalPages) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
      {/* List Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-900">Post database explorer</h2>
          <p className="text-slate-400 text-xs mt-0.5">Explore, search, and sort individual historical reach data logs.</p>
        </div>
        
        {/* Dynamic Controls */}
        <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3 items-stretch sm:items-center">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search captions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
            />
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <ArrowUpDown size={14} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-600 focus:outline-none focus:border-indigo-500"
            >
              <option value="timestamp">Post Date</option>
              <option value="reach">Organic Reach</option>
              <option value="engagementRate">Engagement %</option>
              <option value="impressions">Impressions</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Toggle sort direction"
            >
              {sortOrder === 'asc' ? 'Asc' : 'Desc'}
            </button>
          </div>
        </div>
      </div>

      {/* Database Listing Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-xs text-slate-400 font-semibold font-mono animate-pulse">Running analytical index queries...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate-500 text-sm font-semibold">No posts found</p>
          <p className="text-slate-400 text-xs mt-1">Try relaxing your search terms or filters to reveal records.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {posts.map(post => {
            const grade = getReachGrade(post);
            return (
              <div 
                key={post.id} 
                className="border border-slate-100 rounded-xl p-5 hover:border-slate-200 transition-all flex flex-col justify-between hover:shadow-xs group bg-white"
              >
                {/* Upper row: Platform info, post date, reach index */}
                <div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-center">
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-700 capitalize group-hover:text-indigo-600 transition-colors">
                          {post.platform}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-display ${grade.style}`}>
                      {grade.label}
                    </span>
                  </div>

                  {/* Caption statement */}
                  <p className="text-xs text-slate-600 font-normal line-clamp-3 mt-4 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                    {post.caption}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    <span className="bg-indigo-50/50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-indigo-100/50 uppercase">
                      {post.contentType}
                    </span>
                    <span className="bg-teal-50/50 text-teal-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-teal-100/50 uppercase">
                      {post.category}
                    </span>
                    <span className="bg-slate-50 text-slate-400 text-[10px] font-mono px-2 py-0.5 rounded-md border border-slate-100">
                      Hr {post.postingHour}:00
                    </span>
                  </div>
                </div>

                {/* Engagement / reach metrics row */}
                <div className="border-t border-slate-100/80 mt-4 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Organic Reach</span>
                    <span className="text-sm font-bold font-mono text-slate-900 mt-1 flex items-center gap-1">
                      {post.reach.toLocaleString()}
                      <TrendingUp size={12} className="text-emerald-500" />
                    </span>
                  </div>

                  <div className="flex gap-4 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1" title="Likes / Upvotes">
                      <Heart size={14} className="text-rose-400" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1" title="Comments">
                      <MessageSquare size={14} className="text-blue-400" /> {post.comments}
                    </span>
                    <span className="flex items-center gap-1" title="Shares">
                      <Forward size={14} className="text-indigo-400" /> {post.shares}
                    </span>
                    {post.saves > 0 && (
                      <span className="flex items-center gap-1" title="Saves">
                        <Bookmark size={14} className="text-amber-400" /> {post.saves}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination control footer bar */}
      <div className="flex justify-between items-center border-t border-slate-100 mt-6 pt-5">
        <span className="text-xs text-slate-400 font-semibold font-mono">
          Showing <span className="text-slate-700 font-bold">{(page - 1) * limit + 1}</span> - <span className="text-slate-700 font-bold">{Math.min(page * limit, totalCount)}</span> of <span className="text-slate-700 font-bold">{totalCount}</span> posts
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className={`p-2 border border-slate-200 rounded-lg cursor-pointer ${
              page === 1 
                ? 'opacity-40 cursor-not-allowed text-slate-300' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ChevronLeft size={16} />
          </button>
          
          <span className="text-xs font-bold text-slate-600 font-mono">
            {page} / {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`p-2 border border-slate-200 rounded-lg cursor-pointer ${
              page === totalPages 
                ? 'opacity-40 cursor-not-allowed text-slate-300' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
