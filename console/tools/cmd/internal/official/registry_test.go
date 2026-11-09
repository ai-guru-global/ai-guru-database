package official

import "testing"

func TestGetRegistry(t *testing.T) {
	r := GetRegistry()
	if r == nil {
		t.Fatal("GetRegistry() returned nil")
	}

	// Verify singleton behavior
	r2 := GetRegistry()
	if r != r2 {
		t.Error("GetRegistry() did not return the same instance")
	}
}

func TestRegistryGet(t *testing.T) {
	r := GetRegistry()

	// Test known sources
	knownSources := []string{"hn", "github", "reddit", "v2ex", "infoq", "ruanyf", "coolshell", "lobsters"}
	for _, alias := range knownSources {
		source, exists := r.Get(alias)
		if !exists {
			t.Errorf("expected source %s to exist", alias)
			continue
		}
		if source.Alias != alias {
			t.Errorf("expected source alias %s, got %s", alias, source.Alias)
		}
	}

	// Test unknown source
	_, exists := r.Get("nonexistent")
	if exists {
		t.Error("expected nonexistent source to not exist")
	}
}

func TestRegistryList(t *testing.T) {
	r := GetRegistry()
	sources := r.List()
	if len(sources) == 0 {
		t.Error("expected List() to return non-empty sources")
	}

	// All listed sources should be enabled
	for _, s := range sources {
		if !s.Enabled {
			t.Errorf("expected source %s to be enabled", s.Alias)
		}
	}
}
