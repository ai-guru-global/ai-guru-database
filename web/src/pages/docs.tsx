import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Fuse from "fuse.js";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import {
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpenText,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  FolderOpen,
  FolderTree,
  History,
  Menu,
  Search,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  allDocs,
  docSections,
  findDocByFullSlug,
  getNavigation,
  type DocEntry,
  type DocSection,
} from "@/data/docMap";

import {
  analyzeDocumentCoreTopics,
  buildCoreTopicMap,
  DEFAULT_CORE_TOPIC_DEFINITIONS,
  type CoreTopicMatch,
} from "@/features/docs/core-topics";
import { cn } from "@/utils/cn";

type CollectionFilter = "all" | "favorites" | "recent";

interface TreeNode {
  id: string;
  label: string;
  type: "section" | "folder" | "doc";
  children: TreeNode[];
  doc?: DocEntry;
  fullSlug?: string;
  count: number;
}

interface IndexedDoc {
  doc: DocEntry;
  fullSlug: string;
  href: string;
  topics: CoreTopicMatch[];
  topicIds: string[];
  topicLabels: string[];
}

const STORAGE_KEYS = {
  favorites: "docs-page:favorites",
  recents: "docs-page:recents",
  lastVisited: "docs-page:last-visited",
  expanded: "docs-page:expanded",
  scroll: "docs-page:scroll",
} as const;

const MAX_RECENT_DOCS = 8;
const DEFAULT_EXPANDED_SECTIONS: string[] = [];

const contentCache = new Map<string, string>();
const contentRequests = new Map<string, Promise<string>>();

function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function formatSegmentLabel(segment: string) {
  return segment
    .replace(/\.md$/i, "")
    .replace(/^[0-9]+_?/, "")
    .replace(/[_-]+/g, " ")
    .trim();
}

function getDocFullSlug(doc: DocEntry) {
  return `${doc.categoryId}-${doc.slug}`;
}

function getDocHref(fullSlug: string) {
  return `/docs/${fullSlug}`;
}

function sortTree(nodes: TreeNode[]) {
  nodes.sort((left, right) => {
    if (left.type !== right.type) {
      if (left.type === "doc") return 1;
      if (right.type === "doc") return -1;
    }

    return left.label.localeCompare(right.label, "zh-Hans-CN", { sensitivity: "base" });
  });

  nodes.forEach((node) => {
    if (node.children.length > 0) {
      sortTree(node.children);
      node.count =
        node.type === "doc"
          ? 1
          : node.children.reduce((total, child) => total + child.count, 0);
    }
  });

  return nodes;
}

function buildSectionTree(section: DocSection): TreeNode {
  const root: TreeNode = {
    id: `section:${section.id}`,
    label: section.title,
    type: "section",
    children: [],
    count: section.docs.length,
  };

  section.docs.forEach((doc) => {
    const folders = doc.filePath.split("/").slice(1, -1);
    let cursor = root;

    folders.forEach((folder, index) => {
      const folderId = `${section.id}:${folders.slice(0, index + 1).join("/")}`;
      let next = cursor.children.find((node) => node.id === folderId);

      if (!next) {
        next = {
          id: folderId,
          label: formatSegmentLabel(folder),
          type: "folder",
          children: [],
          count: 0,
        };
        cursor.children.push(next);
      }

      cursor = next;
    });

    cursor.children.push({
      id: `doc:${getDocFullSlug(doc)}`,
      label: doc.title,
      type: "doc",
      children: [],
      doc,
      fullSlug: getDocFullSlug(doc),
      count: 1,
    });
  });

  root.children = sortTree(root.children);
  root.count = root.children.reduce((total, child) => total + child.count, 0);
  return root;
}

function collectExpandedKeys(node: TreeNode): string[] {
  if (node.type === "doc") {
    return [];
  }

  return [node.id, ...node.children.flatMap(collectExpandedKeys)];
}

