import { useState, useEffect } from 'react';
import { articleAPI } from '../services/api';

export default function ComparisonView() {
  const [articles, setArticles] = useState([]);
  const [original, setOriginal] = useState(null);
  const [enhanced, setEnhanced] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const result = await articleAPI.getAll(1, 100, false);
      const originalArticles = result.data.filter(a => !a.isEnhanced && a.enhancedArticleId);
      setArticles(originalArticles);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
  };

  const handleSelectArticle = async (article) => {
    setOriginal(article);
    if (article.enhancedArticleId) {
      const enhancedResult = await articleAPI.getById(article.enhancedArticleId);
      setEnhanced(enhancedResult.data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-dark mb-8">Compare Versions</h1>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Select Article:</label>
        <select
          onChange={(e) => {
            const article = articles.find(a => a.id === parseInt(e.target.value));
            if (article) handleSelectArticle(article);
          }}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">Choose an article...</option>
          {articles.map(article => (
            <option key={article.id} value={article.id}>
              {article.title}
            </option>
          ))}
        </select>
      </div>

      {original && enhanced && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Original</h2>
              <span className="bg-gray-800 text-white text-xs px-3 py-1 rounded">
                {original.wordCount} words
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-4">{original.title}</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{original.content}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">AI Enhanced</h2>
              <span className="bg-primary text-white text-xs px-3 py-1 rounded">
                {enhanced.wordCount} words
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-4">{enhanced.title}</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{enhanced.content}</p>
            
            {enhanced.references && JSON.parse(enhanced.references).length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-2">References:</h4>
                <ul className="space-y-1 text-sm">
                  {JSON.parse(enhanced.references).map((ref, idx) => (
                    <li key={idx}>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {ref.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {!original && (
        <div className="text-center py-12 text-gray-500">
          Select an article to compare original and enhanced versions
        </div>
      )}
    </div>
  );
}
