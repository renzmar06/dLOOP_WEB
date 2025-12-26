import { MapPin, Star, Clock, Users, Target } from 'lucide-react';

interface AudiencePreviewProps {
  radius: number;
  audience: string;
}

export default function AudiencePreview({ radius, audience }: AudiencePreviewProps) {
  const getAudienceLabel = (audience: string) => {
    switch (audience) {
      case 'new-customers':
        return 'New Customers';
      case 'returning-customers':
        return 'Returning Customers';
      case 'high-value':
        return 'High-Value Customers';
      default:
        return 'All Customers';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'new-customers':
        return '🆕';
      case 'returning-customers':
        return '🔄';
      case 'high-value':
        return '💎';
      default:
        return '🌟';
    }
  };

  const estimatedReach = Math.floor(radius * radius * 150 + Math.random() * 500);

  return (
    <div className="space-y-3">
      {/* Compact Campaign Reach */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Campaign Reach</h4>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-white rounded p-2">
            <div className="text-xs text-gray-600">Radius</div>
            <div className="text-sm font-bold text-blue-600">{radius} {radius === 1 ? 'mi' : 'mi'}</div>
          </div>
          
          <div className="bg-white rounded p-2">
            <div className="text-xs text-gray-600">Est. Reach</div>
            <div className="text-sm font-bold text-purple-600">{estimatedReach.toLocaleString()}</div>
          </div>
          
          <div className="bg-white rounded p-2">
            <div className="text-xs text-gray-600">Audience</div>
            <div className="text-xs font-medium text-gray-700">{getAudienceIcon(audience)} {getAudienceLabel(audience).split(' ')[0]}</div>
          </div>
        </div>
      </div>

      {/* Compact Sponsored Preview */}
      <div className="bg-white border border-gray-200 rounded-lg p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Sponsored Preview</h4>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 relative">
          <div className="absolute top-1 right-1">
            <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded font-medium">
              SPONSORED
            </span>
          </div>
          
          <div className="flex items-start space-x-2 pr-16">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 mb-1">
                <h5 className="text-sm font-semibold text-gray-900 truncate">Your Business</h5>
                <span className="text-xs text-yellow-600">★ 4.8</span>
              </div>
              
              <div className="text-xs text-gray-600 mb-2">
                0.5 mi • Open Now
              </div>
              
              <div className="bg-white/80 rounded p-2">
                <p className="text-xs text-gray-800 font-medium">
                  🎉 Special Offer: 20% off first visit!
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-blue-700 bg-blue-50 p-2 rounded">
          <strong>Premium Placement:</strong> Top of search results within {radius}-mile radius.
        </div>
      </div>
    </div>
  );
}