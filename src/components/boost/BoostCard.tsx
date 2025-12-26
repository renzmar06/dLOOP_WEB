import { LucideIcon } from 'lucide-react';

interface BoostCardProps {
  id: string;
  title: string;
  description: string;
  highlight: string;
  icon: LucideIcon;
  gradient: string;
  bgGradient: string;
  borderGradient: string;
  onBoostClick: () => void;
}

export default function BoostCard({
  title,
  description,
  highlight,
  icon: Icon,
  gradient,
  bgGradient,
  borderGradient,
  onBoostClick
}: BoostCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition-all duration-200">
      {/* Simple top accent */}
      <div className={`h-0.5 bg-gradient-to-r ${borderGradient} rounded-t-lg -mx-4 -mt-4 mb-4`} />
      
      {/* Icon */}
      <div className={`bg-gradient-to-br ${bgGradient} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-gray-700" />
      </div>

      {/* Content */}
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {description}
      </p>

      {/* Highlight */}
      <div className="bg-blue-50 px-3 py-1 rounded-md mb-4">
        <p className="text-xs font-medium text-blue-700">
          {highlight}
        </p>
      </div>

      {/* Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onBoostClick();
        }}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200"
      >
        Boost Now
      </button>
    </div>
  );
}