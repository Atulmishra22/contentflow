import { BarChart3, Layers } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="w-20 lg:w-64 border-r border-zinc-200 bg-white flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white shrink-0">
          <Layers size={18} />
        </div>
        <span className="font-bold text-lg hidden lg:block tracking-tighter">BeyondEditor</span>
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
            activeTab === 'dashboard' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <BarChart3 size={20} />
          <span className="font-semibold text-sm hidden lg:block">Dashboard</span>
        </button>
      </div>
    </nav>
  );
}
