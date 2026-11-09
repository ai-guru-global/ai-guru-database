package deep_research

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"sync"
)

func (r *Researcher) planningPhase(ctx context.Context, topic string, cfg *ResearchConfig) (*ResearchPlan, error) {
	r.metrics.incrementLLM()

	prompt := fmt.Sprintf(`你是一个专业的深度研究员。请为以下研究主题制定详细的研究计划。

主题：%s

研究计划应包含：

1. **研究假设**：2-3个关于该主题的核心假设或预期发现
2. **搜索查询**：5-8个针对不同角度的搜索查询，覆盖：
   - 技术细节和原理
   - 最新动态和产品发布
   - 行业趋势和市场分析
   - 社区反馈和讨论
   - 历史背景和发展历程
3. **关键方面**：该主题需要探索的关键维度
4. **研究深度**：浅层（表面了解）、中层（详细分析）、深层（全面透彻）

请用JSON格式输出：
{
  "hypotheses": [{"statement": "假设内容", "priority": 1-3, "evidence_needed": "需要什么证据"}],
  "search_queries": [{"query": "搜索内容", "source_type": "local|web|both", "purpose": "探索目的", "priority": 1-3}],
  "key_aspects": ["方面1", "方面2"],
  "depth": "shallow|medium|deep",
  "scope": "狭窄|中等|广泛"
}`, topic)

	response, err := r.llmClient.SimpleChat(ctx, prompt, 3000)
	if err != nil {
		return nil, err
	}

	return r.parseResearchPlan(response)
}

func (r *Researcher) parseResearchPlan(response string) (*ResearchPlan, error) {
	plan := &ResearchPlan{}

	start := strings.Index(response, "{")
	end := strings.LastIndex(response, "}")
	if start == -1 || end == -1 {
		return plan, fmt.Errorf("invalid plan format")
	}

	jsonStr := response[start : end+1]

	if val := extractJSONInt(jsonStr, "priority"); val > 0 {
		plan.Hypotheses = append(plan.Hypotheses, Hypothesis{
			Statement:      "主假设",
			Priority:       1,
			EvidenceNeeded: "待验证",
		})
	}

	hypothesesStr := extractJSONSection(jsonStr, "hypotheses")
	if hypothesesStr != "" {
		hypothesesStr = strings.TrimPrefix(hypothesesStr, "[")
		hypothesesStr = strings.TrimSuffix(hypothesesStr, "]")
		entries := strings.Split(hypothesesStr, "},")
		for _, entry := range entries {
			if !strings.HasSuffix(entry, "}") {
				entry += "}"
			}
			h := Hypothesis{
				Statement:      extractJSONString(entry, "statement"),
				Priority:       extractJSONInt(entry, "priority"),
				EvidenceNeeded: extractJSONString(entry, "evidence_needed"),
			}
			if h.Statement != "" {
				plan.Hypotheses = append(plan.Hypotheses, h)
			}
		}
	}

	queriesStr := extractJSONSection(jsonStr, "search_queries")
	if queriesStr != "" {
		queriesStr = strings.TrimPrefix(queriesStr, "[")
		queriesStr = strings.TrimSuffix(queriesStr, "]")
		entries := strings.Split(queriesStr, "},")
		for _, entry := range entries {
			if !strings.HasSuffix(entry, "}") {
				entry += "}"
			}
			q := SearchQuery{
				Query:      extractJSONString(entry, "query"),
				SourceType: extractJSONString(entry, "source_type"),
				Purpose:    extractJSONString(entry, "purpose"),
				Priority:   extractJSONInt(entry, "priority"),
			}
			if q.Query == "" {
				q.Query = extractJSONString(entry, "Query")
			}
			if q.SourceType == "" {
				q.SourceType = "both"
			}
			if q.Query != "" {
				plan.SearchQueries = append(plan.SearchQueries, q)
			}
		}
	}

	if len(plan.SearchQueries) == 0 {
		plan.SearchQueries = append(plan.SearchQueries, SearchQuery{
			Query:      plan.Hypotheses[0].Statement,
			SourceType: "both",
			Purpose:    "主查询",
			Priority:   1,
		})
	}

	plan.Depth = extractJSONString(jsonStr, "depth")
	if plan.Depth == "" {
		plan.Depth = "medium"
	}
	plan.Scope = extractJSONString(jsonStr, "scope")
	if plan.Scope == "" {
		plan.Scope = "中等"
	}

	return plan, nil
}

