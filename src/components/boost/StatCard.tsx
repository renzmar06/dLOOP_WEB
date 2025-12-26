interface StatCardProps {
  title: string;
  value: string;
  gradient: string;
  textColor: string;
  icon: string;
}

export default function StatCard({ title, value, gradient, textColor, icon }: StatCardProps) {
  return (
    <div className={`group relative bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-white/20`}>
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <span className="text-2xl">{icon}</span>
            <h3 className={`text-sm font-semibold ${textColor} opacity-90 tracking-wide uppercase`}>
              {title}
            </h3>
          </div>
          <p className={`text-4xl font-bold ${textColor} tracking-tight`}>
            {value}
          </p>
        </div>
        
        {/* Decorative element */}
        <div className={`w-2 h-16 bg-gradient-to-b from-white/30 to-white/10 rounded-full`} />
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}