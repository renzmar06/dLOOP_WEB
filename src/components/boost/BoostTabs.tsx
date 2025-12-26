interface Tab {
  id: string;
  label: string;
}

interface BoostTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function BoostTabs({ tabs, activeTab, onTabChange }: BoostTabsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
      <nav className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-6 py-4 text-sm font-semibold rounded-xl transition-all duration-300 flex-1 text-center ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="relative z-10">{tab.label}</span>
            
            {activeTab === tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-xl" />
            )}
            
            {activeTab !== tab.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
}