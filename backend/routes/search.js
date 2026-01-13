import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CX = process.env.GOOGLE_CX;

router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query required' });
    }

    // If Google API keys are not configured, return mock data
    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      console.log('Using mock search data (Google API keys not configured)');
      
      // Return mock search results
      return res.json({
        kind: "customsearch#search",
        url: {
          type: "application/json",
          template: "https://www.googleapis.com/customsearch/v1?q={searchTerms}&num={count?}&start={startIndex?}&lr={language?}&safe={safe?}&cx={cx?}&cref={cref?}&sort={sort?}&filter={filter?}&gl={gl?}&cr={cr?}&googlehost={googleHost?}&c2coff={disableCnTwTranslation?}&hq={hq?}&hl={hl?}&siteSearch={siteSearch?}&siteSearchFilter={siteSearchFilter?}&exactTerms={exactTerms?}&excludeTerms={excludeTerms?}&linkSite={linkSite?}&orTerms={orTerms?}&relatedSite={relatedSite?}&dateRestrict={dateRestrict?}&lowRange={lowRange?}&highRange={highRange?}&searchType={searchType?}&fileType={fileType?}&rights={rights?}&imgSize={imgSize?}&imgType={imgType?}&imgColorType={imgColorType?}&imgDominantColor={imgDominantColor?}&alt=json"
        },
        queries: {
          request: [{
            title: "Google Custom Search - " + q,
            totalResults: "1000",
            searchTerms: q,
            count: 10,
            startIndex: 1,
            inputEncoding: "utf8",
            outputEncoding: "utf8",
            safe: "off",
            cx: "demo-cx"
          }]
        },
        context: {
          title: "Demo Search"
        },
        searchInformation: {
          searchTime: 0.5,
          formattedSearchTime: "0.50",
          totalResults: "1000",
          formattedTotalResults: "1,000"
        },
        items: [
          {
            kind: "customsearch#result",
            title: `Search Result for: ${q}`,
            htmlTitle: `<b>${q}</b> - Search Result`,
            link: `https://example.com/search?q=${encodeURIComponent(q)}`,
            displayLink: "example.com",
            snippet: `This is a mock search result for "${q}". To get real results, add GOOGLE_API_KEY and GOOGLE_CX to your .env file.`,
            htmlSnippet: `This is a mock search result for <b>${q}</b>. To get real results, add GOOGLE_API_KEY and GOOGLE_CX to your .env file.`,
            cacheId: "demo123",
            formattedUrl: `https://example.com/search?q=${encodeURIComponent(q)}`,
            htmlFormattedUrl: `https://example.com/search?q=${encodeURIComponent(q)}`
          },
          {
            kind: "customsearch#result",
            title: `How to configure Google Search API`,
            htmlTitle: `How to configure <b>Google Search API</b>`,
            link: "https://developers.google.com/custom-search/v1/overview",
            displayLink: "developers.google.com",
            snippet: "Learn how to set up Google Custom Search API for real search results.",
            htmlSnippet: "Learn how to set up Google Custom Search API for real search results.",
            cacheId: "demo456",
            formattedUrl: "https://developers.google.com/custom-search/v1/overview",
            htmlFormattedUrl: "https://developers.google.com/custom-search/v1/overview"
          }
        ]
      });
    }

    // If API keys are configured, make real Google API call
    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: GOOGLE_API_KEY,
        cx: GOOGLE_CX,
        q: q,
        num: 10
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ 
      error: 'Search failed', 
      details: error.message 
    });
  }
});

export default router;