function filterTree(node: TreeNode, visibleSlugs: Set<string>): TreeNode | null {
  if (node.type === "doc") {
    return node.fullSlug && visibleSlugs.has(node.fullSlug) ? node : null;
  }

  const children = node.children
    .map((child) => filterTree(child, visibleSlugs))
    .filter((child): child is TreeNode => Boolean(child));

  if (children.length === 0) {
    return null;
  }

  return {
    ...node,
    children,
    count: children.reduce((total, child) => total + child.count, 0),
  };
}

function getExpandedPath(doc: DocEntry) {
  const folders = doc.filePath.split("/").slice(1, -1);
  const keys = [`section:${doc.categoryId}`];

  folders.forEach((_, index) => {
    keys.push(`${doc.categoryId}:${folders.slice(0, index + 1).join("/")}`);
  });

  return keys;
}

function updateRecentDocs(current: string[], nextSlug: string) {
  return [nextSlug, ...current.filter((slug) => slug !== nextSlug)].slice(
    0,
    MAX_RECENT_DOCS
  );
}

async function loadDocContent(filePath: string) {
  if (contentCache.has(filePath)) {
    return contentCache.get(filePath)!;
  }

  if (contentRequests.has(filePath)) {
    return contentRequests.get(filePath)!;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const request = fetch(`${base}/docs-content/${encodeURI(filePath)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load document: ${response.status}`);
      }

      return response.text();
    })
    .then((text) => {
      const trimmed = text.trim().toLowerCase();
      if (trimmed.startsWith("<!doctype") || trimmed.startsWith("<html")) {
        throw new Error("Received HTML instead of markdown content");
      }

      contentCache.set(filePath, text);
      contentRequests.delete(filePath);
      return text;
    })
    .catch((error) => {
      contentRequests.delete(filePath);
      throw error;
    });

  contentRequests.set(filePath, request);
  return request;
}

interface TreeBranchProps {
  node: TreeNode;
  depth: number;
  expandedKeys: Set<string>;
  activeSlug: string | null;
  onToggle: (key: string) => void;
  onSelect: (fullSlug: string) => void;
}

