'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCampaigns, updateCampaignStatus } from '@/redux/slices/campaignsSlice';
import { resetDraft } from '@/redux/slices/campaignDraftSlice';
import StatCard from '@/components/boost/StatCard';
import BoostTabs from '@/components/boost/BoostTabs';
import BoostCard from '@/components/boost/BoostCard';
import BoostDrawer from '@/components/boost/BoostDrawer';
import PerformanceCard from '@/components/boost/PerformanceCard';
import AdsTable from '@/components/boost/AdsTable';
import CampaignHistoryCard from '@/components/boost/CampaignHistoryCard';
import PromotionBoostCard from '@/components/boost/PromotionBoostCard';
import Layout from '@/components/Layout';
import { TrendingUp, Megaphone, MapPin, Share2, Plus } from 'lucide-react';

export default function BoostAdvertisingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { campaigns, activeCampaigns, pausedCampaigns, completedCampaigns, loading } = useSelector((state: RootState) => state.campaigns);
  
  const [activeTab, setActiveTab] = useState('boost-profile');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedBoostType, setSelectedBoostType] = useState('');

  useEffect(() => {
    dispatch(fetchCampaigns());
  }, [dispatch]);

  // Calculate dynamic stats from campaigns
  const stats = [
    {
      title: 'Active Campaigns',
      value: activeCampaigns.length.toString(),
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      textColor: 'text-white',
      icon: '🚀'
    },
    {
      title: 'Total Reach (7d)',
      value: '12,847', // TODO: Calculate from metrics
      gradient: 'from-blue-50 via-blue-100 to-blue-200',
      textColor: 'text-blue-900',
      icon: '👥'
    },
    {
      title: 'Impressions (7d)',
      value: '24,532', // TODO: Calculate from metrics
      gradient: 'from-purple-50 via-purple-100 to-purple-200',
      textColor: 'text-purple-900',
      icon: '👁️'
    },
    {
      title: 'Total Spend (7d)',
      value: `$${activeCampaigns.reduce((sum, campaign) => sum + (campaign.dailyBudget * 7), 0).toFixed(2)}`,
      gradient: 'from-orange-50 via-orange-100 to-orange-200',
      textColor: 'text-orange-900',
      icon: '💰'
    }
  ];

  const tabs = [
    { id: 'boost-profile', label: 'Boost Profile' },
    { id: 'boost-promotions', label: 'Boost Promotions' },
    { id: 'ads-manager', label: 'Ads Manager' },
    { id: 'campaign-history', label: 'Campaign History' }
  ];

  const boostCards = [
    {
      id: 'business-profile',
      title: 'Boost Business Profile',
      description: 'Increase visibility and attract more customers to your business profile with targeted promotion',
      highlight: 'Avg. 3x more profile views',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100',
      borderGradient: 'from-emerald-400 to-emerald-500'
    },
    {
      id: 'promotion',
      title: 'Boost a Promotion',
      description: 'Promote special offers, discounts, and events to reach more customers in your area',
      highlight: 'Up to 5x more engagement',
      icon: Megaphone,
      gradient: 'from-violet-500 to-violet-600',
      bgGradient: 'from-violet-50 to-violet-100',
      borderGradient: 'from-violet-400 to-violet-500'
    },
    {
      id: 'map-pin',
      title: 'Sponsored Map Pin',
      description: 'Stand out on the map with a sponsored pin to attract nearby customers searching for services',
      highlight: 'Featured placement guaranteed',
      icon: MapPin,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100',
      borderGradient: 'from-blue-400 to-blue-500'
    },
    {
      id: 'social-post',
      title: 'Sponsored Social Post',
      description: 'Amplify your social media content across our platform network to maximize reach',
      highlight: 'Reach 10x more users',
      icon: Share2,
      gradient: 'from-rose-500 to-pink-600',
      bgGradient: 'from-rose-50 to-pink-100',
      borderGradient: 'from-rose-400 to-pink-500'
    }
  ];

  const handleBoostClick = (boostType: string) => {
    if (isDrawerOpen) return;
    dispatch(resetDraft());
    setSelectedBoostType(boostType);
    setIsDrawerOpen(true);
  };

  const handleDuplicateCampaign = async (campaignId: string) => {
    // TODO: Implement campaign duplication
    console.log('Duplicating campaign:', campaignId);
  };

  const handleCampaignStatusChange = async (campaignId: string, status: string) => {
    await dispatch(updateCampaignStatus({ campaignId, status }));
  };

  // Mock campaign history data
  const campaignHistory = [];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Premium Frosted Header */}
        <div className="sticky top-0 z-50 bg-white/70 backdrop-blur-lg border-b border-white/20 shadow-sm">
          <div className="max-w-7xl mx-auto px-10 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Boost & Advertising</h1>
                <p className="text-sm text-gray-500 mt-1">Increase visibility and attract more customers to your location</p>
              </div>
              <button
                onClick={() => handleBoostClick('campaign-manager')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Create New Boost Campaign
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Enhanced Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* Enhanced Tabs Section */}
          <div className="mb-10">
            <BoostTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Enhanced Boost Cards Grid */}
          {activeTab === 'boost-profile' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-2">
              {boostCards.map((card) => (
                <BoostCard
                  key={card.id}
                  {...card}
                  onBoostClick={() => handleBoostClick(card.id)}
                />
              ))}
            </div>
          )}

          {/* Ads Manager Tab Content */}
          {activeTab === 'ads-manager' && (
            <div className="space-y-8">
              {/* Weekly Performance Card */}
              <PerformanceCard campaigns={activeCampaigns} />
              
              {/* Active Campaigns Table */}
              <AdsTable 
                campaigns={activeCampaigns} 
                onStatusChange={handleCampaignStatusChange}
                loading={loading}
              />
            </div>
          )}

          {/* Campaign History Tab Content */}
          {activeTab === 'campaign-history' && (
            <div className="space-y-6">
              {completedCampaigns.map((campaign) => (
                <CampaignHistoryCard
                  key={campaign._id}
                  campaign={{
                    id: campaign._id,
                    title: campaign.title,
                    type: campaign.boostType as any,
                    dateRange: `${new Date(campaign.startDate).toLocaleDateString()} - ${new Date(campaign.endDate).toLocaleDateString()}`,
                    totalSpend: campaign.totalBudget,
                    impressions: 0, // TODO: Get from metrics
                    clicks: 0, // TODO: Get from metrics
                    ctr: 0 // TODO: Calculate from metrics
                  }}
                  onDuplicate={handleDuplicateCampaign}
                />
              ))}
              {completedCampaigns.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No completed campaigns yet
                </div>
              )}
            </div>
          )}

          {/* Boost Promotions Tab Content */}
          {activeTab === 'boost-promotions' && (
            <div>
              <PromotionBoostCard onBoostClick={() => handleBoostClick('promotion')} />
            </div>
          )}
        </div>

        {/* Enhanced Boost Drawer */}
        <BoostDrawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            dispatch(resetDraft());
          }}
          boostType={selectedBoostType}
        />
      </div>
    </Layout>
  );
}