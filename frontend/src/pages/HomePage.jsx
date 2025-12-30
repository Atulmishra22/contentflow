import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { articleAPI } from '../services/api';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadArticles();
  }, [page, filter]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const enhanced = filter === 'all' ? undefined : filter === 'enhanced';
      const result = await articleAPI.getAll(page, 10, enhanced);
      setArticles(result.data);
      setTotal(result.pagination.total);
    } catch (error) {
      console.error('Failed to load articles:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-dark">Articles</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('original')}
            className={`px-4 py-2 rounded ${
              filter === 'original' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
          >
            Original
          </button>
          <button
            onClick={() => setFilter('enhanced')}
            className={`px-4 py-2 rounded ${
              filter === 'enhanced' ? 'bg-primary text-white' : 'bg-gray-200'
            }`}
          >
            Enhanced
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-dark line-clamp-2">
                    {article.title}
                  </h2>
                  {article.isEnhanced && (
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">
                      AI
                    </span>
                  )}
                </div>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {article.content.substring(0, 150)}...
                </p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{article.wordCount} words</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-dark text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={articles.length < 10}
              className="px-4 py-2 bg-dark text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
