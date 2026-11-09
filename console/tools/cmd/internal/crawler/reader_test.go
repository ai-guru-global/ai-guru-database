package crawler

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestJinaReader_FetchError(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusNotFound)
	}))
	defer ts.Close()

	reader := NewJinaReader()
	_, err := reader.Fetch(ts.URL)
	if err == nil {
		t.Error("expected error for 404 response")
	}
}

func TestJinaReader_FetchWithFallback(t *testing.T) {
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusInternalServerError)
	}))
	defer ts.Close()

	reader := NewJinaReader()
	result := reader.FetchWithFallback(ts.URL)
	if result != "" {
		t.Errorf("expected empty string on error, got %q", result)
	}
}

func TestJinaReader_Interface(t *testing.T) {
	// Verify JinaReader implements ContentReader interface
	var _ ContentReader = (*JinaReader)(nil)
}
