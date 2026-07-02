---
title: "Graph RAG Architecture"
tags: [rag, graph-database, knowledge-graph, neo4j, production]
status: complete
last_updated: 2026-07-02
---

# Graph RAG Architecture

## Overview

Graph RAG enhances traditional vector-based RAG by incorporating **knowledge graphs** to capture entity relationships, multi-hop reasoning, and structured knowledge. It addresses key limitations of pure vector search: relationship blindness, multi-hop questions, and lack of explicit reasoning paths.

## Why Graph RAG?

| Challenge | Vector RAG | Graph RAG |
|-----------|-----------|-----------|
| "Who is the CEO of company X?" | May retrieve irrelevant chunks | Direct entity lookup |
| "What connects A to B?" | No relationship awareness | Traverses graph paths |
| Multi-hop reasoning | Poor | Excellent |
| Temporal queries | Limited | Time-aware edges |
| Explainability | Opaque | Explicit reasoning paths |

## Architecture Patterns

### Pattern 1: Graph-Enhanced Retrieval

```
User Query
    │
    ▼
┌──────────────┐     ┌──────────────┐
│ Entity       │     │ Vector       │
│ Extraction   │     │ Search       │
│ (NER + LLM)  │     │ (Embeddings) │
└──────┬───────┘     └──────┬───────┘
       │                    │
       ▼                    ▼
┌──────────────┐     ┌──────────────┐
│ Graph Query  │     │ Chunk        │
│ (Cypher)     │     │ Retrieval    │
└──────┬───────┘     └──────┬───────┘
       │                    │
       └────────┬───────────┘
                │
                ▼
       ┌──────────────┐
       │ Context      │
       │ Assembly     │
       └──────┬───────┘
              │
              ▼
       ┌──────────────┐
       │ LLM Response │
       └──────────────┘
```

### Pattern 2: Knowledge Graph Construction

```python
class KnowledgeGraphBuilder:
    """Build knowledge graph from documents."""
    
    def __init__(self, llm, graph_db):
        self.llm = llm
        self.graph_db = graph_db
    
    def extract_entities_relations(self, text: str) -> list[dict]:
        """Extract entities and relations using LLM."""
        prompt = f"""Extract all entities and relationships from the text.
        
        Return JSON format:
        {{
            "entities": [{{"name": "...", "type": "...", "description": "..."}}],
            "relationships": [{{"source": "...", "target": "...", "relation": "...", "description": "..."}}]
        }}
        
        Text: {text}"""
        
        response = self.llm.generate(prompt)
        return json.loads(response)
    
    def build_graph(self, documents: list[str]):
        """Process documents and build graph."""
        for doc in documents:
            chunks = self.chunk_document(doc)
            for chunk in chunks:
                extracted = self.extract_entities_relations(chunk)
                
                # Upsert entities
                for entity in extracted["entities"]:
                    self.graph_db.upsert_entity(
                        name=entity["name"],
                        type=entity["type"],
                        properties={"description": entity["description"], "source_chunk": chunk}
                    )
                
                # Upsert relationships
                for rel in extracted["relationships"]:
                    self.graph_db.upsert_relationship(
                        source=rel["source"],
                        target=rel["target"],
                        relation=rel["relation"],
                        properties={"description": rel["description"]}
                    )
```

### Neo4j Implementation

```cypher
// Create entity nodes
CREATE (e:Entity {
    name: $name,
    type: $type,
    description: $description,
    embedding: $embedding
})

// Create relationships
MATCH (a:Entity {name: $source})
MATCH (b:Entity {name: $target})
CREATE (a)-[:RELATES_TO {
    type: $relation,
    description: $description,
    confidence: $confidence
}]->(b)

// Multi-hop query
MATCH path = (start:Entity {name: $entity})-[*1..3]-(end:Entity)
WHERE end.type IN $target_types
RETURN path, length(path) as hops
ORDER BY hops ASC
LIMIT 10
```

## Hybrid Retrieval Pipeline

```python
class GraphRAGRetriever:
    """Combine vector search with graph traversal."""
    
    def __init__(self, vector_store, graph_db, llm):
        self.vector_store = vector_store
        self.graph_db = graph_db
        self.llm = llm
    
    def retrieve(self, query: str, top_k: int = 10) -> list[dict]:
        # 1. Vector search for relevant chunks
        vector_results = self.vector_store.search(query, top_k=top_k)
        
        # 2. Extract entities from query
        entities = self.extract_entities(query)
        
        # 3. Graph traversal for each entity
        graph_context = []
        for entity in entities:
            # 1-2 hop neighbors
            neighbors = self.graph_db.query(f"""
                MATCH (e:Entity {{name: $name}})-[r*1..2]-(neighbor)
                RETURN neighbor, r
                LIMIT 20
            """, name=entity)
            graph_context.extend(neighbors)
        
        # 4. Merge and rank results
        all_context = self.merge_results(vector_results, graph_context)
        
        # 5. Re-rank using LLM
        ranked = self.rerank(query, all_context, top_k=top_k)
        
        return ranked
    
    def merge_results(self, vector_results, graph_results):
        """Merge vector chunks with graph context."""
        merged = []
        
        for chunk in vector_results:
            merged.append({
                "content": chunk["text"],
                "source": "vector",
                "score": chunk["score"],
                "metadata": chunk["metadata"]
            })
        
        for graph_item in graph_results:
            merged.append({
                "content": self.serialize_graph_context(graph_item),
                "source": "graph",
                "score": graph_item.get("relevance", 0.5),
                "metadata": {"entity": graph_item["name"]}
            })
        
        return merged
```

