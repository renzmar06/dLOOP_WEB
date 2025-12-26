import { Calendar, Copy, TrendingUp, Megaphone, MapPin, Share2 } from 'lucide-react';
import MetricItem from './MetricItem';

interface CampaignData {
  id: string;
  title: string;
  type: 'profile' | 'promotion' | 'map-pin' | 'social-post';
  dateRange: string;
  totalSpend: number;
  impressions: number;
  clicks: number;
  ctr: number;
}

interface CampaignHistoryCardProps {
  campaign: CampaignData;
  onDuplicate: (id: string) => void;
}

const getIconAndColor = (type: string) => {
  switch (type) {
    case 'profile':
      return { icon: TrendingUp, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' };
    case 'promotion':
      return { icon: Megaphone, bgColor: 'bg-violet-100', iconColor: 'text-violet-600' };
    case 'map-pin':
      return { icon: MapPin, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' };
    case 'social-post':
      return { icon: Share2, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' };
    default:
      return { icon: TrendingUp, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  }
};

export default function CampaignHistoryCard({ campaign, onDuplicate }: CampaignHistoryCardProps) {
  const { icon: Icon, bgColor, iconColor } = getIconAndColor(campaign.type);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        {/* Left Section - Campaign Info */}
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">{campaign.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              {campaign.dateRange}
            </div>
            <div className="text-sm text-gray-600">
              ${campaign.totalSpend.toFixed(2)} total spend
            </div>
          </div>
        </div>

        {/* Middle Section - Metrics */}
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            <MetricItem 
              label="Impressions" 
              value={campaign.impressions.toLocaleString()} 
            />
            <MetricItem 
              label="Clicks" 
              value={campaign.clicks.toLocaleString()} 
            />
            <MetricItem 
              label="CTR" 
              value={`${campaign.ctr.toFixed(2)}%`}
              isHighlighted={true}
            />
          </div>
          
          {/* Status Badge */}
          <div className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
            Completed Campaign
          </div>
        </div>

        {/* Right Section - Actions */}
        <div>
          <button
            onClick={() => onDuplicate(campaign.id)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicate
          </button>
        </div>
      </div>
    </div>
  );
}