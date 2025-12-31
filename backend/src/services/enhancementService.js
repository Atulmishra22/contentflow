import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const AIPIPE_API_URL = 'https://aipipe.org/geminiv1beta/models/gemini-2.5-flash:generateContent';
const AIPIPE_TOKEN = process.env.AIPIPE_KEY;

export async function searchGoogle(query, limit = 2) {
  try {
    const response = await axios.get('https://www.searchapi.io/api/v1/search', {
      params: {
        engine: 'google',
        q: query,
        api_key: process.env.SEARCHAPI_KEY,
        num: limit,
      },
    });

    const links = response.data.organic_results?.slice(0, limit).map(result => ({
      title: result.title,
      url: result.link,
      snippet: result.snippet,
    })) || [];

    console.log(`   📊 SearchAPI returned ${response.data.organic_results?.length || 0} results, using ${links.length}`);
    
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

    $('script', 'style, nav, header, footer, iframe, noscript').remove();

    const content = 
      $('article').text() ||
      $('main').text() ||
      $('.content').text() ||
      $('.post-content').text() ||
      $('body').text();

    return content.trim().slice(0, 5000);
  } catch (error) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return '';
  }
}

export async function enhanceArticle(originalArticle, references) {
  try {
    const targetWords = 50;
    
    const prompt = `You are an expert technical content writer. Create a very concise article.

ORIGINAL ARTICLE:
Title: ${originalArticle.title}
Content: ${originalArticle.content}

REFERENCE MATERIALS:
${references.map((ref, i) => `
[Reference ${i + 1}] ${ref.title}
Source: ${ref.url}
Content: ${ref.content.substring(0, 500)}
`).join('\n')}

REQUIREMENTS:
1. Write EXACTLY ${targetWords} words - no more, no less
2. Make it professional and informative
3. Use key insights from references
4. Write 1-2 paragraphs maximum
5. NO introductions like "Here is..." - just start with the content

Write the ${targetWords}-word article now:

`;

    const response = await axios.post(
      AIPIPE_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${AIPIPE_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const enhancedContent = response.data.candidates[0].content.parts[0].text;
    
    console.log(`   📝 Generated ${enhancedContent.split(/\s+/).length} words`);

    return enhancedContent;
  } catch (error) {
    console.error('AIPipe API error:', error.response?.data || error.message);
    throw error;
  }
}

export async function enhanceArticlePipeline(article) {
  console.log(`\nEnhancing: "${article.title}"`);

  console.log('   Searching Google...');
  const searchResults = await searchGoogle(article.title, 2);
  
  if (searchResults.length === 0) {
    console.log('   WARNING: No search results found, skipping...');
    return null;
  }

  console.log(`   Found ${searchResults.length} references`);

  console.log('   Scraping reference content...');
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
    console.log('   WARNING: No content scraped, skipping...');
    return null;
  }

  console.log(`   Scraped ${references.length} references`);

  console.log('   Enhancing with Gemini AI...');
  const enhancedContent = await enhanceArticle(article, references);

  console.log('   Enhancement complete!');

  return {
    enhancedContent,
    references: references.map(ref => ({
      title: ref.title,
      url: ref.url,
    })),
  };
}
