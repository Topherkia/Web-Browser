import { Search } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { useEffect, useState } from 'react';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  source: string;
}

interface SearchResultsProps {
  query: string;
  onNavigate: (url: string) => void;
}

export function SearchResults({ query, onNavigate }: SearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [engine, setEngine] = useState<'google' | 'bing' | 'duckduckgo'>('google');

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}&engine=${engine}`
        );

        const data = await res.json();

        // Map backend response → UI format
        const mapped = data.map((r: any) => ({
          title: r.title,
          url: r.url,
          description: r.snippet,
          source: r.source,
        }));

        setResults(mapped);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      }

      setLoading(false);
    };

    fetchResults();
  }, [query, engine]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-gray-500" />
        <div>
          <p className="text-sm text-gray-500">Search results for</p>
          <h2 className="text-xl">{query}</h2>
        </div>

        {/* Search engine selector */}
        <select
          value={engine}
          onChange={(e) => setEngine(e.target.value as any)}
          className="ml-auto border rounded px-2 py-1 text-sm"
        >
          <option value="google">Google</option>
          <option value="bing">Bing</option>
          <option value="duckduckgo">DuckDuckGo</option>
        </select>
      </div>

      {loading && <p className="text-gray-500">Searching...</p>}

      <div className="space-y-3">
        {!loading &&
          results.map((result, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => onNavigate(result.url)}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                  {result.title.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-blue-600 hover:underline mb-1">
                    {result.title}
                  </h3>
                  <p className="text-sm text-green-700 mb-1">{result.url}</p>
                  <p className="text-sm text-gray-600">
                    {result.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Source: {result.source}
                  </p>
                </div>
              </div>
            </Card>
          ))}
      </div>

      {!loading && results.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No results found for "{query}"
          </p>
        </div>
      )}
    </div>
  );
}
