package deep_research

import (
	"time"
)

type ResearchConfig struct {
	Days             int
	Limit            int
	SubQueryCount    int
	WebSearchEnabled bool
	MaxSources       int
	Timeout          time.Duration
	MaxRetries       int
	CacheEnabled     bool
	FetchContent     bool
	MinCredibility   float64
}

type ResearchResult struct {
	Topic        string
	Plan         *ResearchPlan
	Trace        ResearchTrace
	Summary      string
	Findings     []Finding
	Perspectives []Perspective
	Sources      []Source
	Evidence     []Evidence
	GapAnalysis  GapAnalysis
	Confidence   ConfidenceLevel
	GeneratedAt  time.Time
	CacheHit     bool
}

type ResearchPlan struct {
	Hypotheses    []Hypothesis  `json:"hypotheses"`
	SearchQueries []SearchQuery `json:"search_queries"`
	KeyAspects    []string      `json:"key_aspects"`
	Depth         string        `json:"depth"`
	Scope         string        `json:"scope"`
}

type Hypothesis struct {
	Statement      string `json:"statement"`
	Priority       int    `json:"priority"`
	EvidenceNeeded string `json:"evidence_needed"`
}

type SearchQuery struct {
	Query      string `json:"query"`
	SourceType string `json:"source_type"` // "local", "web", "both"
	Purpose    string `json:"purpose"`
	Priority   int    `json:"priority"`
}

type ResearchTrace struct {
	Phases    []PhaseTrace  `json:"phases"`
	TotalTime time.Duration `json:"total_time"`
}

type PhaseTrace struct {
	Name       string        `json:"name"`
	StartTime  time.Time     `json:"start_time"`
	EndTime    time.Time     `json:"end_time"`
	Duration   time.Duration `json:"duration"`
	ItemsFound int           `json:"items_found"`
	Error      string        `json:"error,omitempty"`
}

type Source struct {
	ID          int     `json:"id"`
	Title       string  `json:"title"`
	URL         string  `json:"url"`
	SourceName  string  `json:"source_name"`
	Domain      string  `json:"domain"`
	Content     string  `json:"content,omitempty"`
	Snippet     string  `json:"snippet"`
	Credibility float64 `json:"credibility"`
	PublishedAt string  `json:"published_at"`
	Type        string  `json:"type"` // "local_article", "web_search", "fetched_content"
}

type Evidence struct {
	ID           int     `json:"id"`
	SourceIDs    []int   `json:"source_ids"`
	Claim        string  `json:"claim"`
	Quote        string  `json:"quote,omitempty"`
	Category     string  `json:"category"` // "fact", "opinion", "statistic", "trend"
	Verified     bool    `json:"verified"`
	Corroborated int     `json:"corroborated"` // number of sources supporting
	Relevance    float64 `json:"relevance"`
}

type Finding struct {
	ID          int             `json:"id"`
	Category    string          `json:"category"`
	Title       string          `json:"title"`
	Content     string          `json:"content"`
	EvidenceIDs []int           `json:"evidence_ids"`
	Confidence  ConfidenceLevel `json:"confidence"`
}

type Perspective struct {
	Viewpoint   string `json:"viewpoint"`
	Summary     string `json:"summary"`
	EvidenceIDs []int  `json:"evidence_ids"`
}

type GapAnalysis struct {
	UncoveredAspects []string        `json:"uncovered_aspects"`
	WeakEvidence     []string        `json:"weak_evidence"`
	Contradictions   []Contradiction `json:"contradictions"`
}

type Contradiction struct {
	EvidenceA  int    `json:"evidence_a_id"`
	EvidenceB  int    `json:"evidence_b_id"`
	Resolution string `json:"resolution,omitempty"`
}

type ConfidenceLevel string

const (
	ConfidenceHigh   ConfidenceLevel = "high"
	ConfidenceMedium ConfidenceLevel = "medium"
	ConfidenceLow    ConfidenceLevel = "low"
)

type ReportFormat int

const (
	ReportFormatMarkdown ReportFormat = iota
	ReportFormatJSON
	ReportFormatDetailed
)

var DefaultResearchConfig = &ResearchConfig{
	Days:             30,
	Limit:            20,
	SubQueryCount:    5,
	WebSearchEnabled: true,
	MaxSources:       50,
	Timeout:          5 * time.Minute,
	MaxRetries:       3,
	CacheEnabled:     true,
	FetchContent:     true,
	MinCredibility:   0.3,
}
