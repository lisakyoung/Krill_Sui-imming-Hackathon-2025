'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import {
  Crown, Star, Shield, Play, Lock, 
  Calendar, TrendingUp, Grid, List
} from 'lucide-react';

interface Subscription {
  creator: string;
  tier: string;
  nftId: string;
  mintedAt: string;
  expiresAt: string;
}

interface CreatorContent {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  requiredTier: string;
  views: number;
  uploadedAt: string;
}

export default function ViewerSubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCreator, setSelectedCreator] = useState<string | null>(null);

  // Mock content data - would come from API
  const creatorContent: Record<string, CreatorContent[]> = {
    'Alex Rivers': [
      {
        id: '1',
        title: 'Exclusive Tutorial: Advanced Techniques',
        thumbnail: '/content-1.jpg',
        duration: '15:30',
        requiredTier: 'bronze',
        views: 1234,
        uploadedAt: '2 days ago'
      },
      {
        id: '2',
        title: 'Behind the Scenes: Creative Process',
        thumbnail: '/content-2.jpg',
        duration: '22:15',
        requiredTier: 'silver',
        views: 892,
        uploadedAt: '1 week ago'
      },
      {
        id: '3',
        title: 'VIP Only: Personal Q&A Session',
        thumbnail: '/content-3.jpg',
        duration: '45:00',
        requiredTier: 'gold',
        views: 45,
        uploadedAt: '3 days ago'
      }
    ]
  };

  useEffect(() => {
    // Load user's subscriptions from localStorage
    const saved = localStorage.getItem('userSubscriptions');
    if (saved) {
      setSubscriptions(JSON.parse(saved));
    }
  }, []);

  const getTierIcon = (tier: string) => {
    switch(tier) {
      case 'gold': return Crown;
      case 'silver': return Star;
      default: return Shield;
    }
  };

  const getTierColor = (tier: string) => {
    switch(tier) {
      case 'gold': return 'from-yellow-500 to-yellow-300';
      case 'silver': return 'from-gray-400 to-gray-200';
      default: return 'from-orange-600 to-orange-400';
    }
  };

  const canAccessContent = (contentTier: string, userTier: string) => {
    const tierLevels = { bronze: 1, silver: 2, gold: 3 };
    return (tierLevels[userTier] || 0) >= (tierLevels[contentTier] || 0);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Subscriptions</h1>
            <p className="text-gray-400">Access exclusive content from your subscribed creators</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-500' : ''}`}
              >
                <Grid className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-500' : ''}`}
              >
                <List className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Subscriptions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Active Subscriptions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptions.map((sub) => {
              const Icon = getTierIcon(sub.tier);
              const isExpired = new Date(sub.expiresAt) < new Date();
              
              return (
                <motion.div
                  key={sub.nftId}
                  whileHover={{ scale: 1.02 }}
                  className="glass-effect rounded-xl p-4 cursor-pointer"
                  onClick={() => setSelectedCreator(sub.creator)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${getTierColor(sub.tier)} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{sub.creator}</h3>
                        <p className="text-sm text-gray-400 capitalize">{sub.tier} Tier</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">NFT ID</span>
                      <span className="text-white font-mono">#{sub.nftId.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Expires</span>
                      <span className={isExpired ? 'text-red-400' : 'text-green-400'}>
                        {isExpired ? 'Expired' : new Date(sub.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/creator/${sub.creator}/content`);
                    }}
                    className="w-full mt-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition"
                  >
                    Access Content
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Content Access */}
        {selectedCreator && creatorContent[selectedCreator] && (
          <div className="glass-effect rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Content from {selectedCreator}
            </h2>
            
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {creatorContent[selectedCreator].map((content) => {
                const userSub = subscriptions.find(s => s.creator === selectedCreator);
                const hasAccess = userSub && canAccessContent(content.requiredTier, userSub.tier);
                
                return (
                  <div
                    key={content.id}
                    className={`${viewMode === 'list' ? 'flex space-x-4' : ''} bg-white/5 rounded-xl overflow-hidden ${
                      hasAccess ? 'cursor-pointer hover:bg-white/10' : 'opacity-50'
                    } transition`}
                    onClick={() => hasAccess && router.push(`/watch/${content.id}`)}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'w-48' : 'w-full'} h-32 bg-gradient-to-br from-purple-600 to-pink-600`}>
                      {!hasAccess && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded text-xs text-white">
                        {content.duration}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1">
                      <h3 className="text-white font-medium mb-1 line-clamp-2">{content.title}</h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-400">
                        <span>{content.views} views</span>
                        <span>•</span>
                        <span>{content.uploadedAt}</span>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          content.requiredTier === 'gold' 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : content.requiredTier === 'silver'
                            ? 'bg-gray-500/20 text-gray-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {content.requiredTier.toUpperCase()} ONLY
                        </span>
                        
                        {hasAccess ? (
                          <span className="text-xs text-green-400 flex items-center">
                            <Play className="w-3 h-3 mr-1" />
                            Watch Now
                          </span>
                        ) : (
                          <span className="text-xs text-red-400">
                            Upgrade to access
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Discover More */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Want to support more creators?</p>
          <button
            onClick={() => router.push('/explore')}
            className="px-6 py-3 bg-purple-500 rounded-xl text-white hover:bg-purple-600 transition"
          >
            Discover More Creators
          </button>
        </div>
      </div>
    </MainLayout>
  );
}