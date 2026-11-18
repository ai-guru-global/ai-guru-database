# FAQ

*Account*

**Path:** FAQ

---

**Source:** https://api-docs.deepseek.com/faq

# FAQ

## Account ​

### Cannot sign in to my account ​

If you see the message 「your account has been temporarily suspended」 while logging in，this indicates that your account has triggered suspension protocols due to potential violations of the platform usage guidelines.

If you believe this is an error,  please contact us by filling out the [「Account Suspension Appeal」](https://trtgsjkv6r.feishu.cn/share/base/form/shrcn13OBmQ3oXJKYLdHjUfeDHh) form. We will carefully review your appeal as soon as possible. Most reviews are completed within 3 business days. Once approved, you can log in and use the service immediately. Thank you for your patience and understanding!

### Cannot register with my email ​

If you encounter an error message saying "Login failed. Your email domain is currently not supported for registration." during registration, it is because your email is not supported by DeepSeek. We recommend signing up with a major international email provider such as Gmail, Outlook, Hotmail, or Yahoo.

If the issue persists, contact [service@deepseek.com](mailto:service@deepseek.com).

### Deleting Account ​

You can request account deletion via the following path:

[「Profile」](https://platform.deepseek.com/profile) --> 「Delete」.

**Important:** This action will also delete your Chat account, and all chat history will be permanently deleted. Any remaining balance in your Open Platform account will be forfeited. Please proceed with caution.

---

## Billing ​

### How to Top Up? ​

You can top up online via PayPal, bank card, Alipay, or WeChat Pay on the [「Top Up」](https://platform.deepseek.com/top_up) page. You can check the results on the [「Billing」](https://platform.deepseek.com/transactions) page.

### Is there any expiration date for my balance? ​

Your topped-up balance will not expire. You can check the expiration date of the granted balance on the [「 Billing 」](https://platform.deepseek.com/transactions) page.

### Is a refund possible? ​

Unused balances are refundable.

Go to the [「 Billing 」](https://platform.deepseek.com/transactions) page, and click 「Refunds」 to process the refund yourself.

### How to view usage by API Key ​

Follow these steps to view detailed usage for each API Key:

1. Go to the [「Usage」](https://platform.deepseek.com/usage) page.
2. Select the relevant month and click 「Export」.
3. Download and unzip the usage data package. You will find two CSV files.
4. The file named amount contains usage details broken down by Key.

### Incorrect Top-up Balance ​

- Verify that the top-up account matches the currently logged-in account.
- If you have a Google account, try logging into the Platform with Google to check if the historical payments are in that account.
- If you deleted a phone-registered account and re-registered, the new account is independent of the old one. If the old account had a balance, it couldn't be used. [Submit a ticket](https://trtgsjkv6r.feishu.cn/share/base/form/shrcnhcHE4A6lQaQ3v0raCXmBAg), select 「Refund Request」, and provide the necessary information.

---

## API Call ​

### Are there any rate limits when calling your API? Can I increase the limits for my account? ​

For concurrency limits and capacity expansion requests, please refer to [Rate Limit & Isolation](/quick_start/rate_limit).

### Why do I feel that your API's speed is slower than the web service? ​

The web service uses streaming output, i.e., every time the model outputs a token, it will be displayed incrementally on the web page.

The API uses non-streaming output (stream=false) by default, i.e., the model's output will not be returned to the user until the generation is done completely. You can use streaming output in your API call to optimize interactivity.

### Why are empty lines continuously returned when calling the API? ​

To prevent the TCP connection from being interrupted due to timeout, we continuously return empty lines (for non-streaming requests) or SSE keep-alive comments (`: keep-alive`，for streaming requests) while waiting for the request to be scheduled. If you are parsing the HTTP response yourself, please make sure to handle these empty lines or comments appropriately.

### Does your API support LangChain? ​

Yes. You can refer to the demo code below, which demonstrates how to use LangChain with DeepSeek API. Replace the API key in the code as necessary.

[deepseek_langchain.py](https://cdn.deepseek.com/api-docs/deepseek_langchain.py)

### How to calculate token usage offline? ​

Please refer to [Token & Token Usage](https://api-docs.deepseek.com/quick_start/token_usage)
