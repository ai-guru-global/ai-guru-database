import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { TopicTagPanel } from "./TopicTagPanel";
import type { DocEntry } from "@/data/docMap";

const mockDocs: DocEntry[] = [
  {
    slug: "linear-algebra",
    title: "Linear Algebra",
    filePath: "01_Fundamentals/Linear_Algebra/Linear_Algebra.md",
    category: "Fundamentals",
    categoryId: "01",
    description: "向量、矩阵、特征值分解等基础内容",
  },
  {
    slug: "rag-systems",
    title: "RAG Systems",
    filePath: "11_RAG_Systems/RAG_Systems.md",
    category: "AI Engineering",
    categoryId: "07",
    description: "检索增强生成、索引、召回与知识库设计",
  },
];

describe("TopicTagPanel", () => {
  const storage = new Map<string, string>();

  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", {
      writable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
        clear: () => {
          storage.clear();
        },
      },
    });
  });

  it("renders all core topic groups in collapsed state by default", () => {
    render(<TopicTagPanel docs={mockDocs} />);

    const ragToggle = screen.getByTestId("core-topic-toggle:rag-retrieval-knowledge");
    const foundationToggle = screen.getByTestId("core-topic-toggle:foundations-math-systems");

    expect(ragToggle).toHaveAttribute("aria-expanded", "false");
    expect(foundationToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("toggles topic collapse state when user clicks the header", () => {
    render(<TopicTagPanel docs={mockDocs} />);

    const ragToggle = screen.getByTestId("core-topic-toggle:rag-retrieval-knowledge");
    fireEvent.click(ragToggle);
    expect(ragToggle).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(ragToggle);
    expect(ragToggle).toHaveAttribute("aria-expanded", "false");
  });

  it("calls callbacks when selecting topic or document", () => {
    const handleSelectTopic = vi.fn();
    const handleSelectDoc = vi.fn();

    render(
      <TopicTagPanel
        docs={mockDocs}
        selectedSlug="07-rag-systems"
        onSelectTopic={handleSelectTopic}
        onSelectDoc={handleSelectDoc}
      />
    );

    fireEvent.click(screen.getByTestId("core-topic-chip:rag-retrieval-knowledge"));
    expect(handleSelectTopic).toHaveBeenCalledWith("rag-retrieval-knowledge");

    const ragToggle = screen.getByTestId("core-topic-toggle:rag-retrieval-knowledge");
    fireEvent.click(ragToggle);
    fireEvent.click(
      screen.getByTestId("core-topic-doc:rag-retrieval-knowledge:07-rag-systems")
    );
    expect(handleSelectDoc).toHaveBeenCalledWith("07-rag-systems");
  });
});
