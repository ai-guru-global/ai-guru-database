import { describe, expect, it } from "vitest";
import { findDocByFullSlug } from "@/data/docMap";
import {
  analyzeDocumentCoreTopics,
  buildCoreTopicMap,
  createCoreTopicManager,
  DEFAULT_CORE_TOPIC_DEFINITIONS,
} from "./core-topics";

describe("core topic taxonomy", () => {
  it("classifies RAG documents by retrieval topic", () => {
    const ragDoc = findDocByFullSlug("07-rag-systems");
    expect(ragDoc).toBeDefined();

    const topics = analyzeDocumentCoreTopics(ragDoc!);
    expect(topics.map((topic) => topic.id)).toContain("rag-retrieval-knowledge");
  });

  it("classifies safety documents by safety governance topic", () => {
    const safetyDoc = findDocByFullSlug("08-ai-safety-redteaming");
    expect(safetyDoc).toBeDefined();

    const topics = analyzeDocumentCoreTopics(safetyDoc!);
    expect(topics.map((topic) => topic.id)).toContain("safety-governance");
  });

  it("classifies foundation documents by mathematical systems topic", () => {
    const foundationsDoc = findDocByFullSlug("01-linear-algebra");
    expect(foundationsDoc).toBeDefined();

    const topics = analyzeDocumentCoreTopics(foundationsDoc!);
    expect(topics[0]?.id).toBe("foundations-math-systems");
  });

  it("builds stable topic mappings for multiple documents", () => {
    const docs = [
      findDocByFullSlug("01-linear-algebra"),
      findDocByFullSlug("07-rag-systems"),
      findDocByFullSlug("08-ai-security"),
    ].filter((doc): doc is NonNullable<typeof doc> => Boolean(doc));

    const topicMap = buildCoreTopicMap(docs);

    expect(topicMap["01-linear-algebra"]?.length).toBeGreaterThan(0);
    expect(topicMap["07-rag-systems"]?.some((topic) => topic.id === "rag-retrieval-knowledge")).toBe(
      true
    );
    expect(topicMap["08-ai-security"]?.some((topic) => topic.id === "safety-governance")).toBe(
      true
    );
  });

  it("supports dynamic add and update for core topic definitions", () => {
    const manager = createCoreTopicManager(DEFAULT_CORE_TOPIC_DEFINITIONS);

    manager.addDefinition({
      id: "custom-topic",
      label: "自定义主题",
      description: "用于测试新增话题接口",
      keywords: ["custom"],
    });

    expect(manager.getDefinitions().some((definition) => definition.id === "custom-topic")).toBe(
      true
    );

    manager.updateDefinition("custom-topic", {
      label: "自定义主题-已更新",
      keywords: ["custom", "updated"],
    });

    expect(
      manager.getDefinitions().find((definition) => definition.id === "custom-topic")?.label
    ).toBe("自定义主题-已更新");
  });
});
