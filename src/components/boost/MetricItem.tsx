interface MetricItemProps {
  label: string;
  value: string;
  isHighlighted?: boolean;
}

export default function MetricItem({ label, value, isHighlighted = false }: MetricItemProps) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-sm font-semibold ${isHighlighted ? 'text-green-600' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  );
}