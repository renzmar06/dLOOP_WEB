interface BudgetSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
}

export default function BudgetSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  prefix = '',
  suffix = ''
}: BudgetSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-md text-sm font-semibold">
          {prefix}{value}{suffix}
        </div>
      </div>
      
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer slider focus:outline-none focus:ring-2 focus:ring-blue-400/30"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${percentage}%, #E5E7EB ${percentage}%, #E5E7EB 100%)`
          }}
        />
        
        {/* Custom slider styling */}
        <style jsx>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: all 0.2s ease;
          }
          
          .slider::-webkit-slider-thumb:hover {
            transform: scale(1.1);
            box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
          }
          
          .slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #3B82F6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
        `}</style>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{prefix}{min}{suffix}</span>
        <span>{prefix}{max}{suffix}</span>
      </div>
    </div>
  );
}