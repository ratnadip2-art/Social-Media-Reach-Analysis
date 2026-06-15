/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SocialPost, Platform, ContentType, ContentCategory, AnalyticsSummary } from './types';

// Constants for generation
const PLATFORMS: Platform[] = ['instagram', 'linkedin', 'twitter', 'tiktok', 'youtube'];
const CATEGORIES: ContentCategory[] = ['educational', 'promotional', 'entertainment', 'bts', 'news'];

const CAPTIONS_BY_CATEGORY: Record<ContentCategory, string[]> = {
  educational: [
    "Here are 5 secret productivity hacks that saved me 10 hours this week! Let me know which one you'll try first. #Productivity #Workflow #Tech",
    "Demystifying Neural Networks in 3 simple steps: 1. Weights, 2. Biases, 3. Backpropagation. Swipe to read! #AI #MachineLearning #DeepLearning",
    "How to build a SaaS startup from scratch in 2026. Spoiler alert: You don't need a million dollars. #SaaS #Startup #Coding #Strategy",
    "Understanding the new algorithm changes and what they mean for your content reach. Save this for your team! #Marketing #Creators #SocialMedia",
    "Did you know that 87% of developers struggle with database scaling? Here's the ultimate guide to sharding. #SoftwareEngineering #Databases #Guide"
  ],
  promotional: [
    "🚀 OUR SUMMER SALE IS LIVE! Get 50% off all courses starting today. Use code SUMMERSALE at checkout! #Sale #Elearning #SkillUp",
    "Announcing our new feature: Live Analytics! Now track your reach in real-time with sub-second accuracy. Try it free. #Launch #Analytics #SaaS",
    "Looking to level up your UI/UX skills? Reserve your spot in our live bootcamp starting next Monday. Seats are limited! #UIUX #Design #Bootcamp",
    "Read how ratnadipmore2286 grew their brand reach by 300% using our analytics platform in just 30 days! Case study in bio. #GrowthMarketing #Success",
    "The perfect social media tool doesn't exi... check our link in bio and discover how we automate smart suggestions! #Automation #AI #TechLaunch"
  ],
  entertainment: [
    "When you push to production right before leaving for the weekend... 💀 Let's hope the server holds! #DevJoke #CodingMeme #ProductionReady",
    "Reviewing the absolute worst presentation formats of all time. Comic Sans is back, and it's personal. #DesignHumor #OfficeLife #Creative",
    "An interactive visual puzzle: Can you spot the bug in this 10-line block of recursive code? Let's see your guesses below. #CodingQuiz #Fun",
    "Rating different social media strategies purely based on how chaotic they are. TikTok holds the top spot easily! #MarketingChaos #SocialTheory",
    "My setup evolution: From a broken kitchen chair to a dual-curved gaming fortress. Is this peak productivity or distraction? #DeskSetup #TechWander"
  ],
  bts: [
    "A rare sneak peek behind the scenes of our engineering sprint. Coffee index levels are through the roof. ☕️🚀 #StartupLife #BehindTheScenes #Agile",
    "Designing our brand identity: Here are the sketches that didn't make the cut. Do you think we picked the right color? #BrandIdentity #DesignSystem",
    "How we recorded our season finale podcast episode. From broken mics to laughing fits. Full vlog drops tomorrow! #PodcastLife #BTS #BehindTheMic",
    "Meet the developers who actually maintain our cloud clusters! Here is what a typical Monday fire looks like. #MeetTheTeam #SRE #CloudEngineering",
    "Fulfilling the first 1,000 custom merchandise orders by hand in our living room. Tired but incredibly grateful! #StartupJourney #BehindTheScenes"
  ],
  news: [
    "BREAKING: Major framework updates announced today! Significant compile-time performance boosts and native type safety edits. #WebDev #TechNews",
    "The state of AI in 2026: Generative models are moving completely local. Is your smartphone ready for a 15B parameter model? #TechTrends #LocalAI",
    "Google Search algorithms get another massive refresh focusing on authentic human-authored articles. Here is what changes. #SEO #GoogleTrends",
    "Global internet latency sets a new all-time low following the deployment of next-gen subsea fiber optics. #Networking #TechUpdate",
    "Freelance digital design rates spike 40% globally in early 2026 reports. The creator economy is expanding rapidly. #CreatorEconomy #GigWork"
  ]
};

