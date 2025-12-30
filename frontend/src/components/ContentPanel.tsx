import { CheckCircle, Info, ArrowUpRight, FileText, BookOpen } from 'lucide-react';
import type { Article } from '../services/api';
import ContentHeader from './ContentHeader';

interface ContentPanelProps {
  article: Article | null;
  viewMode: 'original' | 'enhanced';
  setViewMode: (mode: 'original' | 'enhanced') => void;
}

export default function ContentPanel({ article, viewMode, setViewMode }: ContentPanelProps) {
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

  const citations = article.references 
    ? article.references.split('\n').filter(line => line.trim().startsWith('http'))
    : [];

  return (
    <main className="flex-1 bg-zinc-50/50 overflow-y-auto relative">
      <div className="max-w-4xl mx-auto min-h-full flex flex-col">
        <ContentHeader 
          title={article.title} 
          viewMode={viewMode} 
          setViewMode={setViewMode} 
        />
        
        <div className="p-6 md:p-12 flex-1">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 md:p-12 min-h-[600px] transition-all">
            
            {viewMode === 'enhanced' ? (
              article.isEnhanced && article.enhancedContent ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center gap-2 mb-8 px-3 py-1 bg-zinc-900 text-white rounded-lg text-[10px] font-bold w-fit uppercase">
                    <CheckCircle size={12} /> AI Optimized Version
                  </div>
                  <div className="prose prose-zinc max-w-none">
                    {article.enhancedContent.split('\n\n').map((p, i) => (
                      <p key={i} className="text-zinc-800 leading-relaxed text-lg mb-6">{p}</p>
                    ))}
                  </div>
                  
                  {citations.length > 0 && (
                    <div className="mt-16 pt-8 border-t border-zinc-100">
                      <h4 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Info size={14} /> Citations & Context
                      </h4>
                      <div className="grid gap-2">
                        {citations.map((url, i) => (
                          <a 
                            key={i} 
                            href={url} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-zinc-50 hover:border-zinc-900 hover:bg-white transition-all group"
                          >
                            <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-900 truncate">{url}</span>
                            <ArrowUpRight size={14} className="text-zinc-300 group-hover:text-zinc-900" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-12">
                  <div className="w-12 h-12 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-4" />
                  <h3 className="font-bold text-zinc-900">Processing Phase 2...</h3>
                  <p className="text-sm text-zinc-400 mt-2">LLM is currently rewriting this content based on Google search results.</p>
                </div>
              )
            ) : (
              <div className="animate-in fade-in duration-300">
                <div className="flex items-center gap-2 mb-8 px-3 py-1 bg-zinc-100 text-zinc-500 rounded-lg text-[10px] font-bold w-fit uppercase border border-zinc-200">
                  <FileText size={12} /> Original Scraped Text
                </div>
                <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200">
                  <p className="font-mono text-sm text-zinc-600 leading-relaxed">
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
