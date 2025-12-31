import axios from 'axios';
import * as cheerio from 'cheerio';

const BEYONDCHATS_BLOG_URL = 'https://beyondchats.com/blogs';

export const scrapeBeyondChatsArticles = async (limit = 5) => {
  try {
    console.log('Fetching BeyondChats blog...');
    const { data: html } = await axios.get(BEYONDCHATS_BLOG_URL);
    const $ = cheerio.load(html);
    const articles = [];

    $('.blog-item, article, .post-item').each((index, element) => {
      if (articles.length >= limit) return false;

      const $element = $(element);
      
      const title = $element.find('h1, h2, h3, .title, .post-title').first().text().trim();
      const content = $element.find('p, .content, .excerpt, .post-content').first().text().trim();
      const author = $element.find('.author, .by-line, [class*="author"]').first().text().trim();
      const dateText = $element.find('.date, .published, time').first().text().trim();
      const link = $element.find('a').first().attr('href');

      if (title && content) {
        articles.push({
          title,
          content: content.substring(0, 500) + '...',
          author: author || 'BeyondChats Team',
          publishedDate: dateText ? new Date(dateText) : new Date(),
          sourceUrl: link ? (link.startsWith('http') ? link : `https://beyondchats.com${link}`) : BEYONDCHATS_BLOG_URL
        });
      }
    });

    if (articles.length === 0) {
      console.log('WARNING: No articles found with specific selectors, using generic approach...');
      
      $('article, .post, [class*="blog"], [class*="article"]').each((index, element) => {
        if (articles.length >= limit) return false;

        const $element = $(element);
        const title = $element.find('h1, h2, h3').first().text().trim();
        const content = $element.find('p').first().text().trim();
        
        if (title && content) {
          articles.push({
            title,
            content: content.substring(0, 500) + '...',
            author: 'BeyondChats Team',
            publishedDate: new Date(),
            sourceUrl: BEYONDCHATS_BLOG_URL
          });
        }
      });
    }

    console.log(`Scraped ${articles.length} articles from BeyondChats`);
    return articles.slice(0, limit);
  } catch (error) {
    console.error('Scraping error:', error.message);
    throw new Error(`Failed to scrape articles: ${error.message}`);
  }
};

/**
 * Scrape content from a specific URL
 * @param {string} url - URL to scrape
 * @returns {Promise<Object>} Scraped content
 */
export const scrapeArticleContent = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(html);
    
    $('script, style, nav, footer, header, aside, .advertisement').remove();
    
    const title = $('h1, .title, .post-title, article h1').first().text().trim();
    const content = $('article, .post-content, .content, main, .entry-content')
      .first()
      .find('p')
      .map((i, el) => $(el).text().trim())
      .get()
      .join('\n\n');

    return {
      title: title || 'Untitled',
      content: content || 'No content found',
      source: url
    };
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return null;
  }
};
