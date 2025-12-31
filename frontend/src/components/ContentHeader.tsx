import { Globe } from 'lucide-react';

interface ContentHeaderProps {
  title: string;
  viewMode: 'original' | 'enhanced';
  setViewMode: (mode: 'original' | 'enhanced') => void;
}

export default function ContentHeader({ title, viewMode, setViewMode }: ContentHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold text-zinc-900 break-words tracking-tight">{title}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
            <Globe size={12} /> Source: BeyondChats
          </span>
        </div>
      </div>
      
      <div className="inline-flex p-1 bg-zinc-100 rounded-xl w-fit shrink-0">
        <button 
          onClick={() => setViewMode('original')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            viewMode === 'original' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          ORIGINAL
        </button>
        <button 
          onClick={() => setViewMode('enhanced')}
          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
            viewMode === 'enhanced' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'
          }`}
        >
          ENHANCED
        </button>
      </div>
    </div>
  );
}
