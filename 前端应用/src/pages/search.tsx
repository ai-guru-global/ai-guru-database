import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, FileText, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Fuse from "fuse.js";
import { allDocs } from "@/data/docMap";

// Build search index from the shared docMap
const searchIndex = allDocs.map((doc) => ({
  title: doc.title,
  slug: `${doc.categoryId}-${doc.slug}`,
  excerpt: doc.description,
  category: doc.category,
}));

const fuseOptions = {
  keys: ["title", "excerpt", "category"],
  threshold: 0.3,
  includeScore: true,
};

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  const fuse = useMemo(() => new Fuse(searchIndex, fuseOptions), []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) {
        setSearchParams({ q: query });
      } else {
        setSearchParams({});
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, setSearchParams]);

  const results = useMemo(() => {
    if (!debouncedQuery) return [];
    return fuse.search(debouncedQuery).slice(0, 10);
  }, [debouncedQuery, fuse]);

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Search Documentation</h1>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for topics, concepts, or documentation..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {debouncedQuery && (
          <div className="mb-4 text-sm text-muted-foreground">
            Found {results.length} result{results.length !== 1 ? "s" : ""} for "
            {debouncedQuery}"
          </div>
        )}

        <div className="space-y-4">
          {results.map(({ item, score }) => (
            <Link key={item.slug} to={`/docs/${item.slug}`}>
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {item.excerpt}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Relevance: {((1 - (score || 0)) * 100).toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {!debouncedQuery && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Enter a search query to find documentation</p>
            <p className="text-sm mt-2">Try searching for "transformer", "fine-tuning", or "ethics"</p>
          </div>
        )}

        {debouncedQuery && results.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No results found for "{debouncedQuery}"</p>
            <p className="text-sm mt-2">Try different keywords or check your spelling</p>
          </div>
        )}
      </div>
    </div>
  );
}
