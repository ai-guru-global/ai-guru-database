package article

import "testing"

func TestIsValidStatus(t *testing.T) {
	tests := []struct {
		status string
		want   bool
	}{
		{"unread", true},
		{"read", true},
		{"starred", true},
		{"archived", true},
		{"discarded", true},
		{"invalid", false},
		{"", false},
	}

	for _, tt := range tests {
		t.Run(tt.status, func(t *testing.T) {
			got := IsValidStatus(ReadStatus(tt.status))
			if got != tt.want {
				t.Errorf("IsValidStatus(%q) = %v, want %v", tt.status, got, tt.want)
			}
		})
	}
}
