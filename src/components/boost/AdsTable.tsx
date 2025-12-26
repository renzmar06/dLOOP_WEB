import { MoreVertical, Play, Pause, Edit, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import TrendSparkline from './TrendSparkline';

interface Campaign {
  _id: string;
  title: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  dailyBudget: number;
  totalBudget: number;
  boostType: string;
  createdAt: string;
}

interface AdsTableProps {
  campaigns: Campaign[];
  onStatusChange: (campaignId: string, status: string) => void;
  onCreateAd: () => void;
  onEditCampaign?: (campaignId: string) => void;
  onBoostCampaign?: (campaignId: string) => void;
  loading?: boolean;
}

export default function AdsTable({ campaigns, onStatusChange, onCreateAd, onEditCampaign, onBoostCampaign, loading }: AdsTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Active Campaigns</h3>
        <button 
          onClick={onCreateAd}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          Create New Ad
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daily Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reach
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  No active campaigns found. Create your first campaign to get started.
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign._id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">{campaign.title}</div>
                    <div className="text-xs text-gray-500 capitalize">{campaign.boostType.replace('-', ' ')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={campaign.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${campaign.dailyBudget.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* TODO: Get from metrics */}
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* TODO: Get from metrics */}
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* TODO: Get from metrics */}
                    0
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${campaign.totalBudget.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrendSparkline />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'active' ? (
                        <button
                          onClick={() => onStatusChange(campaign._id, 'paused')}
                          className="text-orange-600 hover:text-orange-800 transition-colors duration-150"
                          title="Pause campaign"
                        >
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onStatusChange(campaign._id, 'active')}
                          className="text-green-600 hover:text-green-800 transition-colors duration-150"
                          title="Resume campaign"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <div className="relative dropdown-container">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('3-dot clicked for campaign:', campaign._id);
                            setOpenDropdown(openDropdown === campaign._id ? null : campaign._id);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                          title="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {openDropdown === campaign._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
                            <div className="absolute right-8 top-0 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-20 transform transition-all duration-150 ease-out">
                              <div className="py-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Edit clicked for campaign:', campaign._id);
                                    onEditCampaign?.(campaign._id);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-150"
                                >
                                  <Edit className="w-4 h-4 mr-2 text-blue-500" />
                                  Edit
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Pause/Resume clicked for campaign:', campaign._id);
                                    onStatusChange(campaign._id, campaign.status === 'active' ? 'paused' : 'active');
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-150"
                                >
                                  {campaign.status === 'active' ? (
                                    <><Pause className="w-4 h-4 mr-2 text-orange-500" />Pause</>
                                  ) : (
                                    <><Play className="w-4 h-4 mr-2 text-green-500" />Resume</>
                                  )}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    console.log('Boost clicked for campaign:', campaign._id);
                                    onBoostCampaign?.(campaign._id);
                                    setOpenDropdown(null);
                                  }}
                                  className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors duration-150"
                                >
                                  <Zap className="w-4 h-4 mr-2 text-purple-500" />
                                  Boost
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}