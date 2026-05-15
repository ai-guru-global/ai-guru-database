import { useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { findDocByFullSlug } from "@/data/docMap";
import { Button } from "@/components/ui/button";

export function DocsPage() {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const mkdocsUrl = useMemo(() => {
    const origin = window.location.origin;
    if (!slug) return `${origin}/mkdocs/`;
    const doc = findDocByFullSlug(slug);
    if (!doc) return `${origin}/mkdocs/`;
    const path = doc.filePath.replace(/\.md$/i, "");
    return `${origin}/mkdocs/${path}/`;
  }, [slug]);

  // Open immediately during render (before paint), no useEffect delay
  const openedRef = useRef(false);
  if (!openedRef.current) {
    openedRef.current = true;
    window.open(mkdocsUrl, "_blank");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Documentation opened in a new tab
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          The documentation has been opened in a new browser tab.
          If it did not open automatically, click the button below.
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => window.open(mkdocsUrl, "_blank")}
        className="gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        Open Documentation
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="text-muted-foreground"
      >
        Back to Home
      </Button>
    </div>
  );
}
