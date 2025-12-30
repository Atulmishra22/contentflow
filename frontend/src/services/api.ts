const API_BASE_URL = 'http://localhost:5000/api';

export type Article = {
  id: number;
  title: string;
  content: string;
  enhancedContent: string | null;
  author: string | null;
  publishedDate: string | null;
  sourceUrl: string | null;
  isEnhanced: boolean;
  originalArticleId: number | null;
  enhancedArticleId: number | null;
  references: string | null;
  scrapedAt: string | null;
  enhancedAt: string | null;
  wordCount: number | null;
  createdAt: string;
  updatedAt: string;
};

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ArticleResponse {
  success: boolean;
  data: Article[];
  pagination: PaginationMeta;
}

export interface SingleArticleResponse {
  success: boolean;
  data: Article;
}

export const articleApi = {
  async getAllArticles(page = 1, limit = 10): Promise<ArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles?page=${page}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch articles');
    return response.json();
  },

  async getArticleById(id: number): Promise<SingleArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) throw new Error('Failed to fetch article');
    return response.json();
  },

  async createArticle(article: Partial<Article>): Promise<SingleArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('Failed to create article');
    return response.json();
  },

  async updateArticle(id: number, article: Partial<Article>): Promise<SingleArticleResponse> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });
    if (!response.ok) throw new Error('Failed to update article');
    return response.json();
  },

  async deleteArticle(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete article');
    return response.json();
  },
};
