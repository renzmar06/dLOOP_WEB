import { Gift, ChevronRight } from 'lucide-react';
import HighlightPill from './HighlightPill';

interface PromotionBoostCardProps {
  onBoostClick: () => void;
}

export default function PromotionBoostCard({ onBoostClick }: PromotionBoostCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm max-w-md">
      {/* Purple accent border */}
      <div className="h-1 bg-gradient-to-r from-purple-500 to-violet-600 rounded-t-lg" />
      
      <div className="p-8 flex flex-col h-full">
        {/* Icon */}
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
          <Gift className="w-8 h-8 text-purple-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            Boost a Promotion
          </h3>
          <p className="text-gray-600 text-base mb-6 leading-relaxed">
            Increase views and redemptions on your offers
          </p>

          {/* Highlight Metric */}
          <div className="mb-8">
            <HighlightPill text="Avg. 2.5x more redemptions" />
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onBoostClick}
          className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-200 flex items-center justify-center"
        >
          Boost Now
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
}