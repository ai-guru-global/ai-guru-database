# 查询余额

*查询账号余额*

---

**Source:** https://api-docs.deepseek.com/zh-cn/api/get-user-balance

# 查询余额

```
GET /user/balance
```

查询账号余额

## Responses ​

- 200

OK, 返回用户余额详情

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
