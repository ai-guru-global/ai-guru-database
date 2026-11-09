// Package i18n 提供界面多语言文案。
package i18n

import "sync"

type Lang string

const (
	ZH Lang = "zh"
	EN Lang = "en"
)

var (
	currentLang Lang = ZH
	mu          sync.RWMutex
)

func SetLang(l Lang) {
	mu.Lock()
	defer mu.Unlock()
	currentLang = l
}

func GetLang() Lang {
	mu.RLock()
	defer mu.RUnlock()
	return currentLang
}

func T(key string) string {
	mu.RLock()
	defer mu.RUnlock()
	if m, ok := translations[currentLang]; ok {
		if v, ok := m[key]; ok {
			return v
		}
	}
	// Fallback to Chinese then key itself
	if v, ok := translations[ZH][key]; ok {
		return v
	}
	return key
}

var translations = map[Lang]map[string]string{
	ZH: {
		"inbox.title":      "inbox",
		"filter.all":       "全部",
		"filter.unread":    "未读",
		"filter.starred":   "收藏",
		"article.empty":    "  暂无文章",
		"action.read":      "已读",
		"action.starred":   "已收藏",
		"action.discarded": "已丢弃",
		"action.archived":  "已归档",
		"msg.action":       "文章 %d %s",
		"loading":          "Loading...",
		"help.hint":        "j/↓ k/↑  r=read  s=star  d=discard  a=archive  1=all  2=unread  3=starred  q=quit",
		"preview.tags":     "🏷 %s  ",
		"preview.note":     "📝 %s",
	},
	EN: {
		"inbox.title":      "inbox",
		"filter.all":       "all",
		"filter.unread":    "unread",
		"filter.starred":   "starred",
		"article.empty":    "  No articles",
		"action.read":      "read",
		"action.starred":   "starred",
		"action.discarded": "discarded",
		"action.archived":  "archived",
		"msg.action":       "Article %d %s",
		"loading":          "Loading...",
		"help.hint":        "j/↓ k/↑  r=read  s=star  d=discard  a=archive  1=all  2=unread  3=starred  q=quit",
		"preview.tags":     "🏷 %s  ",
		"preview.note":     "📝 %s",
	},
}
