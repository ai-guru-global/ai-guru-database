package mocks

// ContentReaderMock is a mock implementation of crawler.ContentReader for testing
type ContentReaderMock struct {
	FetchFunc             func(url string) (string, error)
	FetchWithFallbackFunc func(url string) string
}

func (m *ContentReaderMock) Fetch(url string) (string, error) {
	if m.FetchFunc != nil {
		return m.FetchFunc(url)
	}
	return "", nil
}

func (m *ContentReaderMock) FetchWithFallback(url string) string {
	if m.FetchWithFallbackFunc != nil {
		return m.FetchWithFallbackFunc(url)
	}
	return ""
}
