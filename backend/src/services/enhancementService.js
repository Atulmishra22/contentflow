import { GoogleGenerativeAI } from '@google/generative-ai';
import { getJson } from 'serpapi';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

export async function searchGoogle(query, limit = 2) {
  try {
    const results = await getJson({
      engine: 'google',
      q: query,
      api_key: process.env.SERPAPI_KEY,
      num: limit,
    });

    const links = results.organic_results?.slice(0, limit).map(result => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
    })) || [];

    return links;
  } catch (error) {
    console.error('❌ SerpAPI error:', error.message);
    return [];
  }
}

export async function scrapeContent(url) {
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);

    // Remove unwanted elements
    $('script, style, nav, header, footer, iframe, noscript').remove();

    // Try to find main content
    const content = 
      $('article').text() ||
      $('main').text() ||
      $('.content').text() ||
      $('.post-content').text() ||
      $('body').text();

    return content.trim().slice(0, 5000); // Limit to 5000 chars
  } catch (error) {
    console.error(`❌ Failed to scrape ${url}:`, error.message);
    return '';
  }
}

export async function enhanceArticle(originalArticle, references) {
  try {
    const prompt = `
You are an expert content writer. Your task is to rewrite and enhance the following article using the reference materials provided.

**Original Article:**
Title: ${originalArticle.title}
Content: ${originalArticle.content}

**Reference Materials:**
${references.map((ref, i) => `
Reference ${i + 1} (${ref.title}):
${ref.content}
`).join('\n')}

**Instructions:**
1. Rewrite the original article by incorporating insights from the reference materials
2. Maintain the core message but enhance it with new information
3. Make it more comprehensive, accurate, and engaging
4. Keep the tone professional yet accessible
5. Aim for ${Math.floor(originalArticle.wordCount * 1.5)} words
6. Return ONLY the enhanced article content without any meta-commentary

Enhanced Article:`;

    const result = await model.generateContent(prompt);
    const enhancedContent = result.response.text();

    return enhancedContent;
  } catch (error) {
    console.error('❌ Gemini AI error:', error.message);
    throw error;
  }
}

export async function enhanceArticlePipeline(article) {
  console.log(`\n🔄 Enhancing: "${article.title}"`);

  // Step 1: Search Google for top 2 results
  console.log('   🔍 Searching Google...');
  const searchResults = await searchGoogle(article.title, 2);
  
  if (searchResults.length === 0) {
    console.log('   ⚠️  No search results found, skipping...');
    return null;
  }

  console.log(`   ✅ Found ${searchResults.length} references`);

  // Step 2: Scrape content from each result
  console.log('   📡 Scraping reference content...');
  const references = [];
  
  for (const result of searchResults) {
    const content = await scrapeContent(result.url);
    if (content) {
      references.push({
        title: result.title,
        url: result.url,
        content: content,
      });
    }
  }

  if (references.length === 0) {
    console.log('   ⚠️  No content scraped, skipping...');
    return null;
  }

  console.log(`   ✅ Scraped ${references.length} references`);

  // Step 3: Enhance with AI
  console.log('   🤖 Enhancing with Gemini AI...');
  const enhancedContent = await enhanceArticle(article, references);

  console.log('   ✅ Enhancement complete!');

  return {
    enhancedContent,
    references: references.map(ref => ({
      title: ref.title,
      url: ref.url,
    })),
  };
}
