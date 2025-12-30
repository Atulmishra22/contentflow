import type { Article } from '../services/api';
import ArticleListItem from './ArticleListItem';

interface ArticleListPanelProps {
  articles: Article[];
  selectedId: number | null;
  onSelectArticle: (id: number) => void;
}

export default function ArticleListPanel({ articles, selectedId, onSelectArticle }: ArticleListPanelProps) {
  return (
    <aside className="hidden md:flex flex-col w-80 lg:w-96 bg-white border-r border-zinc-200 overflow-y-auto p-6 shrink-0">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-zinc-900">Task Phase 1-3</h2>
        <p className="text-xs text-zinc-400">Manage scraped & rewritten blogs</p>
      </div>
      
      {articles.map(article => (
        <ArticleListItem 
          key={article.id}
          article={article}
          active={selectedId === article.id}
          onClick={() => onSelectArticle(article.id)}
        />
      ))}
    </aside>
  );
}
