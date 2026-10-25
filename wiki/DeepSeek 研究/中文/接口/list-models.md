# 列出模型

*列出可用的模型列表，并提供相关模型的基本信息。请前往[模型 & 价格](/zh-cn/quick_start/pricing)查看当前支持的模型列表*

---

**Source:** https://api-docs.deepseek.com/zh-cn/api/list-models

# 列出模型

```
GET /models
```

列出可用的模型列表，并提供相关模型的基本信息。请前往[模型 & 价格](/zh-cn/quick_start/pricing)查看当前支持的模型列表

## Responses ​

- 200

OK, 返回模型列表

- application/json

- Schema
- Example (from schema)
- Example

Schema

```
{  "object": "list",  "data": [    {      "id": "string",      "object": "model",      "owned_by": "string"    }  ]}
```

```
{  "object": "list",  "data": [    {      "id": "deepseek-v4-flash",      "object": "model",      "owned_by": "deepseek"    },    {      "id": "deepseek-v4-pro",      "object": "model",      "owned_by": "deepseek"    }  ]}
```
