---
title: Skill 中地理/空间数据映射与可视化指南
category: references
tags:
  - agent-skills
  - geospatial
  - mapping
  - visualization
  - data-modeling
summary: 为 Agent Skill 提供地理/空间数据建模、坐标转换、常见地图可视化形式与最佳实践的参考指南。
created: 2026-07-02
updated: 2026-07-02
sources: []
---

# Skill 中地理/空间数据映射与可视化指南

Agent Skill 经常需要处理带地理位置的信息，例如门店地址、设备 GPS 轨迹、区域热力、配送路径等。本文给出在 Skill 中建模、转换与可视化地理/空间数据的实用约定，帮助保持字段语义一致、渲染结果准确、跨工具可复用。

## 1. 空间数据建模

在 Skill 的输入输出或配置中，地理数据建议用结构化的字段组合表示，避免把经纬度、地址、投影信息混在单一字符串里。

### 1.1 基本字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `latitude` | number | 纬度，WGS-84 下范围 [-90, 90] |
| `longitude` | number | 经度，WGS-84 下范围 [-180, 180] |
| `altitude` | number | 海拔高度，单位米，可选 |
| `coordinate_system` | string | 坐标系标识，如 `WGS84`、`GCJ-02`、`BD-09` |
| `address` | string | 人类可读地址，仅用于展示，不参与计算 |
| `region_code` | string | 行政区划编码，如 `110101` |
| `geometry` | object/GeoJSON | 点、线、面等复杂几何体 |

### 1.2 几何体表示

复杂形状推荐采用 GeoJSON 格式：

```json
{
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [116.4074, 39.9042]
  },
  "properties": {
    "name": "北京"
  }
}
```

常见 `geometry.type` 包括 `Point`、`LineString`、`Polygon`、`MultiPoint`、`MultiPolygon`。在 Skill 输出中保持 `coordinates` 为 `[longitude, latitude]` 顺序，并在文档中显式说明，避免与部分可视化库默认的 `[lat, lng]` 混淆。

## 2. 坐标系与投影

不同国家或服务对坐标系有各自约定，Skill 处理数据时应记录来源坐标系，必要时进行转换。

### 2.1 常见坐标系

- **WGS-84**：GPS 与国际通用坐标系，适合全球数据。
- **GCJ-02**：中国国测局加密坐标系，高德、腾讯地图使用。
- **BD-09**：百度地图加密坐标系，在 GCJ-02 基础上二次加密。
- **Web Mercator (EPSG:3857)**：Web 地图切片常用投影，适合可视化但不适于精确测距。

### 2.2 转换原则

1. 数据落库时优先统一为 WGS-84。
2. 渲染前根据底图要求转换为对应坐标系。
3. 在 Skill 配置里暴露 `source_crs` 与 `target_crs` 参数，允许调用方声明坐标系。
4. 距离、面积计算避免在 Web Mercator 下直接进行，应投影到合适的本地坐标系或用地学大圆算法。

## 3. 常见数据格式

| 格式 | 适用场景 | Skill 处理建议 |
|------|----------|----------------|
| GeoJSON | 轻量交换、Web 可视化 | 首选，可读性好，支持 FeatureCollection |
| WKT/WKB | 数据库存储、空间索引 | 与 PostGIS、SpatiaLite 配合 |
| Shapefile | 传统 GIS 数据 | 需要依赖库解析，注意编码 |
| GPX/KML | 轨迹、导航数据 | 解析为 `LineString` 或点序列 |
| CSV + lat/lng | 简单表格数据 | 导入时校验坐标范围与缺失值 |

## 4. 可视化形式选择

根据 Skill 要回答的问题选择地图图层：

- **散点图**：展示离散点位，如门店、事件发生地。
- **热力图**：展示密度分布，适合大量点聚合。
- ** choropleth（分级统计图）**：按区域聚合指标，如各省销售额。
- **路径/轨迹图**：展示移动对象或物流路线。
- **等时圈/缓冲区**：展示可达范围，如 15 分钟生活圈。
- **聚合网格（hexbin/grid）**：把空间划分为等大小单元，避免点重叠。

## 5. Skill 字段命名约定

建议采用清晰、可预测的前缀或结构化命名：

```yaml
location:
  lat: 39.9042
  lng: 116.4074
  crs: WGS84
  address: "北京市东城区..."
boundary:
  type: Polygon
  coordinates: [[[...]]]
  crs: WGS84
```

避免使用 `x`、`y`、`coord` 等模糊字段；如果必须用，请在 Skill 描述中明确 `x` 是经度还是纬度。

