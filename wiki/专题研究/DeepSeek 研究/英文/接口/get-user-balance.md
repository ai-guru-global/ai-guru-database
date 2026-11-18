# Get User Balance

*Get user current balance*

**Path:** API Reference > Others > Get User Balance

---

**Source:** https://api-docs.deepseek.com/api/get-user-balance

# Get User Balance

```
GET /user/balance
```

Get user current balance

## Responses ​

- 200

OK, returns user balance info.

- application/json

- Schema
- Example (from schema)
- Example

Schema

```
{  "is_available": true,  "balance_infos": [    {      "currency": "CNY",      "total_balance": "110.00",      "granted_balance": "10.00",      "topped_up_balance": "100.00"    }  ]}
```

```
{  "is_available": true,  "balance_infos": [    {      "currency": "CNY",      "total_balance": "110.00",      "granted_balance": "10.00",      "topped_up_balance": "100.00"    }  ]}
```
