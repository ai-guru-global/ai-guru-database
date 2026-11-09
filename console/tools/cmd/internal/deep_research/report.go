// Package deep_research 实现多阶段深度研究管线：规划、检索与报告生成。
package deep_research

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"
)

func (r *Researcher) FormatResult(result *ResearchResult, format ReportFormat) string {
	switch format {
	case ReportFormatJSON:
		out, _ := r.toJSON(result)
		return out
	case ReportFormatDetailed:
		return r.toDetailedMarkdown(result)
	default:
		return r.toMarkdown(result)
	}
}

func (r *Researcher) toMarkdown(result *ResearchResult) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("# 🔬 深度研究报告：%s\n\n", result.Topic))
	sb.WriteString(fmt.Sprintf("> 生成时间: %s | 来源: %d | 证据: %d | 置信度: %s\n\n",
		result.GeneratedAt.Format("2006-01-02 15:04"), len(result.Sources), len(result.Evidence), result.Confidence))
	sb.WriteString("---\n\n")

	sb.WriteString("## 📋 执行摘要\n\n")
	sb.WriteString(result.Summary + "\n\n")

	if len(result.Findings) > 0 {
		sb.WriteString("---\n\n")
		sb.WriteString("## 🔍 关键发现\n\n")
		for _, f := range result.Findings {
			emoji := getCategoryEmoji(f.Category)
			sb.WriteString(fmt.Sprintf("### %s %s\n\n", emoji, f.Title))
			sb.WriteString(fmt.Sprintf("**置信度**: %s\n\n", f.Confidence))
			sb.WriteString(f.Content + "\n\n")

			if len(f.EvidenceIDs) > 0 {
				sb.WriteString("**相关证据**: ")
				for i, eid := range f.EvidenceIDs {
					if i > 0 {
						sb.WriteString(", ")
					}
					sb.WriteString(fmt.Sprintf("[%d]", eid))
				}
				sb.WriteString("\n\n")
			}
		}
	}

	if len(result.Perspectives) > 0 {
		sb.WriteString("---\n\n")
		sb.WriteString("## 🌐 多角度分析\n\n")
		for _, p := range result.Perspectives {
			sb.WriteString(fmt.Sprintf("### %s\n\n%s\n\n", p.Viewpoint, p.Summary))
		}
	}

	if len(result.GapAnalysis.UncoveredAspects) > 0 {
		sb.WriteString("---\n\n")
		sb.WriteString("## ⚠️ 信息缺口\n\n")
		sb.WriteString("以下方面信息不足：\n")
		for _, aspect := range result.GapAnalysis.UncoveredAspects {
			sb.WriteString(fmt.Sprintf("- %s\n", aspect))
		}
		sb.WriteString("\n")
	}

	sb.WriteString("---\n\n")
	sb.WriteString("## 📚 参考来源\n\n")
	for _, s := range result.Sources {
		cred := fmt.Sprintf("%.0f%%", s.Credibility*100)
		typeLabel := map[string]string{
			"local_article":   "本地",
			"web_search":      "网络",
			"fetched_content": "全文",
		}[s.Type]
		if typeLabel == "" {
			typeLabel = s.Type
		}
		sb.WriteString(fmt.Sprintf("%d. **[%s](%s)** - %s | 可信度: %s | 类型: %s\n",
			s.ID, s.Title, s.URL, s.SourceName, cred, typeLabel))
		if s.Snippet != "" {
			sb.WriteString(fmt.Sprintf("   > %s\n", truncate(s.Snippet, 150)))
		}
	}

	sb.WriteString("\n---\n\n")
	sb.WriteString(fmt.Sprintf("*由 AI News Database Deep Research 生成 | 研究用时: %v*\n", result.Trace.TotalTime))

	return sb.String()
}

