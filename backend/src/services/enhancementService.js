import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function searchGoogle(query, limit = 2) {
  try {
    const response = await axios.get('https://www.searchapi.io/api/v1/search', {
      params: {
        engine: 'google',
        q: query,
        api_key: process.env.SERPAPI_KEY,
        num: limit,
      },
    });

    const links = response.data.organic_results?.slice(0, limit).map(result => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
    })) || [];

    return links;
  } catch (error) {
    console.error('❌ SearchAPI error:', error.message);
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
    const targetWords = Math.max(500, originalArticle.wordCount * 10);
    
    const prompt = `You are an expert technical content writer tasked with creating a comprehensive, in-depth article.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

REFERENCE MATERIALS FOR RESEARCH:
${references.map((ref, i) => `
[Reference ${i + 1}] ${ref.title}
Source: ${ref.url}
Content: ${ref.content.substring(0, 3000)}
`).join('\n')}

WRITING REQUIREMENTS:
1. Create a DETAILED, COMPREHENSIVE article of approximately ${targetWords} words
2. Write in a professional, engaging, and informative style
3. Include specific examples, statistics, and insights from the reference materials
4. Structure with clear paragraphs - write at least 5-8 substantial paragraphs
5. Expand on key concepts with detailed explanations
6. Use concrete examples and real-world applications
7. Maintain factual accuracy using the provided references
8. Write naturally - NO meta-commentary, NO introductions like "Here is...", just start with the content

Begin writing the enhanced article now (minimum ${targetWords} words):

`;

    const result = await model.generateContent(prompt);
    const enhancedContent = result.response.text();
    
    console.log(`   📝 Generated ${enhancedContent.split(/\s+/).length} words`);

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
