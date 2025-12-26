interface ResultMetricCardProps {
  title: string;
  value: string;
  percentage: string;
  percentageColor: string;
  icon: string;
  description: string;
}

export default function ResultMetricCard({
  title,
  value,
  percentage,
  percentageColor,
  icon,
  description
}: ResultMetricCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm hover:border-blue-300 transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-50 rounded-md flex items-center justify-center text-sm">
            {icon}
          </div>
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
        </div>
        
        <div className={`px-2 py-1 rounded text-xs font-medium ${percentageColor} bg-opacity-10`}>
          {percentage}
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <p className="text-xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}