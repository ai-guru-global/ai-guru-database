package deep_research

import (
	"sync"
	"time"
)

type ResearchCache struct {
	mu    sync.RWMutex
	items map[string]*CachedResult
	ttl   time.Duration
}

type CachedResult struct {
	Result    *ResearchResult
	CreatedAt time.Time
	ExpiresAt time.Time
}

type RateLimiter struct {
	mu             sync.Mutex
	requests       []time.Time
	maxRequests    int
	windowDuration time.Duration
}

type Metrics struct {
	mu                 sync.Mutex
	TotalResearchCount int
	CacheHits          int
	CacheMisses        int
	WebSearchCount     int
	LocalSearchCount   int
	LLMCallCount       int
	TotalDuration      time.Duration
	Errors             []string
}

func NewResearchCache(ttl time.Duration) *ResearchCache {
	return &ResearchCache{
		items: make(map[string]*CachedResult),
		ttl:   ttl,
	}
}

func (c *ResearchCache) Get(key string) *ResearchResult {
	c.mu.RLock()
	defer c.mu.RUnlock()

	if item, ok := c.items[key]; ok {
		if time.Now().Before(item.ExpiresAt) {
			return item.Result
		}
	}
	return nil
}

func (c *ResearchCache) Set(key string, result *ResearchResult) {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.items[key] = &CachedResult{
		Result:    result,
		CreatedAt: time.Now(),
		ExpiresAt: time.Now().Add(c.ttl),
	}
}

func NewRateLimiter(maxRequests int, windowDuration time.Duration) *RateLimiter {
	return &RateLimiter{
		maxRequests:    maxRequests,
		windowDuration: windowDuration,
		requests:       make([]time.Time, 0),
	}
}

func (r *RateLimiter) Allow() bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	now := time.Now()
	cutoff := now.Add(-r.windowDuration)

	var validRequests []time.Time
	for _, t := range r.requests {
		if t.After(cutoff) {
			validRequests = append(validRequests, t)
		}
	}
	r.requests = validRequests

	if len(r.requests) < r.maxRequests {
		r.requests = append(r.requests, now)
		return true
	}
	return false
}

func (m *Metrics) incrementTotal() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.TotalResearchCount++
}

func (m *Metrics) incrementCacheHit() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.CacheHits++
}

func (m *Metrics) incrementWebSearch() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.WebSearchCount++
}

func (m *Metrics) incrementLocalSearch() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.LocalSearchCount++
}

func (m *Metrics) incrementLLM() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.LLMCallCount++
}

func (m *Metrics) recordError(err string) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.Errors = append(m.Errors, err)
	if len(m.Errors) > 100 {
		m.Errors = m.Errors[len(m.Errors)-100:]
	}
}
