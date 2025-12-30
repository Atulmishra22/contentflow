import { useState, useEffect } from 'react';
import { articleApi } from './services/api';
import type { Article } from './services/api';
import Navigation from './components/Navigation';
import ArticleListPanel from './components/ArticleListPanel';
import ContentPanel from './components/ContentPanel';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'enhanced'>('enhanced');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await articleApi.getAllArticles(1, 100);
        setArticles(response.data);
        if (response.data.length > 0 && !selectedId) {
          setSelectedId(response.data[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
    
    const interval = setInterval(fetchArticles, 5000);
    
    return () => clearInterval(interval);
  }, [selectedId]);

  const selectedArticle = articles.find(a => a.id === selectedId) || null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-50">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600">Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex overflow-hidden">
        <ArticleListPanel 
          articles={articles}
          selectedId={selectedId}
          onSelectArticle={setSelectedId}
        />
        
        <ContentPanel 
          article={selectedArticle}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>
    </div>
  );
}
