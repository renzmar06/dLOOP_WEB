import { TrendingUp } from 'lucide-react';

interface Campaign {
  _id: string;
  title: string;
  dailyBudget: number;
  totalBudget: number;
  status: string;
}

interface PerformanceCardProps {
  campaigns: Campaign[];
}

export default function PerformanceCard({ campaigns }: PerformanceCardProps) {
  const totalSpend = campaigns.reduce((sum, campaign) => sum + campaign.totalBudget, 0);
  const avgDailyBudget = campaigns.length > 0 ? campaigns.reduce((sum, campaign) => sum + campaign.dailyBudget, 0) / campaigns.length : 0;
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-900">Campaign Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{campaigns.length}</div>
          <div className="text-sm text-gray-600">Active Campaigns</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">${totalSpend.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Budget</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">${avgDailyBudget.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Avg Daily Budget</div>
        </div>
      </div>
      
      {campaigns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No active campaigns to display performance data
        </div>
      )}
    </div>
  );
}