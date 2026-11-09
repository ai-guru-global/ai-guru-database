package deep_research

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log/slog"
	"time"

	"ai-news-database/internal/config"
	"ai-news-database/internal/crawler"
	"ai-news-database/internal/db"
	"ai-news-database/internal/llm"
	"ai-news-database/internal/search"
)

type Researcher struct {
	db          *db.DB
	llmClient   llm.LLMClient
	cfg         *config.LLMConfig
	searchEng   *search.Engine
	contentRead crawler.ContentReader
	cache       *ResearchCache
	rateLimiter *RateLimiter
	metrics     *Metrics
}

func New(database *db.DB, cfg *config.LLMConfig) *Researcher {
	return NewWithDeps(database, cfg, llm.NewClient(cfg), search.NewEngine(), crawler.NewJinaReader())
}

func NewWithDeps(database *db.DB, cfg *config.LLMConfig, llmClient llm.LLMClient, searchEng *search.Engine, contentReader crawler.ContentReader) *Researcher {
	return &Researcher{
		db:          database,
		llmClient:   llmClient,
		cfg:         cfg,
		searchEng:   searchEng,
		contentRead: contentReader,
		cache:       NewResearchCache(30 * time.Minute),
		rateLimiter: NewRateLimiter(10, time.Minute),
		metrics:     &Metrics{},
	}
}

func (r *Researcher) Research(ctx context.Context, topic string, cfg *ResearchConfig) (*ResearchResult, error) {
	if cfg == nil {
		cfg = DefaultResearchConfig
	}

	ctx, cancel := context.WithTimeout(ctx, cfg.Timeout)
	defer cancel()

	r.metrics.incrementTotal()

	cacheKey := r.cacheKey(topic, cfg)
	if cfg.CacheEnabled {
		if cached := r.cache.Get(cacheKey); cached != nil {
			slog.Info("research cache hit", "topic", topic)
			r.metrics.incrementCacheHit()
			cached.CacheHit = true
			return cached, nil
		}
	}

	startTime := time.Now()
	result := &ResearchResult{
		Topic:       topic,
		GeneratedAt: startTime,
	}

	if err := r.executeResearchPhases(ctx, topic, cfg, result); err != nil {
		r.metrics.recordError(err.Error())
		return nil, err
	}

	result.Trace.TotalTime = time.Since(startTime)

	if cfg.CacheEnabled {
		r.cache.Set(cacheKey, result)
	}

	return result, nil
}

func (r *Researcher) executeResearchPhases(ctx context.Context, topic string, cfg *ResearchConfig, result *ResearchResult) error {
	slog.Info("starting deep research", "topic", topic)

	phase := func(name string) (func(int, string), time.Time) {
		start := time.Now()
		return func(items int, err string) {
			result.Trace.Phases = append(result.Trace.Phases, PhaseTrace{
				Name:       name,
				StartTime:  start,
				EndTime:    time.Now(),
				Duration:   time.Since(start),
				ItemsFound: items,
				Error:      err,
			})
		}, start
	}

	planDone, _ := phase("Planning")
	plan, err := r.planningPhase(ctx, topic, cfg)
	result.Plan = plan
	planDone(len(plan.SearchQueries), errorToString(err))

	if err != nil {
		slog.Warn("planning phase had issues", "error", err)
	}

	searchDone, _ := phase("Search")
	sources, err := r.searchPhase(ctx, plan, cfg)
	result.Sources = sources
	searchDone(len(sources), errorToString(err))

	if len(sources) == 0 {
		return fmt.Errorf("no sources found for topic: %s", topic)
	}

	var fetchDone func(int, string)
	if cfg.FetchContent {
		fetchDone, _ = phase("ContentFetching")
		sources, err = r.contentFetchingPhase(ctx, sources, cfg)
		result.Sources = sources
		fetchDone(len(sources), errorToString(err))
	}

	extractDone, _ := phase("EvidenceExtraction")
	evidence, err := r.evidenceExtractionPhase(ctx, topic, sources, cfg)
	result.Evidence = evidence
	extractDone(len(evidence), errorToString(err))

	analysisDone, _ := phase("Analysis")
	findings, perspectives, gapAnalysis, err := r.analysisPhase(ctx, topic, evidence, sources, cfg)
	result.Findings = findings
	result.Perspectives = perspectives
	result.GapAnalysis = gapAnalysis
	analysisDone(len(findings), errorToString(err))

	summaryDone, _ := phase("Synthesis")
	summary, err := r.synthesisPhase(ctx, topic, findings, perspectives, gapAnalysis, cfg)
	result.Summary = summary
	summaryDone(0, errorToString(err))

	result.Confidence = r.calculateConfidence(result.Findings, result.Evidence, result.GapAnalysis)

	return nil
}

func errorToString(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}

func (r *Researcher) ResearchWithFormat(ctx context.Context, topic string, cfg *ResearchConfig, format ReportFormat) (string, error) {
	result, err := r.Research(ctx, topic, cfg)
	if err != nil {
		return "", err
	}

	switch format {
	case ReportFormatJSON:
		return r.toJSON(result)
	case ReportFormatDetailed:
		return r.toDetailedMarkdown(result), nil
	default:
		return r.toMarkdown(result), nil
	}
}

func (r *Researcher) cacheKey(topic string, cfg *ResearchConfig) string {
	data := fmt.Sprintf("%s:%d:%d:%d:%v:%v", topic, cfg.Days, cfg.Limit, cfg.SubQueryCount, cfg.WebSearchEnabled, cfg.FetchContent)
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

func (r *Researcher) GetMetrics() *Metrics {
	return r.metrics
}

func (r *Researcher) ResetMetrics() {
	r.metrics = &Metrics{}
}
