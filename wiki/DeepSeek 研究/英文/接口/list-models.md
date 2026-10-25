# Lists Models

*Lists the currently available models, and provides basic information about each one such as the owner and availability. Check [Models & Pricing](/quick_start/pricing) for our currently supported models.*

**Path:** API Reference > Models > Lists Models

---

**Source:** https://api-docs.deepseek.com/api/list-models

# Lists Models

```
GET /models
```

Lists the currently available models, and provides basic information about each one such as the owner and availability. Check [Models & Pricing](/quick_start/pricing) for our currently supported models.

## Responses ​

- 200

OK, returns A list of models

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
