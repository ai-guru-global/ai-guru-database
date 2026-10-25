import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import type { DocEntry } from "@/data/docMap";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CoreTopicDefinition, CoreTopicGroup } from "./core-topics";
import {
  analyzeDocumentCoreTopics,
  buildCoreTopicGroups,
  createCoreTopicManager,
} from "./core-topics";

export interface TopicTagPanelProps {
  docs: DocEntry[];
  selectedSlug?: string | null;
  contentBySlug?: Record<string, string>;
  initialDefinitions?: CoreTopicDefinition[];
  onSelectTopic?: (topicId: string) => void;
  onSelectDoc?: (fullSlug: string) => void;
  storageKey?: string;
}

const DEFAULT_STORAGE_KEY = "docs-page:core-topics:collapsed";

function readStoredCollapsed(key: string) {
  if (typeof window === "undefined") {
    return {} as Record<string, boolean>;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

function writeStoredCollapsed(key: string, value: Record<string, boolean>) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function ensureAllCollapsed(
  collapsed: Record<string, boolean>,
  groups: CoreTopicGroup[]
) {
  const next: Record<string, boolean> = { ...collapsed };
  groups.forEach((group) => {
    if (typeof next[group.id] !== "boolean") {
      next[group.id] = true;
    }
  });
  return next;
}

function docFullSlug(doc: DocEntry) {
  return `${doc.categoryId}-${doc.slug}`;
}

export function TopicTagPanel({
  docs,
  selectedSlug,
  contentBySlug,
  initialDefinitions,
  onSelectTopic,
  onSelectDoc,
  storageKey = DEFAULT_STORAGE_KEY,
}: TopicTagPanelProps) {
  const manager = useMemo(
    () => createCoreTopicManager(initialDefinitions),
    [initialDefinitions]
  );

  const definitions = useMemo(() => manager.getDefinitions(), [manager]);
  const groups = useMemo(
    () =>
      buildCoreTopicGroups(docs, {
        definitions,
        contentBySlug,
        maxTopicsPerDoc: 4,
      }),
    [contentBySlug, definitions, docs]
  );

  const [collapsedMap, setCollapsedMap] = useState<Record<string, boolean>>(() =>
    ensureAllCollapsed(readStoredCollapsed(storageKey), groups)
  );

  useEffect(() => {
    setCollapsedMap((current) => ensureAllCollapsed(current, groups));
  }, [groups]);

  useEffect(() => {
    writeStoredCollapsed(storageKey, collapsedMap);
  }, [collapsedMap, storageKey]);

  const selectedDoc = selectedSlug
    ? docs.find((doc) => docFullSlug(doc) === selectedSlug)
    : undefined;

  const selectedTopics = useMemo(() => {
    if (!selectedDoc) return [];
    return analyzeDocumentCoreTopics(selectedDoc, {
      definitions,
      content: contentBySlug?.[selectedSlug ?? ""],
      maxTopics: 4,
    });
  }, [contentBySlug, definitions, selectedDoc, selectedSlug]);

  const toggleAll = (collapsed: boolean) => {
    setCollapsedMap((current) => {
      const next: Record<string, boolean> = { ...current };
      groups.forEach((group) => {
        next[group.id] = collapsed;
      });
      return next;
    });
  };

  return (
    <Card className="border-border/70 bg-background/85 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-primary" />
            核心话题标签
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl px-3"
              onClick={() => toggleAll(true)}
            >
              全部折叠
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-xl px-3"
              onClick={() => toggleAll(false)}
            >
              全部展开
            </Button>
          </div>
        </div>

        {selectedTopics.length > 0 && (
          <div className="mt-4 rounded-2xl bg-muted/40 px-4 py-3">
            <div className="text-xs font-medium text-muted-foreground">当前文档话题</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => onSelectTopic?.(topic.id)}
                  data-testid={`core-topic-chip:${topic.id}`}
                  className="rounded-full bg-background px-3 py-1 text-xs text-foreground shadow-sm transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className={cn(
            "mt-4 grid gap-3",
            // Responsive layout: 1 column on narrow, 2 on medium when used in wide surfaces.
            "grid-cols-1 sm:grid-cols-2 xl:grid-cols-1"
          )}
          data-testid="core-topic-panel"
        >
          {groups.map((group) => {
            const collapsed = collapsedMap[group.id] ?? true;
            return (
              <div
                key={group.id}
                className="overflow-hidden rounded-2xl border border-border/70 bg-background/70"
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                  onClick={() =>
                    setCollapsedMap((current) => ({
                      ...current,
                      [group.id]: !collapsed,
                    }))
                  }
                  aria-expanded={!collapsed}
                  data-testid={`core-topic-toggle:${group.id}`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {collapsed ? (
                        <ChevronRight className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="mt-0.5 h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{group.label}</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {group.docCount}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {group.description}
                    </p>
                  </div>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none",
                    collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                  )}
                  data-testid={`core-topic-content:${group.id}`}
                >
                  <div className="min-h-0 overflow-hidden px-4 pb-4">
                    <div className="flex flex-wrap gap-2 pt-2">
                      {group.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 space-y-2">
                      {group.docs.slice(0, 6).map((doc) => {
                        const active = doc.fullSlug === selectedSlug;
                        return (
                          <button
                            key={doc.fullSlug}
                            type="button"
                            onClick={() => onSelectDoc?.(doc.fullSlug)}
                            data-testid={`core-topic-doc:${group.id}:${doc.fullSlug}`}
                            className={cn(
                              "w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/40 text-foreground hover:bg-muted"
                            )}
                          >
                            <div className="truncate font-medium">{doc.title}</div>
                            <div className="mt-1 line-clamp-2 text-xs text-muted-foreground/90">
                              {doc.description}
                            </div>
                          </button>
                        );
                      })}
                      {group.docCount > 6 && (
                        <div className="rounded-xl bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                          还有 {group.docCount - 6} 篇文档未展示，建议使用左侧搜索进一步定位。
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
