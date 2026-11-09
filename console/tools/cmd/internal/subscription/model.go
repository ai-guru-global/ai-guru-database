package subscription

import "time"

// Subscription 表示一个订阅源
type Subscription struct {
	Name      string    `json:"name"`       // 订阅名称
	Alias     string    `json:"alias"`      // 别名/代号（用于快捷访问）
	URL       string    `json:"url"`        // 网站地址
	CreatedAt time.Time `json:"created_at"` // 创建时间
}

// Config 表示订阅配置文件结构
type Config struct {
	Subscriptions []Subscription `json:"subscriptions"` // 订阅列表
}
