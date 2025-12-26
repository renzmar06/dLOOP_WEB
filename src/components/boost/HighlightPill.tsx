import { TrendingUp } from 'lucide-react';

interface HighlightPillProps {
  text: string;
}

export default function HighlightPill({ text }: HighlightPillProps) {
  return (
    <div className="inline-flex items-center bg-purple-100 px-4 py-2 rounded-full">
      <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
      <span className="text-sm font-medium text-purple-700">{text}</span>
    </div>
  );
}