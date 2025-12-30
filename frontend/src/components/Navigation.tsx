import { BarChart3, Settings, Layers } from 'lucide-react';

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
        <button 
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
            activeTab === 'settings' ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <Settings size={20} />
          <span className="font-semibold text-sm hidden lg:block">Config</span>
        </button>
      </div>
      
      <div className="p-6 mt-auto">
        <div className="w-full aspect-square lg:aspect-auto lg:h-10 bg-zinc-100 rounded-xl flex items-center justify-center lg:justify-start lg:px-3 gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-300" />
          <span className="text-xs font-bold hidden lg:block">Intern_User</span>
        </div>
      </div>
    </nav>
  );
}
