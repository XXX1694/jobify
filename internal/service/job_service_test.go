package service

import "testing"

func TestCalculateMatch(t *testing.T) {
	tests := []struct {
		name     string
		user     []string
		job      []string
		expected int
	}{
		{"Perfect Match", []string{"Go", "Docker"}, []string{"Go", "Docker"}, 100},
		{"Half Match", []string{"Go"}, []string{"Go", "Java"}, 50},
		{"No Match", []string{"PHP"}, []string{"Rust"}, 0},
		{"Empty Skills", []string{}, []string{"Go"}, 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Вызываем функцию из твоего сервиса
			res := CalculateMatch(tt.user, tt.job)
			if res != tt.expected {
				t.Errorf("%s: got %d, want %d", tt.name, res, tt.expected)
			}
		})
	}
}