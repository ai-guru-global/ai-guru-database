package deep_research

import (
	"fmt"
	"strings"
)

func extractJSONString(s, key string) string {
	pattern := fmt.Sprintf(`"%s"`, key)
	idx := strings.Index(s, pattern)
	if idx == -1 {
		return ""
	}
	start := idx + len(pattern) + 1
	for start < len(s) && (s[start] == ' ' || s[start] == ':') {
		if s[start] == '"' {
			start++
			break
		}
		start++
	}
	end := start
	for end < len(s) && s[end] != '"' {
		if s[end] == '\\' && end+1 < len(s) {
			end += 2
			continue
		}
		end++
	}
	result := s[start:end]
	result = strings.ReplaceAll(result, `\"`, `"`)
	result = strings.ReplaceAll(result, `\\`, `\`)
	return strings.TrimSpace(result)
}

func extractJSONInt(s, key string) int {
	pattern := fmt.Sprintf(`"%s"`, key)
	idx := strings.Index(s, pattern)
	if idx == -1 {
		return 0
	}
	start := idx + len(pattern)
	for start < len(s) && (s[start] == ' ' || s[start] == ':' || s[start] == '"') {
		start++
	}
	end := start
	for end < len(s) && s[end] >= '0' && s[end] <= '9' {
		end++
	}
	result := s[start:end]
	if result == "" {
		return 0
	}
	var num int
	fmt.Sscanf(result, "%d", &num)
	return num
}

func extractJSONFloat(s, key string) float64 {
	pattern := fmt.Sprintf(`"%s"`, key)
	idx := strings.Index(s, pattern)
	if idx == -1 {
		return 0
	}
	start := idx + len(pattern)
	for start < len(s) && (s[start] == ' ' || s[start] == ':' || s[start] == '"') {
		start++
	}
	end := start
	for end < len(s) && (s[end] >= '0' && s[end] <= '9' || s[end] == '.') {
		end++
	}
	result := s[start:end]
	if result == "" {
		return 0
	}
	var num float64
	fmt.Sscanf(result, "%f", &num)
	return num
}

func extractJSONSection(s, key string) string {
	start := strings.Index(s, fmt.Sprintf(`"%s"`, key))
	if start == -1 {
		return ""
	}
	bracketStart := strings.Index(s[start:], "[")
	if bracketStart == -1 {
		return ""
	}
	bracketStart += start

	depth := 0
	for i := bracketStart; i < len(s); i++ {
		if s[i] == '[' {
			depth++
		} else if s[i] == ']' {
			depth--
			if depth == 0 {
				return s[bracketStart : i+1]
			}
		}
	}
	return ""
}