## Graph Database Options

| Database | Type | Strengths | Best For |
|----------|------|-----------|----------|
| Neo4j | Property graph | Cypher, mature ecosystem | General knowledge graphs |
| Amazon Neptune | Multi-model | AWS integration | AWS-native workloads |
| FalkorDB | Graph + vector | Redis-compatible, fast | Low-latency RAG |
| NebulaGraph | Distributed | Horizontal scaling | Large-scale graphs |
| ArangoDB | Multi-model | Flexible data model | Complex data relationships |
| TigerGraph | Enterprise | Real-time analytics | Enterprise analytics |

## Entity Resolution

```python
class EntityResolver:
    """Resolve duplicate entities across documents."""
    
    def resolve(self, entities: list[dict]) -> dict[str, list[str]]:
        """Group duplicate entities."""
        clusters = {}
        
        for entity in entities:
            # Fuzzy matching
            normalized = self.normalize(entity["name"])
            
            # Check against existing clusters
            matched = False
            for canonical, aliases in clusters.items():
                if self.is_match(normalized, canonical, aliases):
                    aliases.append(entity["name"])
                    matched = True
                    break
            
            if not matched:
                clusters[normalized] = [entity["name"]]
        
        return clusters
    
    def normalize(self, name: str) -> str:
        """Normalize entity name."""
        name = name.lower().strip()
        name = re.sub(r'[^\w\s]', '', name)
        return name
    
    def is_match(self, normalized: str, canonical: str, aliases: list) -> bool:
        """Check if entity matches existing cluster."""
        # Exact match
        if normalized == canonical:
            return True
        # Fuzzy match
        if fuzz.ratio(normalized, canonical) > 85:
            return True
        # Alias match
        for alias in aliases:
            if fuzz.ratio(normalized, self.normalize(alias)) > 85:
                return True
        return False
```

## Evaluation

### Graph RAG Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| Entity Recall | % of relevant entities found | > 90% |
| Relation Accuracy | % of correct relationships | > 85% |
| Multi-hop Accuracy | Correct answers for multi-hop | > 80% |
| Graph Coverage | % of document knowledge in graph | > 75% |
| Query Latency | End-to-end retrieval time | < 500ms |

### Comparison: Vector RAG vs Graph RAG

```python
def compare_rag_approaches(questions, ground_truth):
    """Compare vector-only vs graph-enhanced RAG."""
    vector_rag = VectorRAG(vector_store, llm)
    graph_rag = GraphRAG(vector_store, graph_db, llm)
    
    results = {"vector": [], "graph": []}
    
    for q, gt in zip(questions, ground_truth):
        vector_answer = vector_rag.answer(q)
        graph_answer = graph_rag.answer(q)
        
        results["vector"].append(evaluate_answer(vector_answer, gt))
        results["graph"].append(evaluate_answer(graph_answer, gt))
    
    return {
        "vector_accuracy": np.mean(results["vector"]),
        "graph_accuracy": np.mean(results["graph"]),
        "improvement": np.mean(results["graph"]) - np.mean(results["vector"])
    }
```

## Production Considerations

### Graph Update Strategy

| Strategy | Frequency | Use Case |
|----------|-----------|----------|
| Batch rebuild | Daily/Weekly | Static knowledge bases |
| Incremental | Real-time | News, live data |
| Event-driven | On change | Document management |
| Hybrid | Mixed | Enterprise |

### Scaling Graph RAG

```
Small (< 1M entities):
  └── Single Neo4j instance
  └── In-memory graph

Medium (1M-100M entities):
  └── Neo4j cluster (3-5 nodes)
  └── Read replicas
  └── Graph partitioning

Large (> 100M entities):
  └── Distributed graph DB (NebulaGraph)
  └── Graph sharding
  └── Edge caching
```

## Related Topics

- [[RAG_Fundamentals]]: Basic RAG concepts
- Vector Databases: Vector storage options
- [[RAG_Advanced_2026]]: Advanced RAG techniques
- [[Agentic_RAG_Guide]]: Agent-driven RAG
