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
  const [showMobileList, setShowMobileList] = useState(true);
  const [isPolling, setIsPolling] = useState(true);

  const fetchArticles = async () => {
    try {
      const response = await articleApi.getAllArticles(1, 100);
      setArticles(response.data);
      if (response.data.length > 0 && !selectedId) {
        setSelectedId(response.data[0].id);
      }
      
      const hasUnenhanced = response.data.some(article => !article.isEnhanced);
      if (!hasUnenhanced && response.data.length > 0) {
        setIsPolling(false);
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      return [];
    }
  };

  useEffect(() => {
    const loadInitial = async () => {
      setLoading(true);
      await fetchArticles();
      setLoading(false);
    };
    
    loadInitial();
  }, []);

  useEffect(() => {
    if (!isPolling) return;
    
    const interval = setInterval(async () => {
      await fetchArticles();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPolling]);

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
        {/* Article List - Hidden on mobile when content is shown */}
        <div className={`${showMobileList ? 'block' : 'hidden'} md:block`}>
          <ArticleListPanel 
            articles={articles}
            selectedId={selectedId}
            onSelectArticle={(id) => {
              setSelectedId(id);
              setShowMobileList(false); // Switch to content view on mobile
            }}
          />
        </div>
        
        {/* Content Panel - Hidden on mobile when list is shown */}
        <div className={`${showMobileList ? 'hidden' : 'block'} md:block flex-1 overflow-hidden`}>
          <ContentPanel 
            article={selectedArticle}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onBackToList={() => setShowMobileList(true)} // Back button for mobile
          />
        </div>
      </div>
    </div>
  );
}
