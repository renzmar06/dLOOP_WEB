interface ResultCardProps {
  title: string;
  value: string;
  percentage: string;
  percentageColor: string;
  icon: string;
}

export default function ResultCard({
  title,
  value,
  percentage,
  percentageColor,
  icon
}: ResultCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h4 className="text-sm font-medium text-gray-700">{title}</h4>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${percentageColor} bg-opacity-10`}>
          {percentage}
        </div>
      </div>
    </div>
  );
}