function TreeBranch({
  node,
  depth,
  expandedKeys,
  activeSlug,
  onToggle,
  onSelect,
}: TreeBranchProps) {
  if (node.type === "doc" && node.fullSlug) {
    const active = node.fullSlug === activeSlug;

    return (
      <div className="space-y-1">
        <button
          type="button"
          onClick={() => onSelect(node.fullSlug!)}
          className={cn(
            "flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
            active
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
          style={{ paddingLeft: `${depth * 14 + 12}px` }}
        >
          <FileText className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="line-clamp-2">{node.label}</span>
        </button>
      </div>
    );
  }

  const expanded = expandedKeys.has(node.id);
  const Icon = node.type === "section" ? FolderTree : FolderOpen;

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => onToggle(node.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors",
          node.type === "section"
            ? "bg-background/80 font-medium text-foreground hover:bg-muted"
            : "text-foreground/80 hover:bg-muted/60"
        )}
        style={{ paddingLeft: `${depth * 14 + 12}px` }}
      >
        {expanded ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate">{node.label}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
          {node.count}
        </span>
      </button>

      {expanded && (
        <div className="space-y-1">
          {node.children.map((child) => (
            <TreeBranch
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedKeys={expandedKeys}
              activeSlug={activeSlug}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocsPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const persistTimerRef = useRef<number | null>(null);
  const scrollMapRef = useRef<Record<string, number>>(
    readStoredValue<Record<string, number>>(STORAGE_KEYS.scroll, {})
  );

  const [favorites, setFavorites] = useState<string[]>(
    readStoredValue<string[]>(STORAGE_KEYS.favorites, [])
  );
  const [recents, setRecents] = useState<string[]>(
    readStoredValue<string[]>(STORAGE_KEYS.recents, [])
  );
  const [expandedKeys, setExpandedKeys] = useState<string[]>(
    readStoredValue<string[]>(STORAGE_KEYS.expanded, DEFAULT_EXPANDED_SECTIONS)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState<CollectionFilter>("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tree = useMemo(() => docSections.map(buildSectionTree), []);
  const topicDefinitions = useMemo(() => DEFAULT_CORE_TOPIC_DEFINITIONS, []);
  const topicMap = useMemo(
    () =>
      buildCoreTopicMap(allDocs, {
        definitions: topicDefinitions,
        maxTopicsPerDoc: 4,
      }),
    [topicDefinitions]
  );
  const docsIndex = useMemo<IndexedDoc[]>(
    () =>
      allDocs.map((doc) => {
        const fullSlug = getDocFullSlug(doc);
        const topics = topicMap[fullSlug] ?? [];
        return {
          doc,
          fullSlug,
          href: getDocHref(fullSlug),
          topics,
          topicIds: topics.map((topic) => topic.id),
          topicLabels: topics.map((topic) => topic.label),
        };
      }),
    [topicMap]
  );

  const docLookup = useMemo(
    () => new Map(docsIndex.map((entry) => [entry.fullSlug, entry])),
    [docsIndex]
  );

  const selectedDoc = slug ? findDocByFullSlug(slug) : undefined;
  const selectedSlug = selectedDoc ? getDocFullSlug(selectedDoc) : null;
  const selectedSection = selectedDoc
    ? docSections.find((section) => section.id === selectedDoc.categoryId)
    : undefined;
  const selectedFolders = selectedDoc
    ? selectedDoc.filePath.split("/").slice(1, -1).map(formatSegmentLabel)
    : [];

  const selectedTopicMatches = useMemo(
    () =>
      selectedDoc
        ? analyzeDocumentCoreTopics(selectedDoc, {
            definitions: topicDefinitions,
            content,
            maxTopics: 4,
          })
        : [],
    [content, selectedDoc, topicDefinitions]
  );

  const fuse = useMemo(
    () =>
      new Fuse(docsIndex, {
        threshold: 0.3,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          { name: "doc.title", weight: 0.45 },
          { name: "doc.description", weight: 0.25 },
          { name: "doc.category", weight: 0.15 },
          { name: "doc.filePath", weight: 0.05 },
          { name: "topicLabels", weight: 0.1 },
        ],
      }),
    [docsIndex]
  );

  const filteredDocs = useMemo(() => {
    let source = docsIndex;

    if (activeCollection === "favorites") {
      source = source.filter((entry) => favorites.includes(entry.fullSlug));
    } else if (activeCollection === "recent") {
      source = recents
        .map((recentSlug) => docLookup.get(recentSlug))
        .filter((entry): entry is IndexedDoc => Boolean(entry));
    }

    if (!searchQuery.trim()) {
      return source;
    }

    const matched = new Set(
      fuse.search(searchQuery.trim()).map((result) => result.item.fullSlug)
    );

    return source.filter((entry) => matched.has(entry.fullSlug));
  }, [activeCollection, docLookup, docsIndex, favorites, fuse, recents, searchQuery]);

  const visibleSlugs = useMemo(
    () => new Set(filteredDocs.map((entry) => entry.fullSlug)),
    [filteredDocs]
  );

  const filteredTree = useMemo(
    () =>
      tree
        .map((node) => filterTree(node, visibleSlugs))
        .filter((node): node is TreeNode => Boolean(node)),
    [tree, visibleSlugs]
  );

  const effectiveExpandedKeys = useMemo(() => {
    const baseKeys = new Set(expandedKeys);

    if (selectedDoc) {
      getExpandedPath(selectedDoc).forEach((key) => baseKeys.add(key));
    }

    if (searchQuery.trim() || activeCollection !== "all") {
      filteredTree.forEach((node) => {
        collectExpandedKeys(node).forEach((key) => baseKeys.add(key));
      });
    }

    return baseKeys;
  }, [activeCollection, expandedKeys, filteredTree, searchQuery, selectedDoc]);

  const favoritesDocs = favorites
    .map((favoriteSlug) => docLookup.get(favoriteSlug))
    .filter((entry): entry is IndexedDoc => Boolean(entry))
    .slice(0, 6);

  const recentDocs = recents
    .map((recentSlug) => docLookup.get(recentSlug))
    .filter((entry): entry is IndexedDoc => Boolean(entry))
    .slice(0, 6);

  const resumeEntry = recents
    .map((recentSlug) => docLookup.get(recentSlug))
    .find((entry) => entry && entry.fullSlug !== selectedSlug);

  const nav = selectedSlug
    ? getNavigation(selectedSlug)
    : { prev: undefined, next: undefined };
  const prevHref = nav.prev ? getDocHref(getDocFullSlug(nav.prev)) : null;
  const nextHref = nav.next ? getDocHref(getDocFullSlug(nav.next)) : null;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 220));

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.recents, recents);
  }, [recents]);

  useEffect(() => {
    writeStoredValue(STORAGE_KEYS.expanded, expandedKeys);
  }, [expandedKeys]);

  useEffect(() => {
    if (!slug) {
      const lastVisited = readStoredValue<string | null>(STORAGE_KEYS.lastVisited, null);
      
      const readmeDoc = docsIndex.find((entry) => 
        entry.doc.filePath.toLowerCase().endsWith('readme.md')
      );

      const initialSlug =
        (lastVisited && docLookup.has(lastVisited) && lastVisited) ||
        (readmeDoc && readmeDoc.fullSlug) ||
        docsIndex[0]?.fullSlug;

      if (initialSlug) {
        navigate(getDocHref(initialSlug), { replace: true });
      }
    }
  }, [docLookup, docsIndex, navigate, slug]);

  useEffect(() => {
    if (!selectedDoc || !selectedSlug) {
      setContent("");
      setLoading(false);
      setError(slug ? "未找到对应文档，请从目录中重新选择。" : null);
      return;
    }

    let cancelled = false;
    setError(null);
    setLoading(true);

    loadDocContent(selectedDoc.filePath)
      .then((nextContent) => {
        if (cancelled) return;
        setContent(nextContent);
        setLoading(false);
      })
      .catch((loadError) => {
        if (cancelled) return;
        console.error(loadError);
        setError(`无法加载文档内容：${selectedDoc.filePath}`);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDoc, selectedSlug, slug]);

  useEffect(() => {
    if (!selectedDoc || !selectedSlug) {
      return;
    }

    setExpandedKeys((current) =>
      Array.from(new Set([...current, ...getExpandedPath(selectedDoc)]))
    );
    setRecents((current) => updateRecentDocs(current, selectedSlug));
    writeStoredValue(STORAGE_KEYS.lastVisited, selectedSlug);
    setMobileNavOpen(false);
  }, [selectedDoc, selectedSlug]);

  useEffect(() => {
    if (!selectedSlug || loading || error) {
      return;
    }

    const nextPosition = scrollMapRef.current[selectedSlug] ?? 0;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: nextPosition, behavior: "auto" });
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [error, loading, selectedSlug]);

  useEffect(() => {
    if (!selectedSlug) {
      return;
    }

    const scrollMap = scrollMapRef.current;

    const handleScroll = () => {
      scrollMap[selectedSlug] = window.scrollY;

      if (persistTimerRef.current) {
        window.clearTimeout(persistTimerRef.current);
      }

      persistTimerRef.current = window.setTimeout(() => {
        writeStoredValue(STORAGE_KEYS.scroll, scrollMap);
      }, 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (persistTimerRef.current) {
        window.clearTimeout(persistTimerRef.current);
      }

      writeStoredValue(STORAGE_KEYS.scroll, scrollMap);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedSlug]);

  const handleSelectDoc = (fullSlug: string) => {
    if (fullSlug === selectedSlug) {
      return;
    }

    navigate(getDocHref(fullSlug));
  };

  const handleToggleFavorite = () => {
    if (!selectedSlug) {
      return;
    }

    setFavorites((current) =>
      current.includes(selectedSlug)
        ? current.filter((slugItem) => slugItem !== selectedSlug)
        : [selectedSlug, ...current].slice(0, MAX_RECENT_DOCS)
    );
  };

  const sidebarContent = (
    <Card className="overflow-hidden border-border/70 bg-background/85 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="border-b border-border/60 px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Navigation
            </p>
            <h2 className="text-lg font-semibold">文档目录</h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索标题、描述、标签"
            className="h-11 rounded-2xl border-border/70 bg-background pl-10"
          />
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { key: "all", label: "全部" },
            { key: "favorites", label: "收藏" },
            { key: "recent", label: "最近" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveCollection(item.key as CollectionFilter)}
              className={cn(
                "rounded-xl border px-3 py-2 text-sm transition-colors",
                activeCollection === item.key
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>


      </div>

      <div className="border-b border-border/60 px-4 py-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>筛选结果</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {filteredDocs.length} / {allDocs.length}
          </span>
        </div>
        {searchQuery.trim() && filteredDocs.length > 0 && (
          <div className="mt-3 space-y-2">
            {filteredDocs.slice(0, 4).map((entry) => (
              <button
                key={entry.fullSlug}
                type="button"
                onClick={() => handleSelectDoc(entry.fullSlug)}
                className="flex w-full items-start gap-2 rounded-xl bg-muted/40 px-3 py-2 text-left transition-colors hover:bg-muted"
              >
                <BookMarked className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {entry.doc.title}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.doc.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-h-[calc(100vh-19rem)] overflow-y-auto px-3 py-3">
        {filteredTree.length > 0 ? (
          <div className="space-y-2">
            {filteredTree.map((node) => (
              <TreeBranch
                key={node.id}
                node={node}
                depth={0}
                expandedKeys={effectiveExpandedKeys}
                activeSlug={selectedSlug}
                onToggle={(key) =>
                  setExpandedKeys((current) =>
                    current.includes(key)
                      ? current.filter((item) => item !== key)
                      : [...current, key]
                  )
                }
                onSelect={handleSelectDoc}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/80 px-4 py-8 text-center text-sm text-muted-foreground">
            没有匹配的文档，试试换个关键词或清空标签筛选。
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.09),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(255,255,255,1))] py-6 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_24%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(2,6,23,1))]">
      <div className="mx-auto max-w-[1580px] px-4 lg:px-6">
        <Card className="mb-6 overflow-hidden border-border/70 bg-background/90 shadow-[0_30px_100px_-40px_rgba(15,23,42,0.5)] backdrop-blur">
          <CardContent className="p-6">
            <div className="relative overflow-hidden rounded-[28px] border border-border/60 bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(248,250,252,0.9))] px-6 py-7 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(2,6,23,0.92))]">
              <div className="pointer-events-none absolute inset-y-0 right-0 w-[38%] bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.22),transparent_48%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_35%)]" />
              <div className="pointer-events-none absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

              <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-4xl">
                  <div className="mb-4 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-sky-700/80 dark:text-sky-300/80">
                    <Sparkles className="h-4 w-4" />
                    2026.04 更新
                  </div>

                  <h1
                    className="text-3xl font-semibold tracking-[0.03em] text-foreground md:text-5xl"
                    style={{
                      fontFamily:
                        '"Avenir Next Condensed", "Baskerville", "Iowan Old Style", Georgia, serif',
                    }}
                  >
                    AI 全栈自助学习 & 语料中心
                  </h1>

                  <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    覆盖大模型训练、推理优化、Agent 开发、MLOps、云原生部署等 12
                    大技术栈，已收录 80+ 官方与社区精选文档，支持一键定位、收藏归档与阅读位置记忆。
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {[
                      "LLM Training",
                      "Inference",
                      "Agent Engineering",
                      "RAG Systems",
                      "MLOps",
                      "Cloud Native",
                    ].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs tracking-[0.08em] text-muted-foreground shadow-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:w-[420px] xl:grid-cols-2">
                  <div className="rounded-3xl border border-border/70 bg-background/80 px-4 py-4 shadow-sm flex flex-col justify-center">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      Words
                    </div>
                    <div className="mt-2 text-3xl font-semibold">
                      383W+
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      沉淀系统性 AI 知识与核心语料
                    </div>
                  </div>
                  <div className="rounded-3xl border border-border/70 bg-background/80 px-4 py-4 shadow-sm flex flex-col justify-center">
                    <div className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      Core Topics
                    </div>
                    <div className="mt-2 text-3xl font-semibold">
                      258+
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
                      提炼高频领域与工程落地痛点
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
          <Button
            type="button"
            variant="outline"
            className="rounded-2xl"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="mr-2 h-4 w-4" />
            打开目录
          </Button>

          {resumeEntry && (
            <Button
              type="button"
              variant="ghost"
              className="rounded-2xl text-muted-foreground"
              onClick={() => handleSelectDoc(resumeEntry.fullSlug)}
            >
              <History className="mr-2 h-4 w-4" />
              继续阅读
            </Button>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_280px]">
          <aside className="hidden xl:block xl:sticky xl:top-20 xl:self-start">
            {sidebarContent}
          </aside>

          <main className="min-w-0">
            <Card className="overflow-hidden border-border/70 bg-background/90 shadow-[0_28px_100px_-42px_rgba(15,23,42,0.45)] backdrop-blur">
              <CardContent className="p-0">
                <div className="border-b border-border/60 px-5 py-5 md:px-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <Link to="/docs" className="transition-colors hover:text-foreground">
                      文档中心
                    </Link>
                    {selectedSection && (
                      <>
                        <ChevronRight className="h-4 w-4" />
                        <span>{selectedSection.title}</span>
                      </>
                    )}
                    {selectedFolders.map((folder) => (
                      <div key={folder} className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4" />
                        <span>{folder}</span>
                      </div>
                    ))}
                    {selectedDoc && (
                      <div className="flex items-center gap-2 text-foreground">
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{selectedDoc.title}</span>
                      </div>
                    )}
                  </div>

                  {selectedDoc ? (
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            {selectedDoc.category}
                          </span>
                          {selectedTopicMatches.map((topic) => (
                            <span
                              key={topic.id}
                              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                            >
                              {topic.label}
                            </span>
                          ))}
                        </div>
                        <h2
                          className="text-3xl font-semibold tracking-tight md:text-4xl"
                          style={{
                            fontFamily:
                              '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif',
                          }}
                        >
                          {selectedDoc.title}
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                          {selectedDoc.description}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Button
                          type="button"
                          variant={favorites.includes(selectedSlug ?? "") ? "default" : "outline"}
                          className="rounded-2xl"
                          onClick={handleToggleFavorite}
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {favorites.includes(selectedSlug ?? "") ? "已收藏" : "收藏文档"}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-border/80 px-5 py-10 text-center">
                      <BookOpenText className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h2 className="mt-4 text-xl font-semibold">请选择一篇文档开始阅读</h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        你可以从左侧目录逐层展开，也可以直接通过搜索快速定位。
                      </p>
                    </div>
                  )}

                  {selectedDoc && !error && (
                    <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                        <Clock3 className="h-4 w-4" />
                        预计阅读 {readTime} 分钟
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                        <FileText className="h-4 w-4" />
                        约 {wordCount.toLocaleString()} 词
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5">
                        <FolderTree className="h-4 w-4" />
                        {selectedDoc.filePath}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-5 py-6 md:px-8 md:py-8">
                  {loading && (
                    <div className="animate-in fade-in-50 duration-300 space-y-4">
                      <div className="h-4 w-32 rounded-full bg-muted" />
                      <div className="h-10 w-2/3 rounded-2xl bg-muted" />
                      <div className="space-y-3 pt-4">
                        <div className="h-4 w-full rounded-full bg-muted" />
                        <div className="h-4 w-[94%] rounded-full bg-muted" />
                        <div className="h-4 w-[88%] rounded-full bg-muted" />
                        <div className="h-4 w-[75%] rounded-full bg-muted" />
                      </div>
                    </div>
                  )}

                  {!loading && error && (
                    <div className="animate-in fade-in-50 rounded-3xl border border-dashed border-border/80 bg-muted/20 px-6 py-14 text-center duration-300">
                      <BookOpenText className="mx-auto h-10 w-10 text-muted-foreground" />
                      <h3 className="mt-4 text-xl font-semibold">文档暂时无法展示</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{error}</p>
                      <Button
                        type="button"
                        className="mt-5 rounded-2xl"
                        onClick={() => navigate(getDocHref(docsIndex[0].fullSlug))}
                      >
                        返回第一篇文档
                      </Button>
                    </div>
                  )}

                  {!loading && !error && selectedDoc && (
                    <article
                      key={selectedSlug}
                      className="markdown-content prose prose-neutral max-w-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300 dark:prose-invert"
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw, rehypeHighlight]}
                      >
                        {content}
                      </ReactMarkdown>
                    </article>
                  )}
                </div>

                {selectedDoc && !loading && !error && (
                  <div className="border-t border-border/60 px-5 py-5 md:px-8">
                    <div className="grid gap-3 md:grid-cols-2">
                      {nav.prev && prevHref && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-auto justify-start rounded-2xl px-4 py-4 text-left"
                          asChild
                        >
                          <Link to={prevHref}>
                            <ArrowLeft className="mr-3 h-4 w-4 shrink-0" />
                            <div>
                              <div className="text-xs text-muted-foreground">上一篇</div>
                              <div className="mt-1 whitespace-normal font-medium">
                                {nav.prev.title}
                              </div>
                            </div>
                          </Link>
                        </Button>
                      )}

                      {nav.next && nextHref && (
                        <Button
                          type="button"
                          variant="outline"
                          className="h-auto justify-end rounded-2xl px-4 py-4 text-right md:col-start-2"
                          asChild
                        >
                          <Link to={nextHref}>
                            <div>
                              <div className="text-xs text-muted-foreground">下一篇</div>
                              <div className="mt-1 whitespace-normal font-medium">
                                {nav.next.title}
                              </div>
                            </div>
                            <ArrowRight className="ml-3 h-4 w-4 shrink-0" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>

          <aside className="hidden xl:block xl:sticky xl:top-20 xl:self-start">
            <div className="space-y-4">
              {resumeEntry && (
                <Card className="border-border/70 bg-background/85 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <History className="h-4 w-4 text-primary" />
                      继续阅读
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      保留了你的上次浏览位置，可随时回到最近阅读的内容。
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-4 h-auto w-full justify-start rounded-2xl px-4 py-3 text-left"
                      onClick={() => handleSelectDoc(resumeEntry.fullSlug)}
                    >
                      <div>
                        <div className="font-medium">{resumeEntry.doc.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {resumeEntry.doc.category}
                        </div>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="border-border/70 bg-background/85 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Star className="h-4 w-4 text-primary" />
                    收藏夹
                  </div>
                  <div className="mt-4 space-y-2">
                    {favoritesDocs.length > 0 ? (
                      favoritesDocs.map((entry) => (
                        <button
                          key={entry.fullSlug}
                          type="button"
                          onClick={() => handleSelectDoc(entry.fullSlug)}
                          className="w-full rounded-2xl bg-muted/40 px-3 py-3 text-left transition-colors hover:bg-muted"
                        >
                          <div className="text-sm font-medium">{entry.doc.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {entry.doc.category}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        还没有收藏文档，挑几篇常用内容固定在这里。
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/70 bg-background/85 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <History className="h-4 w-4 text-primary" />
                    最近浏览
                  </div>
                  <div className="mt-4 space-y-2">
                    {recentDocs.length > 0 ? (
                      recentDocs.map((entry) => (
                        <button
                          key={entry.fullSlug}
                          type="button"
                          onClick={() => handleSelectDoc(entry.fullSlug)}
                          className="w-full rounded-2xl bg-muted/40 px-3 py-3 text-left transition-colors hover:bg-muted"
                        >
                          <div className="text-sm font-medium">{entry.doc.title}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {entry.doc.description}
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        浏览过的文档会自动出现在这里，方便快速回看。
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>


            </div>
          </aside>
        </div>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/45 backdrop-blur-sm xl:hidden">
            <div className="absolute left-0 top-0 h-full w-full max-w-[24rem] animate-in slide-in-from-left duration-300 p-3">
              {sidebarContent}
            </div>
            <button
              type="button"
              aria-label="关闭目录"
              className="absolute inset-0 -z-10"
              onClick={() => setMobileNavOpen(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
