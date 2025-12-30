import prisma from '../config/database.js';

// Get all articles
export const getAllArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10, enhanced } = req.query;
    const skip = (page - 1) * limit;

    const where = enhanced !== undefined ? { isEnhanced: enhanced === 'true' } : {};

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.article.count({ where })
    ]);

    res.json({
      success: true,
      data: articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get article by ID
export const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: { id: parseInt(id) }
    });

    if (!article) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }

    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Create article
export const createArticle = async (req, res) => {
  try {
    const { title, content, author, publishedDate, sourceUrl, isEnhanced, references } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required' });
    }

    const wordCount = content.split(/\s+/).length;

    const article = await prisma.article.create({
      data: {
        title,
        content,
        author,
        publishedDate: publishedDate ? new Date(publishedDate) : null,
        sourceUrl,
        isEnhanced: isEnhanced || false,
        references: references ? JSON.stringify(references) : null,
        wordCount,
        scrapedAt: new Date()
      }
    });

    res.status(201).json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update article
export const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Update word count if content is being updated
    if (updateData.content) {
      updateData.wordCount = updateData.content.split(/\s+/).length;
    }

    // Convert references to JSON string if provided as object
    if (updateData.references && typeof updateData.references === 'object') {
      updateData.references = JSON.stringify(updateData.references);
    }

    const article = await prisma.article.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ success: true, data: article });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete article
export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.article.delete({
      where: { id: parseInt(id) }
    });

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};
