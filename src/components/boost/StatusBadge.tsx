import { Play, Pause, CheckCircle, Edit } from 'lucide-react';

interface StatusBadgeProps {
  status: 'draft' | 'active' | 'paused' | 'completed';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'active') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Play className="w-3 h-3 mr-1" />
        active
      </span>
    );
  }

  if (status === 'paused') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Pause className="w-3 h-3 mr-1" />
        paused
      </span>
    );
  }

  if (status === 'completed') {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        completed
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
      <Edit className="w-3 h-3 mr-1" />
      draft
    </span>
  );
}
