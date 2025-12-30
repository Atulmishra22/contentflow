import type { Article } from '../services/api';

interface ArticleListItemProps {
  article: Article;
  active: boolean;
  onClick: () => void;
}

export default function ArticleListItem({ article, active, onClick }: ArticleListItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatus = () => {
    if (article.isEnhanced) return 'completed';
    return 'pending';
  };

  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border mb-2 group ${
        active 
          ? 'bg-zinc-900 border-zinc-900 shadow-lg shadow-zinc-200' 
          : 'bg-white border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50'
      }`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className={`text-sm font-semibold leading-tight ${active ? 'text-white' : 'text-zinc-900'}`}>
            {article.title}
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
            active ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-500'
          }`}>
            {getStatus()}
          </span>
          <span className={`text-[11px] ${active ? 'text-zinc-400' : 'text-zinc-400'}`}>
            {formatDate(article.publishedDate)}
          </span>
        </div>
      </div>
    </button>
  );
}
