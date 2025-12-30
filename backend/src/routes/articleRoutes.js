import express from 'express';
import {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} from '../controllers/articleController.js';

const router = express.Router();

// Get all articles
router.get('/', getAllArticles);

// Get single article
router.get('/:id', getArticleById);

// Create article
router.post('/', createArticle);

// Update article
router.put('/:id', updateArticle);

// Delete article
router.delete('/:id', deleteArticle);

export default router;
