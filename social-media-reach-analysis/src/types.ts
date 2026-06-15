/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Platform = 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';
export type ContentType = 'video' | 'image' | 'text' | 'carousel' | 'link' | 'poll';
export type ContentCategory = 'educational' | 'promotional' | 'entertainment' | 'bts' | 'news';

export interface SocialPost {
  id: string;
  platform: Platform;
  timestamp: string; // ISO date
  contentType: ContentType;
  category: ContentCategory;
  caption: string;
  followers: number;
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  engagementRate: number; // calculated: ((likes+comments+shares+saves)/reach) * 100
  postingHour: number; // 0 - 23
  postingDay: number; // 0 (Sunday) to 6 (Saturday)
  hashtags: string[];
}

export interface AnalyticsSummary {
  totalReach: number;
  totalImpressions: number;
  totalEngagement: number;
  avgEngagementRate: number;
  byPlatform: Record<Platform, {
    reach: number;
    impressions: number;
    engagement: number;
    postsCount: number;
    avgEngagementRate: number;
  }>;
  byContentType: Record<ContentType, {
    reach: number;
    postsCount: number;
    engagement: number;
  }>;
  byCategory: Record<ContentCategory, {
    reach: number;
    postsCount: number;
    engagement: number;
  }>;
  timeMap: Array<{ hour: number; reach: number; postsCount: number; engagement: number }>;
  dayMap: Array<{ day: number; reach: number; postsCount: number; engagement: number }>;
}

export interface FilterParams {
  platforms: Platform[];
  contentTypes: ContentType[];
  categories: ContentCategory[];
  startDate?: string;
  endDate?: string;
}

export interface PredictionRequest {
  platform: Platform;
  contentType: ContentType;
  category: ContentCategory;
  caption: string;
  scheduledHour: number;
  scheduledDay: number;
  hashtags: string[];
}

export interface PredictionResult {
  score: number; // 1-100 quality score
  predictedReach: {
    low: number;
    expected: number;
    high: number;
  };
  predictedEngagementRate: number;
  analysis: {
    strengths: string[];
    weaknesses: string[];
    hookQuality: 'Excellent' | 'Good' | 'Average' | 'Poor';
    optimalTimeAnalysis: string;
    readabilityScore: number; // 0-100 Flesch-like/simulated
  };
  optimizedVariants: Array<{
    title: string;
    caption: string;
    suggestedHashtags: string[];
    justification: string;
  }>;
  hashtagPerformance: Array<{ tag: string; sentimentImpact: 'high' | 'medium' | 'low'; reachMultiplier: number }>;
}

export interface AIInsightReport {
  executiveSummary: string;
  keyStrengths: string[];
  growthOpportunities: string[];
  optimalPostingStrategy: {
    platformRecommendedTime: Record<Platform, string>;
    contentTypeWinner: string;
    categoryWinner: string;
  };
  recommendedActions: string[];
}