## 6. 性能与隐私注意事项

- 大量点渲染时使用聚合或采样，避免一次性加载数万 Marker。
- 高分辨率边界数据会显著增加响应体积，按需返回简化后的几何体。
- 涉及用户位置时，在日志与输出中脱敏，避免输出精确到门牌号的经纬度。
- 跨服务传输 GeoJSON 时设置合理的坐标精度，例如保留 6 位小数即可达到约 0.1 米精度。

## 7. 推荐工具链

- Python：`geopandas`、`shapely`、`pyproj`、`folium`、`kepler.gl`
- JavaScript：`leaflet`、`mapbox-gl-js`、`deck.gl`、`turf.js`
- 数据库：PostGIS、SpatiaLite
- 坐标转换：`proj4js`、`pyproj`、各云厂商 GIS SDK

## 8. 可验证示例

一个最小化的 Skill 输出示例：

```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "store_id": "S001", "sales": 12000 },
      "geometry": { "type": "Point", "coordinates": [121.4737, 31.2304] }
    }
  ]
}
```

调用方可直接将该结果交给地图组件渲染，无需额外解析地址字符串。

## Related

- [[智能体/Agent_Skills/README|Agent Skills]]
- [[学习/References/index|References Index]]
- [[数学基础/Probability_Statistics/Skill_Statistics_Cheatsheet|Skill 中常用统计方法速查]]
- [[智能体/Agent_Skills/Common_Field_Types|常见 Skill 字段类型与命名约定]]
- [[智能体/Agent_Skills/Skill_Versioning_Guide|Skill 版本管理指南]]

## 附录：核心概念速查

| 概念 | 说明 | 应用场景 |
|------|------|----------|
| Agent Loop | 感知-思考-行动循环 | 核心执行流程 |
| Tool Use | 调用外部工具/API | 扩展能力 |
| Memory | 短期/长期记忆 | 上下文维护 |
| Planning | 任务分解与排序 | 复杂任务 |
| Reflection | 自我评估改进 | 质量提升 |
| Multi-Agent | 多Agent协作 | 分布式任务 |

## 附录：技术栈对比

| 框架/工具 | 特点 | 适用场景 | 成熟度 |
|----------|------|----------|--------|
| LangChain | 链式调用 | 通用Agent | ★★★★☆ |
| LangGraph | 图结构编排 | 复杂流程 | ★★★★☆ |
| AutoGen | 多Agent对话 | 协作任务 | ★★★★☆ |
| CrewAI | 角色分工 | 团队模拟 | ★★★☆☆ |
| OpenAI SDK | 官方框架 | 快速原型 | ★★★★☆ |
| Semantic Kernel | 企业级 | .NET/Java | ★★★★☆ |

## 附录：学习路径

| 阶段 | 推荐内容 | 目标 |
|------|----------|------|
| 入门 | 基础概念文档 | 理解Agent |
| 进阶 | 本文档深度内容 | 掌握技术 |
| 实践 | 动手项目 | 构建应用 |
| 前沿 | 最新论文/产品 | 跟踪发展 |

## 附录：常见问题

| 问题 | 解答 |
|------|------|
| Agent和Chatbot的区别？ | Agent能自主决策+使用工具+持续执行 |
| 需要什么前置知识？ | LLM基础+编程+系统设计 |
| 如何评估Agent？ | 任务完成率+效率+安全性 |
| 2026年趋势？ | 多Agent协作/企业级/具身智能 |

## 附录：术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 智能体 | Agent | 自主决策AI系统 |
| 工具调用 | Tool Use | 使用外部工具 |
| 记忆 | Memory | 上下文/历史 |
| 规划 | Planning | 任务分解 |
| 反思 | Reflection | 自我评估 |
| 编排 | Orchestration | 流程管理 |
| 协议 | Protocol | 通信标准 |
| 护栏 | Guardrails | 安全约束 |

## 附录：检查清单

| 检查项 | 说明 | 状态 |
|--------|------|------|
| 理解核心概念 | Agent架构 | ☐ |
| 掌握工具调用 | MCP/Function Calling | ☐ |
| 了解记忆机制 | 短期/长期 | ☐ |
| 理解规划推理 | CoT/ReAct | ☐ |
| 动手实践 | 构建Agent | ☐ |
| 了解评估方法 | 质量度量 | ☐ |

> 💡 智能体是AI从"对话"走向"行动"的关键跨越。掌握Agent开发，是2026年AI工程师的核心竞争力。

---
*Last updated: 2026-07-21*