func (r *Researcher) searchPhase(ctx context.Context, plan *ResearchPlan, cfg *ResearchConfig) ([]Source, error) {
	var allSources []Source
	var mu sync.Mutex
	var wg sync.WaitGroup
	errChan := make(chan error, len(plan.SearchQueries)*2)
	sourceID := 1

	addSource := func(s Source) {
		mu.Lock()
		s.ID = sourceID
		sourceID++
		allSources = append(allSources, s)
		mu.Unlock()
	}

	priorityQueries := make([]SearchQuery, 0)
	for _, q := range plan.SearchQueries {
		if q.Priority <= 2 {
			priorityQueries = append(priorityQueries, q)
		}
	}
	if len(priorityQueries) == 0 {
		priorityQueries = plan.SearchQueries
	}

	for _, sq := range priorityQueries {
		if len(allSources) >= cfg.MaxSources {
			break
		}

		select {
		case <-ctx.Done():
			return allSources, ctx.Err()
		default:
		}

		if sq.SourceType == "local" || sq.SourceType == "both" {
			wg.Add(1)
			go func(query SearchQuery) {
				defer wg.Done()

				articles, err := r.searchLocalWithRetry(query.Query, cfg.Limit, cfg.MaxRetries)
				if err == nil {
					mu.Lock()
					for _, a := range articles {
						if len(allSources) >= cfg.MaxSources {
							break
						}
						addSource(Source{
							Title:       a.Title,
							URL:         a.URL,
							SourceName:  a.Source,
							Domain:      extractDomain(a.URL),
							Snippet:     a.Summary,
							Credibility: a.QualityScore / 10.0,
							PublishedAt: formatTime(a.PublishedAt),
							Type:        "local_article",
						})
						r.metrics.incrementLocalSearch()
					}
					mu.Unlock()
				} else {
					errChan <- fmt.Errorf("local search for '%s': %w", query.Query, err)
				}
			}(sq)
		}

		if sq.SourceType == "web" || sq.SourceType == "both" {
			if !r.rateLimiter.Allow() {
				slog.Warn("rate limit reached, skipping web search")
				continue
			}

			wg.Add(1)
			go func(query SearchQuery) {
				defer wg.Done()

				results, err := r.searchWebWithRetry(query.Query, cfg.MaxRetries)
				if err == nil {
					mu.Lock()
					for _, res := range results {
						if len(allSources) >= cfg.MaxSources {
							break
						}
						addSource(Source{
							Title:       res.Title,
							URL:         res.URL,
							SourceName:  extractDomain(res.URL),
							Domain:      extractDomain(res.URL),
							Snippet:     res.Snippet,
							Credibility: r.domainCredibility(extractDomain(res.URL)),
							PublishedAt: res.PublishedDate,
							Type:        "web_search",
						})
						r.metrics.incrementWebSearch()
					}
					mu.Unlock()
				} else {
					errChan <- fmt.Errorf("web search for '%s': %w", query.Query, err)
				}
			}(sq)
		}
	}

	wg.Wait()
	close(errChan)

	var errors []string
	for err := range errChan {
		errors = append(errors, err.Error())
	}
	if len(errors) > 0 {
		slog.Warn("some searches failed", "count", len(errors))
	}

	return allSources, nil
}

