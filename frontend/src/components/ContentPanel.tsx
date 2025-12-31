import { CheckCircle, Info, ArrowUpRight, FileText, BookOpen, ArrowLeft } from 'lucide-react';
import type { Article } from '../services/api';
import ContentHeader from './ContentHeader';

interface ContentPanelProps {
  article: Article | null;
  viewMode: 'original' | 'enhanced';
  setViewMode: (mode: 'original' | 'enhanced') => void;
  onBackToList?: () => void; // Optional callback for mobile back button
}

export default function ContentPanel({ article, viewMode, setViewMode, onBackToList }: ContentPanelProps) {
  if (!article) {
    return (
      <main className="flex-1 bg-zinc-50/50 overflow-y-auto relative">
        <div className="h-full flex flex-col items-center justify-center text-zinc-400">
          <BookOpen size={48} strokeWidth={1} className="mb-4" />
          <p className="font-medium">Select an article to review</p>
        </div>
      </main>
    );
  }

  // Parse references from JSON string
  let citations: Array<{ title: string; url: string }> = [];
  if (article.references) {
    try {
      citations = JSON.parse(article.references);
    } catch (error) {
      console.error('Failed to parse references:', error);
      citations = [];
    }
  }

  return (
    <main className="h-full bg-zinc-50/50 overflow-y-auto relative w-full">
      <div className="max-w-4xl mx-auto w-full">
        {/* Mobile Back Button */}
        {onBackToList && (
          <div className="md:hidden p-4 border-b border-zinc-200 bg-white sticky top-0 z-10">
            <button
              onClick={onBackToList}
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Articles</span>
            </button>
          </div>
        )}
        
        <ContentHeader 
          title={article.title} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        <div className="p-4 md:p-6 lg:p-12 w-full">
          <div className="card-container w-full">
            
            {viewMode === 'enhanced' ? (
              article.isEnhanced && article.enhancedContent ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="badge-primary">
                    <CheckCircle size={12} /> AI Optimized Version
                  </div>
                  <div className="content-box">
                    <div className="prose prose-zinc max-w-none w-full overflow-hidden">
                      {article.enhancedContent.split('\n\n').map((p, i) => (
                        <p key={i} className="text-enhanced">{p}</p>
                      ))}
                    </div>
                  </div>
                  
                  {citations.length > 0 && (
                    <div className="reference-section">
                      <h4 className="reference-heading">
                        <Info size={14} /> References Used
                      </h4>
                      <div className="grid gap-3">
                        {citations.map((citation, i) => (
                          <div key={i} className="reference-card">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="reference-title">
                                  {citation.title}
                                </p>
                                <a 
                                  href={citation.url} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="reference-link"
                                >
                                  {citation.url}
                                  <ArrowUpRight size={12} className="flex-shrink-0" />
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="loading-container">
                  <div className="loading-spinner" />
                  <h3 className="font-bold text-zinc-900">Processing Phase 2...</h3>
                  <p className="text-sm text-zinc-400 mt-2">LLM is currently rewriting this content based on Google search results.</p>
                </div>
              )
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="badge-secondary">
                  <FileText size={12} /> Original Scraped Text
                </div>
                <div className="raw-content-box">
                  <p className="text-raw">
                    {article.content}
                  </p>
                </div>
                {article.sourceUrl && (
                  <p className="mt-4 text-[10px] text-zinc-400 text-right">
                    Extracted from: {article.sourceUrl}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