func (r *Researcher) toDetailedMarkdown(result *ResearchResult) string {
	var sb strings.Builder

	sb.WriteString(fmt.Sprintf("# 🔬 深度研究报告：%s\n\n", result.Topic))
	sb.WriteString(fmt.Sprintf("> 生成时间: %s | 来源: %d | 证据: %d | 置信度: %s\n\n",
		result.GeneratedAt.Format("2006-01-02 15:04"), len(result.Sources), len(result.Evidence), result.Confidence))

	sb.WriteString("---\n\n")
	sb.WriteString("## 🔎 研究过程\n\n")
	for _, phase := range result.Trace.Phases {
		errStr := ""
		if phase.Error != "" {
			errStr = fmt.Sprintf(" ⚠️ %s", phase.Error)
		}
		sb.WriteString(fmt.Sprintf("- **[%s]** %v | 找到 %d 项%s\n",
			phase.Name, phase.Duration, phase.ItemsFound, errStr))
	}

	if result.Plan != nil && len(result.Plan.Hypotheses) > 0 {
		sb.WriteString("\n### 研究假设\n\n")
		for _, h := range result.Plan.Hypotheses {
			sb.WriteString(fmt.Sprintf("- %s (优先级: %d)\n", h.Statement, h.Priority))
		}
	}

	sb.WriteString("\n---\n\n")
	sb.WriteString("## 📋 执行摘要\n\n")
	sb.WriteString(result.Summary + "\n\n")

	if len(result.Evidence) > 0 {
		sb.WriteString("---\n\n")
		sb.WriteString("## 📊 证据摘要\n\n")
		for _, e := range result.Evidence {
			verified := "✓"
			if !e.Verified {
				verified = "✗"
			}
			corroborated := ""
			if e.Corroborated > 0 {
				corroborated = fmt.Sprintf(" (被 %d 个来源证实)", e.Corroborated)
			}
			sb.WriteString(fmt.Sprintf("%d. [%s] %s %s%s\n", e.ID, verified, e.Category, e.Claim, corroborated))
			if e.Quote != "" {
				sb.WriteString(fmt.Sprintf("   > \"%s\"\n", truncate(e.Quote, 200)))
			}
		}
	}

	if len(result.Findings) > 0 {
		sb.WriteString("\n---\n\n")
		sb.WriteString("## 🔍 关键发现\n\n")
		for _, f := range result.Findings {
			emoji := getCategoryEmoji(f.Category)
			sb.WriteString(fmt.Sprintf("### %s %s\n\n", emoji, f.Title))
			sb.WriteString(fmt.Sprintf("**分类**: %s | **置信度**: %s\n\n", f.Category, f.Confidence))
			sb.WriteString(f.Content + "\n\n")

			if len(f.EvidenceIDs) > 0 {
				sb.WriteString("**相关证据**: ")
				for i, eid := range f.EvidenceIDs {
					if i > 0 {
						sb.WriteString(", ")
					}
					sb.WriteString(fmt.Sprintf("[%d]", eid))
				}
				sb.WriteString("\n\n")
			}
		}
	}

	if len(result.Perspectives) > 0 {
		sb.WriteString("---\n\n")
		sb.WriteString("## 🌐 多角度分析\n\n")
		for _, p := range result.Perspectives {
			sb.WriteString(fmt.Sprintf("### %s\n\n%s\n\n", p.Viewpoint, p.Summary))
			if len(p.EvidenceIDs) > 0 {
				sb.WriteString("来源证据: ")
				for _, eid := range p.EvidenceIDs {
					sb.WriteString(fmt.Sprintf("[%d] ", eid))
				}
				sb.WriteString("\n\n")
			}
		}
	}

	if len(result.GapAnalysis.UncoveredAspects) > 0 || len(result.GapAnalysis.WeakEvidence) > 0 {
		sb.WriteString("---\n\n")
		sb.WriteString("## ⚠️ 信息缺口分析\n\n")
		if len(result.GapAnalysis.UncoveredAspects) > 0 {
			sb.WriteString("**未覆盖方面**：\n")
			for _, aspect := range result.GapAnalysis.UncoveredAspects {
				sb.WriteString(fmt.Sprintf("- %s\n", aspect))
			}
			sb.WriteString("\n")
		}
		if len(result.GapAnalysis.WeakEvidence) > 0 {
			sb.WriteString("**弱证据**：\n")
			for _, weak := range result.GapAnalysis.WeakEvidence {
				sb.WriteString(fmt.Sprintf("- %s\n", weak))
			}
		}
	}

	sb.WriteString("---\n\n")
	sb.WriteString("## 📚 参考来源\n\n")
	for _, s := range result.Sources {
		cred := fmt.Sprintf("%.0f%%", s.Credibility*100)
		typeLabel := map[string]string{
			"local_article":   "本地",
			"web_search":      "网络",
			"fetched_content": "全文",
		}[s.Type]
		if typeLabel == "" {
			typeLabel = s.Type
		}
		sb.WriteString(fmt.Sprintf("%d. **[%s](%s)** - %s | 可信度: %s | 类型: %s\n",
			s.ID, s.Title, s.URL, s.SourceName, cred, typeLabel))
		if s.Snippet != "" {
			sb.WriteString(fmt.Sprintf("   > %s\n", truncate(s.Snippet, 150)))
		}
	}

	sb.WriteString("\n---\n\n")
	sb.WriteString(fmt.Sprintf("*由 AI News Database Deep Research 生成 | 总用时: %v*\n", result.Trace.TotalTime))

	return sb.String()
}

func (r *Researcher) toJSON(result *ResearchResult) (string, error) {
	data := map[string]interface{}{
		"topic":        result.Topic,
		"generated_at": result.GeneratedAt.Format(time.RFC3339),
		"confidence":   result.Confidence,
		"cache_hit":    result.CacheHit,
		"summary":      result.Summary,
		"findings":     result.Findings,
		"perspectives": result.Perspectives,
		"evidence":     result.Evidence,
		"sources":      result.Sources,
		"gap_analysis": result.GapAnalysis,
		"plan":         result.Plan,
		"trace": map[string]interface{}{
			"total_time": result.Trace.TotalTime.String(),
			"phases":     result.Trace.Phases,
		},
	}

	jsonBytes, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		return "", err
	}

	return string(jsonBytes), nil
}

func getCategoryEmoji(category string) string {
	switch category {
	case "技术事实":
		return "📊"
	case "专家观点":
		return "💭"
	case "数据统计":
		return "📈"
	case "趋势分析":
		return "📉"
	case "技术趋势":
		return "📈"
	case "产品动态":
		return "🚀"
	case "行业影响":
		return "🌐"
	case "安全警示":
		return "⚠️"
	case "社区热点":
		return "🔥"
	default:
		return "📌"
	}
}

func formatTime(t *time.Time) string {
	if t == nil {
		return ""
	}
	return t.Format("2006-01-02")
}

func truncate(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}