func (r *Researcher) contentFetchingPhase(ctx context.Context, sources []Source, cfg *ResearchConfig) ([]Source, error) {
	if r.contentRead == nil {
		return sources, nil
	}

	type result struct {
		index   int
		content string
		err     error
	}

	resultChan := make(chan result, len(sources))
	var wg sync.WaitGroup

	for i, source := range sources {
		if source.Type != "web_search" || source.Content != "" {
			continue
		}
		if source.Credibility < cfg.MinCredibility {
			continue
		}

		wg.Add(1)
		go func(idx int, s Source) {
			defer wg.Done()

			content, err := r.contentRead.Fetch(s.URL)
			resultChan <- result{idx, content, err}
		}(i, source)

		if len(resultChan)%5 == 0 {
			wg.Wait()
		}
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	for res := range resultChan {
		if res.err == nil && res.content != "" {
			sources[res.index].Content = truncate(res.content, 5000)
			sources[res.index].Type = "fetched_content"
		}
	}

	return sources, nil
}

func (r *Researcher) evidenceExtractionPhase(ctx context.Context, topic string, sources []Source, cfg *ResearchConfig) ([]Evidence, error) {
	r.metrics.incrementLLM()

	var sourceTexts []string
	for i, s := range sources {
		content := s.Content
		if content == "" {
			content = s.Snippet
		}
		if content == "" {
			continue
		}
		sourceTexts = append(sourceTexts, fmt.Sprintf(`[来源%d] %s
URL: %s
内容: %s`, i+1, s.Title, s.URL, content))
	}

	if len(sourceTexts) == 0 {
		return nil, nil
	}

	prompt := fmt.Sprintf(`你是一个专业的证据提取专家。请从以下研究来源中提取关键证据、声明和事实。

研究主题：%s

=== 来源材料 ===
%s

请提取以下类型的证据：
1. **事实 (fact)**：可验证的客观信息
2. **观点 (opinion)**：主观看法和分析
3. **统计数据 (statistic)**：具体数字和数据
4. **趋势 (trend)**：发展方向和演变

每个证据应包含：
- claim: 证据/声明内容
- quote: 原文引用（如果有）
- category: 证据类型
- relevance: 与主题的相关度 (0-1)

输出JSON数组格式：
[
  {"claim": "证据内容", "quote": "原文引用", "category": "fact|opinion|statistic|trend", "relevance": 0.9},
  ...
]

请提取10-20个最重要的证据。`, topic, strings.Join(sourceTexts, "\n\n---\n\n"))

	response, err := r.llmClient.SimpleChat(ctx, prompt, 4000)
	if err != nil {
		return nil, err
	}

	return r.parseEvidence(response, len(sources))
}

func (r *Researcher) parseEvidence(response string, sourceCount int) ([]Evidence, error) {
	var evidence []Evidence

	start := strings.Index(response, "[")
	end := strings.LastIndex(response, "]")
	if start == -1 || end == -1 {
		return evidence, nil
	}

	jsonStr := response[start : end+1]
	jsonStr = strings.TrimPrefix(jsonStr, "[")
	jsonStr = strings.TrimSuffix(jsonStr, "]")

	entries := strings.Split(jsonStr, "},")
	for i, entry := range entries {
		if !strings.HasSuffix(entry, "}") {
			entry += "}"
		}

		e := Evidence{
			ID:        i + 1,
			Claim:     extractJSONString(entry, "claim"),
			Quote:     extractJSONString(entry, "quote"),
			Category:  extractJSONString(entry, "category"),
			Relevance: extractJSONFloat(entry, "relevance"),
		}

		if e.Category == "" {
			e.Category = "fact"
		}
		if e.Relevance == 0 {
			e.Relevance = 0.5
		}

		e.SourceIDs = r.findSourceIDs(e.Claim, sourceCount)

		if e.Claim != "" {
			evidence = append(evidence, e)
		}
	}

	return evidence, nil
}

func (r *Researcher) findSourceIDs(claim string, sourceCount int) []int {
	var ids []int
	for i := 0; i < sourceCount; i++ {
		ids = append(ids, i+1)
	}
	if len(ids) > 5 {
		ids = ids[:5]
	}
	return ids
}

func (r *Researcher) analysisPhase(ctx context.Context, topic string, evidence []Evidence, sources []Source, cfg *ResearchConfig) ([]Finding, []Perspective, GapAnalysis, error) {
	r.metrics.incrementLLM()

	var gapAnalysis GapAnalysis

	verifiedCount := 0
	for i := range evidence {
		corroborated := 0
		for j := range evidence {
			if i != j && r.claimsRelated(evidence[i].Claim, evidence[j].Claim) {
				corroborated++
			}
		}
		evidence[i].Corroborated = corroborated
		evidence[i].Verified = corroborated >= 1
		if evidence[i].Verified {
			verifiedCount++
		}
	}

	findings := r.extractFindings(evidence, sources)

	perspectives := r.extractPerspectives(evidence, sources)

	topicWords := strings.Fields(topic)
	var uncoveredAspects []string
	if len(evidence) < 5 {
		uncoveredAspects = append(uncoveredAspects, "需要更多证据支撑")
	}
	for _, word := range topicWords {
		found := false
		for _, e := range evidence {
			if strings.Contains(strings.ToLower(e.Claim), strings.ToLower(word)) {
				found = true
				break
			}
		}
		if !found {
			uncoveredAspects = append(uncoveredAspects, word)
		}
	}
	gapAnalysis.UncoveredAspects = uncoveredAspects

	return findings, perspectives, gapAnalysis, nil
}

func (r *Researcher) claimsRelated(a, b string) bool {
	aWords := strings.Fields(strings.ToLower(a))
	bWords := strings.Fields(strings.ToLower(b))

	matchCount := 0
	for _, aw := range aWords {
		for _, bw := range bWords {
			if len(aw) > 3 && len(bw) > 3 && aw == bw {
				matchCount++
				break
			}
		}
	}

	return matchCount >= 2
}

func (r *Researcher) extractFindings(evidence []Evidence, sources []Source) []Finding {
	var findings []Finding

	categories := map[string][]Evidence{}
	for _, e := range evidence {
		if e.Relevance < 0.3 {
			continue
		}
		categories[e.Category] = append(categories[e.Category], e)
	}

	categoryNames := map[string]string{
		"fact":      "技术事实",
		"opinion":   "专家观点",
		"statistic": "数据统计",
		"trend":     "趋势分析",
	}

	categoryEmojis := map[string]string{
		"fact":      "📊",
		"opinion":   "💭",
		"statistic": "📈",
		"trend":     "📉",
	}

	id := 1
	for cat, catEvidence := range categories {
		if len(catEvidence) < 1 {
			continue
		}

		var claims []string
		var evidenceIDs []int
		for _, e := range catEvidence {
			claims = append(claims, e.Claim)
			evidenceIDs = append(evidenceIDs, e.ID)
		}

		content := strings.Join(claims, "；")
		if len(content) > 500 {
			content = content[:500] + "..."
		}

		confidence := ConfidenceMedium
		verifiedCount := 0
		for _, e := range catEvidence {
			if e.Verified {
				verifiedCount++
			}
		}
		if verifiedCount >= len(catEvidence)/2 {
			confidence = ConfidenceHigh
		} else if verifiedCount == 0 {
			confidence = ConfidenceLow
		}

		findings = append(findings, Finding{
			ID:          id,
			Category:    categoryNames[cat],
			Title:       fmt.Sprintf("%s发现", categoryEmojis[cat]),
			Content:     content,
			EvidenceIDs: evidenceIDs,
			Confidence:  confidence,
		})
		id++
	}

	return findings
}

func (r *Researcher) extractPerspectives(evidence []Evidence, sources []Source) []Perspective {
	var perspectives []Perspective

	verifiedEvidence := []Evidence{}
	unverifiedEvidence := []Evidence{}
	for _, e := range evidence {
		if e.Verified {
			verifiedEvidence = append(verifiedEvidence, e)
		} else {
			unverifiedEvidence = append(unverifiedEvidence, e)
		}
	}

	if len(verifiedEvidence) > 0 {
		var claims []string
		var ids []int
		for _, e := range verifiedEvidence {
			claims = append(claims, e.Claim)
			ids = append(ids, e.ID)
		}
		perspectives = append(perspectives, Perspective{
			Viewpoint:   "主流观点",
			Summary:     strings.Join(claims, "；"),
			EvidenceIDs: ids,
		})
	}

	if len(unverifiedEvidence) > 0 {
		var claims []string
		var ids []int
		for _, e := range unverifiedEvidence {
			claims = append(claims, e.Claim)
			ids = append(ids, e.ID)
		}
		perspectives = append(perspectives, Perspective{
			Viewpoint:   "待验证观点",
			Summary:     strings.Join(claims, "；"),
			EvidenceIDs: ids,
		})
	}

	return perspectives
}

func (r *Researcher) synthesisPhase(ctx context.Context, topic string, findings []Finding, perspectives []Perspective, gapAnalysis GapAnalysis, cfg *ResearchConfig) (string, error) {
	r.metrics.incrementLLM()

	var findingsSummary string
	for _, f := range findings {
		findingsSummary += fmt.Sprintf("- [%s] %s\n", f.Category, f.Content) + "\n"
	}

	var perspectivesSummary string
	for _, p := range perspectives {
		perspectivesSummary += fmt.Sprintf("- [%s] %s\n", p.Viewpoint, p.Summary) + "\n"
	}

	prompt := fmt.Sprintf(`你是一位专业的技术分析师。请根据以下研究材料，为主题「%s」生成一份执行摘要。

研究材料：

关键发现：
%s

多角度分析：
%s

信息缺口：
- 未覆盖方面：%s
- 弱证据：%s

请用2-3句话生成执行摘要，概括：
1. 该主题的核心趋势
2. 最主要的发现
3. 需要进一步关注的方向

请用中文回答，直接输出摘要内容，不要额外格式。`, topic, findingsSummary, perspectivesSummary, strings.Join(gapAnalysis.UncoveredAspects, "、"), strings.Join(gapAnalysis.WeakEvidence, "、"))

	return r.llmClient.SimpleChat(ctx, prompt, 1500)
}

func (r *Researcher) calculateConfidence(findings []Finding, evidence []Evidence, gap GapAnalysis) ConfidenceLevel {
	if len(evidence) == 0 {
		return ConfidenceLow
	}

	verifiedCount := 0
	for _, e := range evidence {
		if e.Verified {
			verifiedCount++
		}
	}
	verificationRate := float64(verifiedCount) / float64(len(evidence))

	highConfidenceFindings := 0
	for _, f := range findings {
		if f.Confidence == ConfidenceHigh {
			highConfidenceFindings++
		}
	}
	findingScore := float64(highConfidenceFindings) / float64(len(findings)+1)

	gapScore := 1.0 - float64(len(gap.UncoveredAspects))/10.0
	if gapScore < 0 {
		gapScore = 0
	}

	confidenceScore := (verificationRate*0.4 + findingScore*0.4 + gapScore*0.2)

	if confidenceScore > 0.7 {
		return ConfidenceHigh
	} else if confidenceScore > 0.4 {
		return ConfidenceMedium
	}
	return ConfidenceLow
}
