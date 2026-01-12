import express from "express";
import axios from "axios";

const router = express.Router();

/**
 * GET /api/search?q=term&engine=google|bing|duckduckgo
 */
router.get("/", async (req, res) => {
  const { q, engine } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Query required" });
  }

  try {
    let results = [];

    // 🔎 GOOGLE
    if (engine === "google") {
      const googleRes = await axios.get(
        "https://www.googleapis.com/customsearch/v1",
        {
          params: {
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CX,
            q,
          },
        }
      );

      results = googleRes.data.items.map(item => ({
        title: item.title,
        url: item.link,
        snippet: item.snippet,
        source: "Google",
      }));
    }

    // 🔎 BING
    else if (engine === "bing") {
      const bingRes = await axios.get(
        "https://api.bing.microsoft.com/v7.0/search",
        {
          params: { q },
          headers: {
            "Ocp-Apim-Subscription-Key": process.env.BING_API_KEY,
          },
        }
      );

      results = bingRes.data.webPages.value.map(item => ({
        title: item.name,
        url: item.url,
        snippet: item.snippet,
        source: "Bing",
      }));
    }

    // 🔎 DUCKDUCKGO
    else if (engine === "duckduckgo") {
      const ddgRes = await axios.get(
        "https://api.duckduckgo.com/",
        {
          params: {
            q,
            format: "json",
            no_redirect: 1,
            no_html: 1,
          },
        }
      );

      results = ddgRes.data.RelatedTopics
        .filter(r => r.Text && r.FirstURL)
        .map(r => ({
          title: r.Text,
          url: r.FirstURL,
          snippet: r.Text,
          source: "DuckDuckGo",
        }));
    }

    else {
      return res.status(400).json({ error: "Invalid search engine" });
    }

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Search failed" });
  }
});

export default router;
