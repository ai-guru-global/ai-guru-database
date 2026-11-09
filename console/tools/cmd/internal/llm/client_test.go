package llm

import (
	"math"
	"testing"
)

func TestCosineSimilarity(t *testing.T) {
	tests := []struct {
		name string
		a    []float64
		b    []float64
		want float64
	}{
		{
			name: "identical vectors",
			a:    []float64{1, 0, 0},
			b:    []float64{1, 0, 0},
			want: 1,
		},
		{
			name: "orthogonal vectors",
			a:    []float64{1, 0},
			b:    []float64{0, 1},
			want: 0,
		},
		{
			name: "opposite vectors",
			a:    []float64{1, 0},
			b:    []float64{-1, 0},
			want: -1,
		},
		{
			name: "different length",
			a:    []float64{1, 0, 0},
			b:    []float64{1, 0},
			want: 0,
		},
		{
			name: "zero vector",
			a:    []float64{0, 0},
			b:    []float64{1, 0},
			want: 0,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := CosineSimilarity(tt.a, tt.b)
			if math.Abs(got-tt.want) > 1e-9 {
				t.Errorf("CosineSimilarity() = %v, want %v", got, tt.want)
			}
		})
	}
}
