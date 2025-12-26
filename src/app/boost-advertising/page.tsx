'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { fetchCampaigns, updateCampaignStatus } from '@/redux/slices/campaignsSlice';
import { resetDraft, setBoostType, setTitle, setBudgetAndDuration } from '@/redux/slices/campaignDraftSlice';
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
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);

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
      value: (activeCampaigns.length * 1847 + pausedCampaigns.length * 500).toLocaleString(),
      gradient: 'from-blue-50 via-blue-100 to-blue-200',
      textColor: 'text-blue-900',
      icon: '👥'
    },
    {
      title: 'Impressions (7d)',
      value: (activeCampaigns.reduce((sum, campaign) => sum + (campaign.dailyBudget * 50 * 7), 0)).toLocaleString(),
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
    setEditingCampaignId(null); // Clear edit mode
    setIsDrawerOpen(true);
  };

  const handleEditCampaign = (campaignId: string) => {
    console.log('Edit campaign clicked:', campaignId);
    const campaign = campaigns.find(c => c._id === campaignId);
    console.log('Found campaign:', campaign);
    if (campaign) {
      dispatch(resetDraft());
      dispatch(setBoostType(campaign.boostType));
      dispatch(setTitle(campaign.title));
      dispatch(setBudgetAndDuration({
        dailyBudget: campaign.dailyBudget,
        durationDays: 7,
        isContinuous: !campaign.endDate
      }));
      setSelectedBoostType(campaign.boostType);
      setEditingCampaignId(campaignId); // Set edit mode
      setIsDrawerOpen(true);
    }
  };

  const handleBoostCampaign = (campaignId: string) => {
    console.log('Boost campaign clicked:', campaignId);
    const campaign = campaigns.find(c => c._id === campaignId);
    if (campaign) {
      dispatch(resetDraft());
      dispatch(setBoostType(campaign.boostType));
      dispatch(setTitle(`Boosted ${campaign.title}`));
      dispatch(setBudgetAndDuration({
        dailyBudget: Math.min(campaign.dailyBudget * 1.5, 200),
        durationDays: 7,
        isContinuous: false
      }));
      setSelectedBoostType(campaign.boostType);
      setEditingCampaignId(null); // Clear edit mode for boost
      setIsDrawerOpen(true);
    }
  };

  const handleDuplicateCampaign = async (campaignId: string) => {
    const campaign = campaigns.find(c => c._id === campaignId);
    if (campaign) {
      dispatch(resetDraft());
      dispatch(setBoostType(campaign.boostType));
      dispatch(setTitle(`Copy of ${campaign.title}`));
      dispatch(setBudgetAndDuration({
        dailyBudget: campaign.dailyBudget,
        durationDays: 7,
        isContinuous: false
      }));
      setSelectedBoostType(campaign.boostType);
      setEditingCampaignId(null);
      setIsDrawerOpen(true);
    }
  };

  const handleCampaignStatusChange = async (campaignId: string, status: string) => {
    await dispatch(updateCampaignStatus({ campaignId, status }));
    // Refresh campaigns list to show updated status
    dispatch(fetchCampaigns());
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
                campaigns={[...activeCampaigns, ...pausedCampaigns, ...completedCampaigns].sort((a, b) => {
                  if (a.status === 'active' && b.status !== 'active') return -1;
                  if (a.status !== 'active' && b.status === 'active') return 1;
                  return 0;
                })} 
                onStatusChange={handleCampaignStatusChange}
                onCreateAd={() => handleBoostClick('campaign-manager')}
                onEditCampaign={handleEditCampaign}
                onBoostCampaign={handleBoostCampaign}
                loading={loading}
              />
            </div>
          )}

          {/* Campaign History Tab Content */}
          {activeTab === 'campaign-history' && (
            <div className="space-y-6">
              {campaigns.map((campaign) => (
                <CampaignHistoryCard
                  key={campaign._id}
                  campaign={{
                    id: campaign._id,
                    title: campaign.title,
                    type: campaign.boostType === 'business-profile' ? 'profile' : 
                          campaign.boostType === 'promotion' ? 'promotion' :
                          campaign.boostType === 'map-pin' ? 'map-pin' : 'social-post',
                    dateRange: campaign.createdAt ? 
                      `${new Date(campaign.createdAt).toLocaleDateString()} - ${campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}` :
                      'Date not available',
                    totalSpend: campaign.totalBudget || 0,
                    impressions: campaign.dailyBudget * 50 * 7, // Estimated based on budget
                    clicks: Math.floor(campaign.dailyBudget * 2.5 * 7), // Estimated based on budget
                    ctr: 5.0 // Fixed CTR estimate
                  }}
                  onDuplicate={handleDuplicateCampaign}
                />
              ))}
              {campaigns.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No campaigns found
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
            setEditingCampaignId(null);
            dispatch(resetDraft());
          }}
          boostType={selectedBoostType}
          editingCampaignId={editingCampaignId}
        />
      </div>
    </Layout>
  );
}