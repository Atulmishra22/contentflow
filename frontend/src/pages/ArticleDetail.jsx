import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleAPI } from '../services/api';

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const result = await articleAPI.getById(id);
      setArticle(result.data);
    } catch (error) {
      console.error('Failed to load article:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Article not found</p>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">
          Back to articles
        </Link>
      </div>
    );
  }

  const references = article.references ? JSON.parse(article.references) : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/" className="text-primary hover:underline mb-6 inline-block">
        ← Back to articles
      </Link>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-4xl font-bold text-dark">{article.title}</h1>
          {article.isEnhanced && (
            <span className="bg-primary text-white text-sm px-3 py-1 rounded">
              AI Enhanced
            </span>
          )}
        </div>

        <div className="flex gap-4 text-sm text-gray-600 mb-6">
          {article.author && <span>By {article.author}</span>}
          <span>{article.wordCount} words</span>
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="prose max-w-none">
          <p className="text-gray-800 whitespace-pre-wrap">{article.content}</p>
        </div>

        {references.length > 0 && (
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-semibold mb-4">References</h3>
            <ul className="space-y-2">
              {references.map((ref, idx) => (
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

        {article.enhancedArticleId && (
          <div className="mt-6">
            <Link
              to={`/article/${article.enhancedArticleId}`}
              className="inline-block bg-primary text-white px-6 py-3 rounded hover:bg-blue-600 transition"
            >
              View AI Enhanced Version →
            </Link>
          </div>
        )}

        {article.originalArticleId && (
          <div className="mt-6">
            <Link
              to={`/article/${article.originalArticleId}`}
              className="inline-block bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-700 transition"
            >
              ← View Original Version
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
