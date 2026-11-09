package cmd

type burstIdea struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Inspiration string `json:"inspiration"`
}

var burstModePrompts = map[string]struct {
	System string
	Prompt string
}{
	"cross-domain": {
		System: "你是一位技术创业顾问和产品创新专家，擅长跨界联想和组合创新。请用中文回答，返回纯 JSON。",
		Prompt: `你是一位极具创造力的产品经理和技术创业顾问。以下是从 Hacker News Show HN 收集到的新产品和项目列表。请基于这些产品进行深度分析和跨界联想，生成 %d 个全新的、有创意的、可执行的产品或项目想法。

要求：
- 每个想法必须是全新的，不是简单复制已有产品
- 融合多个已有产品的核心理念进行创新，特别关注跨领域组合
- 考虑技术可行性和市场需求
- 适合独立开发者或小团队快速启动
- 用中文描述

请严格以 JSON 数组格式返回，不要包含 markdown 代码块：
[
  {
    "title": "创意名称（简洁有力）",
    "description": "详细描述：解决了什么问题、核心功能、目标用户、技术方案要点（3-5句话）",
    "inspiration": "灵感来源：来自哪些产品的启发"
  }
]

已有产品列表：
%s%s`,
	},
	"problem": {
		System: "你是一位产品战略专家，擅长从用户痛点出发设计解决方案。请用中文回答，返回纯 JSON。",
		Prompt: `以下是从 Hacker News Show HN 收集到的新产品和项目。请分析这些产品所揭示的用户痛点和未被满足的需求，然后生成 %d 个全新的产品创意。

要求：
- 从真实用户需求出发，而不是从技术出发
- 每个想法要明确说明解决了什么痛点
- 考虑现有产品的不足之处，提出更好的方案
- 目标用户要具体，不能是"所有人"
- 用中文描述

请严格以 JSON 数组格式返回，不要包含 markdown 代码块：
[
  {
    "title": "创意名称",
    "description": "痛点分析 + 解决方案 + 目标用户 + 商业模式（3-5句话）",
    "inspiration": "灵感来源：观察到什么问题或需求"
  }
]

已有产品列表：
%s%s`,
	},
	"techstack": {
		System: "你是一位全栈技术架构师，擅长将新技术栈组合成实用产品。请用中文回答，返回纯 JSON。",
		Prompt: `以下是从 Hacker News Show HN 收集到的新产品和项目。请分析这些产品使用的技术栈和架构，然后生成 %d 个全新的技术组合创意。

要求：
- 每个想法要明确说明使用的核心技术栈
- 技术选型要有创意，不是简单照搬
- 考虑新兴技术（AI、Edge Computing、WebAssembly 等）的应用
- 给出简要的技术架构描述
- 用中文描述

请严格以 JSON 数组格式返回，不要包含 markdown 代码块：
[
  {
    "title": "创意名称",
    "description": "技术方案 + 架构设计 + 核心功能 + 部署策略（3-5句话）",
    "inspiration": "灵感来源：哪些技术组合给了启发"
  }
]

已有产品列表：
%s%s`,
	},
}

// burstModeNames 模式标识到中文名称的映射
var burstModeNames = map[string]string{
	"cross-domain": "跨界联想",
	"problem":      "问题驱动",
	"techstack":    "技术栈组合",
}