const COMMON_HASHTAGS = [
  '#SocialMedia', '#Marketing', '#DataScience', '#AI', '#Tech2026', '#Programming',
  '#Startup', '#Productivity', '#ContentCreator', '#Analytics', '#GrowthHacking',
  '#Coding', '#WebDev', '#Strategy', '#Design', '#BusinessGrowth', '#Engagement'
];

export function generateMockPosts(seedCount = 180): SocialPost[] {
  const posts: SocialPost[] = [];
  const baseDate = new Date();
  
  // Base parameters representing a growing user account over 180 days
  let currentFollowers = 12000;

  for (let i = seedCount - 1; i >= 0; i--) {
    const postDate = new Date(baseDate.getTime() - i * 24 * 60 * 60 * 1000);
    // Slightly randomize time of posting
    const postingHour = Math.floor(Math.random() * 24);
    const postingDay = postDate.getDay();
    
    // Gradual follower growth of 20-100 per day
    currentFollowers += Math.floor(Math.random() * 80) + 20;

    // Select platform and suitable content type
    const platform = PLATFORMS[Math.floor(Math.random() * PLATFORMS.length)];
    
    // Platform-specific content type alignment
    let contentType: ContentType = 'text';
    const rand = Math.random();
    if (platform === 'tiktok') {
      contentType = 'video'; // TikTok is almost always video
    } else if (platform === 'youtube') {
      contentType = 'video'; // YouTube is mostly video
    } else if (platform === 'instagram') {
      contentType = rand < 0.4 ? 'carousel' : rand < 0.85 ? 'video' : 'image';
    } else if (platform === 'linkedin') {
      contentType = rand < 0.3 ? 'text' : rand < 0.6 ? 'image' : rand < 0.8 ? 'link' : 'poll';
    } else { // Twitter/X
      contentType = rand < 0.5 ? 'text' : rand < 0.8 ? 'image' : 'poll';
    }

    // Select category and caption
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const captionsList = CAPTIONS_BY_CATEGORY[category];
    const baseCaption = captionsList[Math.floor(Math.random() * captionsList.length)];
    
    // Personalize caption slightly to avoid duplicate string keys
    const caption = `${baseCaption} (Update #${seedCount - i} from ${postDate.toLocaleDateString()})`;

    // Extract hashtags from caption or generate them
    const hashtagMatches = caption.match(/#[A-Za-z0-9]+/g);
    const hashtags = hashtagMatches ? hashtagMatches.map(tag => tag) : ['#SocialMedia', '#Analytics'];

    // Platform-specific performance multipliers
    let followerReachRatio = 0.15; // standard reach is 15% of followers
    let viralityMultiplier = 1;

    // Normalizing optimal timing (Midday 11-14h and evening 18-21h perform better)
    if ((postingHour >= 11 && postingHour <= 14) || (postingHour >= 18 && postingHour <= 21)) {
      viralityMultiplier *= 1.35;
    }

    // Weekend (Saturday, Sunday) behaves differently based on platform
    if (postingDay === 0 || postingDay === 6) {
      if (platform === 'tiktok' || platform === 'instagram' || platform === 'youtube') {
        viralityMultiplier *= 1.25; // weekend high traffic for leisure platforms
      } else {
        viralityMultiplier *= 0.6; // weekend drop for professional platforms (LinkedIn)
      }
    } else {
      if (platform === 'linkedin') {
        viralityMultiplier *= 1.4; // Mid-week peak for LinkedIn
      }
    }

    // Content Type influences reach/virality
    if (contentType === 'video') {
      viralityMultiplier *= 1.5; // Video algorithms push content higher
    } else if (contentType === 'carousel') {
      viralityMultiplier *= 1.3; // Carousel retains eyeballs
    } else if (contentType === 'link') {
      viralityMultiplier *= 0.6; // Platforms hate external links
    }

    // Category influences reach
    if (category === 'educational') {
      viralityMultiplier *= 1.2;
    } else if (category === 'promotional') {
      viralityMultiplier *= 0.75; // Commercial content gets suppressed slightly
    } else if (category === 'entertainment') {
      viralityMultiplier *= 1.3;
    }

    // Random noise factor for natural-looking peaks
    const noise = 0.7 + Math.random() * 0.8; // between 0.7 and 1.5
    viralityMultiplier *= noise;

    // Giant breakout spikes (simulating occasional viral hits)
    if (Math.random() > 0.96) {
      viralityMultiplier *= 3.5;
    }

    // Main Calculations
    const followers = currentFollowers;
    const reach = Math.floor(followers * followerReachRatio * viralityMultiplier);
    const impressions = Math.floor(reach * (1.1 + Math.random() * 0.4)); // slightly more impressions than reach

    // Platform-specific engagement rate coefficients
    let engagementCoeff = 0.04; // 4% baseline engagement per reached user
    if (platform === 'tiktok') engagementCoeff = 0.08;
    if (platform === 'instagram') engagementCoeff = 0.055;
    if (platform === 'linkedin') engagementCoeff = 0.06;
    if (platform === 'twitter') engagementCoeff = 0.03;
    if (platform === 'youtube') engagementCoeff = 0.045;

    // Aggregate engagement
    const totalEngagements = Math.floor(reach * engagementCoeff * (0.8 + Math.random() * 0.4));
    
    // Segment engagements realistically based on platform types
    let likes = 0, comments = 0, shares = 0, saves = 0, clicks = 0;
    
    if (platform === 'instagram') {
      likes = Math.floor(totalEngagements * 0.7);
      comments = Math.floor(totalEngagements * 0.08);
      saves = Math.floor(totalEngagements * 0.15);
      shares = Math.floor(totalEngagements * 0.07);
    } else if (platform === 'tiktok') {
      likes = Math.floor(totalEngagements * 0.75);
      comments = Math.floor(totalEngagements * 0.12);
      shares = Math.floor(totalEngagements * 0.1);
      saves = Math.floor(totalEngagements * 0.03);
    } else if (platform === 'linkedin') {
      likes = Math.floor(totalEngagements * 0.55); // "Reactions"
      comments = Math.floor(totalEngagements * 0.2);
      shares = Math.floor(totalEngagements * 0.15); // "Reposts"
      clicks = Math.floor(totalEngagements * 0.1);
    } else if (platform === 'twitter') {
      likes = Math.floor(totalEngagements * 0.5);
      shares = Math.floor(totalEngagements * 0.25); // "Retweets"
      comments = Math.floor(totalEngagements * 0.1);
      clicks = Math.floor(totalEngagements * 0.15);
    } else if (platform === 'youtube') {
      likes = Math.floor(totalEngagements * 0.65);
      comments = Math.floor(totalEngagements * 0.15);
      shares = Math.floor(totalEngagements * 0.08);
      clicks = Math.floor(totalEngagements * 0.12); // video card clicks
    }

    // Engagement score validation
    const engagementSum = likes + comments + shares + saves + clicks;
    const engagementRate = reach > 0 ? (engagementSum / reach) * 100 : 0;

    posts.push({
      id: `post_${seedCount - i}`,
      platform,
      timestamp: postDate.toISOString(),
      contentType,
      category,
      caption,
      followers,
      impressions,
      reach,
      likes,
      comments,
      shares,
      saves,
      clicks,
      engagementRate: parseFloat(engagementRate.toFixed(2)),
      postingHour,
      postingDay,
      hashtags
    });
  }

  return posts;
}

export function computeAnalyticsSummary(posts: SocialPost[]): AnalyticsSummary {
  let totalReach = 0;
  let totalImpressions = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalShares = 0;
  let totalSaves = 0;
  let totalClicks = 0;

  // Structure variables
  const pfData: Record<Platform, { reach: number; impressions: number; esc: number; postsCount: number }> = {
    instagram: { reach: 0, impressions: 0, esc: 0, postsCount: 0 },
    linkedin: { reach: 0, impressions: 0, esc: 0, postsCount: 0 },
    twitter: { reach: 0, impressions: 0, esc: 0, postsCount: 0 },
    tiktok: { reach: 0, impressions: 0, esc: 0, postsCount: 0 },
    youtube: { reach: 0, impressions: 0, esc: 0, postsCount: 0 },
  };

  const ctData: Record<ContentType, { reach: number; postsCount: number; esc: number }> = {
    video: { reach: 0, postsCount: 0, esc: 0 },
    image: { reach: 0, postsCount: 0, esc: 0 },
    text: { reach: 0, postsCount: 0, esc: 0 },
    carousel: { reach: 0, postsCount: 0, esc: 0 },
    link: { reach: 0, postsCount: 0, esc: 0 },
    poll: { reach: 0, postsCount: 0, esc: 0 },
  };

  const catData: Record<ContentCategory, { reach: number; postsCount: number; esc: number }> = {
    educational: { reach: 0, postsCount: 0, esc: 0 },
    promotional: { reach: 0, postsCount: 0, esc: 0 },
    entertainment: { reach: 0, postsCount: 0, esc: 0 },
    bts: { reach: 0, postsCount: 0, esc: 0 },
    news: { reach: 0, postsCount: 0, esc: 0 },
  };

  // Hour map init 0..23
  const hourData = Array.from({ length: 24 }, (_, hour) => ({ hour, reach: 0, postsCount: 0, esc: 0 }));
  // Day map init 0..6
  const dayData = Array.from({ length: 7 }, (_, day) => ({ day, reach: 0, postsCount: 0, esc: 0 }));

  posts.forEach(post => {
    totalReach += post.reach;
    totalImpressions += post.impressions;
    
    const postEngagementSum = post.likes + post.comments + post.shares + post.saves + post.clicks;
    totalLikes += post.likes;
    totalComments += post.comments;
    totalShares += post.shares;
    totalSaves += post.saves;
    totalClicks += post.clicks;

    // Platform
    pfData[post.platform].reach += post.reach;
    pfData[post.platform].impressions += post.impressions;
    pfData[post.platform].esc += postEngagementSum;
    pfData[post.platform].postsCount += 1;

    // ContentType
    ctData[post.contentType].reach += post.reach;
    ctData[post.contentType].postsCount += 1;
    ctData[post.contentType].esc += postEngagementSum;

    // Category
    catData[post.category].reach += post.reach;
    catData[post.category].postsCount += 1;
    catData[post.category].esc += postEngagementSum;

    // Hours
    hourData[post.postingHour].reach += post.reach;
    hourData[post.postingHour].postsCount += 1;
    hourData[post.postingHour].esc += postEngagementSum;

    // Days
    dayData[post.postingDay].reach += post.reach;
    dayData[post.postingDay].postsCount += 1;
    dayData[post.postingDay].esc += postEngagementSum;
  });

  const totalEngagement = totalLikes + totalComments + totalShares + totalSaves + totalClicks;
  const avgEngagementRate = totalReach > 0 ? (totalEngagement / totalReach) * 100 : 0;

  // Build Platforms Record
  const byPlatform: any = {};
  PLATFORMS.forEach(pf => {
    const d = pfData[pf];
    byPlatform[pf] = {
      reach: d.reach,
      impressions: d.impressions,
      engagement: d.esc,
      postsCount: d.postsCount,
      avgEngagementRate: d.reach > 0 ? parseFloat(((d.esc / d.reach) * 100).toFixed(2)) : 0
    };
  });

  // Build ByContentType
  const byContentType: any = {};
  Object.keys(ctData).forEach(key => {
    const k = key as ContentType;
    byContentType[k] = {
      reach: ctData[k].reach,
      postsCount: ctData[k].postsCount,
      engagement: ctData[k].esc
    };
  });

  // Build ByCategory
  const byCategory: any = {};
  Object.keys(catData).forEach(key => {
    const k = key as ContentCategory;
    byCategory[k] = {
      reach: catData[k].reach,
      postsCount: catData[k].postsCount,
      engagement: catData[k].esc
    };
  });

  // timeMap / dayMap maps
  const timeMap = hourData.map(h => ({
    hour: h.hour,
    reach: h.reach,
    postsCount: h.postsCount,
    engagement: h.esc
  }));

  const dayMap = dayData.map(d => ({
    day: d.day,
    reach: d.reach,
    postsCount: d.postsCount,
    engagement: d.esc
  }));

  return {
    totalReach,
    totalImpressions,
    totalEngagement,
    avgEngagementRate: parseFloat(avgEngagementRate.toFixed(2)),
    byPlatform,
    byContentType,
    byCategory,
    timeMap,
    dayMap
  };
}
