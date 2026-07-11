# MCP वापरून एजंट-टू-एजंट संवाद प्रणाली तयार करणे

> TL;DR - MCP वर Agent2Agent Communication तयार करू शकता का? होय!

MCP ने "LLMs साठी संदर्भ प्रदान करणे" या मूळ उद्दिष्टापलीकडे लक्षणीय प्रगती केली आहे. [resumable streams](https://modelcontextprotocol.io/docs/概念/transports#resumability-and-redelivery), [elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation), [sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling), आणि सूचना ([progress](https://modelcontextprotocol.io/specification/2025-06-18/basic/utilities/progress) आणि [resources](https://modelcontextprotocol.io/specification/2025-06-18/schema#resourceupdatednotification)) यासारख्या अलीकडील सुधारणा MCP ला जटिल एजंट-टू-एजंट संवाद प्रणाली तयार करण्यासाठी एक मजबूत पाया प्रदान करतात.

## एजंट/टूल विषयी गैरसमज

अधिकाधिक विकसक एजंटिक वर्तन असलेल्या टूल्सचा (लांब कालावधीसाठी चालवणे, अंमलबजावणी दरम्यान अतिरिक्त इनपुटची आवश्यकता असणे इ.) शोध घेत असताना, MCP मुख्यतः अनुपयुक्त आहे असा एक सामान्य गैरसमज आहे कारण त्याच्या टूल्स प्रिमिटिव्हच्या सुरुवातीच्या उदाहरणांमध्ये साध्या विनंती-प्रतिसाद पॅटर्नवर लक्ष केंद्रित केले होते.

हा दृष्टिकोन आता कालबाह्य झाला आहे. MCP स्पेसिफिकेशनमध्ये गेल्या काही महिन्यांत लक्षणीय सुधारणा करण्यात आल्या आहेत ज्यामुळे लांब-कालावधीच्या एजंटिक वर्तनासाठी आवश्यक असलेल्या क्षमतांची पूर्तता होते:

- **Streaming & Partial Results**: अंमलबजावणी दरम्यान रिअल-टाइम प्रगती अद्यतने
- **Resumability**: डिसकनेक्शननंतर क्लायंट पुन्हा कनेक्ट करू शकतो आणि सुरू ठेवू शकतो
- **Durability**: सर्व्हर रीस्टार्ट झाल्यानंतरही निकाल टिकून राहतात (उदा. resource links द्वारे)
- **Multi-turn**: अंमलबजावणी दरम्यान संवादात्मक इनपुट elicitation आणि sampling द्वारे

या वैशिष्ट्यांचा उपयोग करून जटिल एजंटिक आणि मल्टी-एजंट अनुप्रयोग सक्षम करता येतात, जे सर्व MCP प्रोटोकॉलवर तैनात केले जातात.

संदर्भासाठी, आम्ही MCP सर्व्हरवर उपलब्ध असलेल्या "टूल" ला एजंट म्हणू. याचा अर्थ असा आहे की MCP क्लायंट अंमलबजावणी करणारे होस्ट अॅप्लिकेशन अस्तित्वात आहे जे MCP सर्व्हरशी सत्र स्थापित करते आणि एजंटला कॉल करू शकते.

## MCP टूल "Agentic" कसे बनते?

अंमलबजावणीमध्ये जाण्यापूर्वी, लांब-कालावधीच्या एजंट्सना समर्थन देण्यासाठी कोणत्या पायाभूत सुविधा क्षमतांची आवश्यकता आहे हे स्पष्ट करूया.

> आम्ही एजंटला एक अशी इकाई म्हणून परिभाषित करू जी विस्तारित कालावधीसाठी स्वायत्तपणे कार्य करू शकते, जटिल कार्ये हाताळण्यास सक्षम आहे ज्यासाठी अनेक संवाद किंवा रिअल-टाइम अभिप्रायावर आधारित समायोजन आवश्यक असू शकते.

### 1. Streaming & Partial Results

पारंपरिक विनंती-प्रतिसाद पॅटर्न लांब-कालावधीच्या कार्यांसाठी कार्य करत नाहीत. एजंट्सना खालील गोष्टी प्रदान करणे आवश्यक आहे:

- रिअल-टाइम प्रगती अद्यतने
- मध्यम-कालावधीचे निकाल

**MCP समर्थन**: Resource update notifications द्वारे स्ट्रीमिंग मध्यम-कालावधीचे निकाल सक्षम केले जातात, जरी JSON-RPC च्या 1:1 विनंती/प्रतिसाद मॉडेलशी संघर्ष टाळण्यासाठी काळजीपूर्वक डिझाइन आवश्यक आहे.

| वैशिष्ट्य                    | उपयोग प्रकरण                                                                                                                                                                       | MCP समर्थन                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| रिअल-टाइम प्रगती अद्यतने | वापरकर्ता कोडबेस माइग्रेशन कार्याची विनंती करतो. एजंट प्रगती स्ट्रीम करतो: "10% - Dependencies विश्लेषण करत आहे... 25% - TypeScript फाइल्स रूपांतरित करत आहे... 50% - Imports अद्यतनित करत आहे..."          | ✅ प्रगती सूचना                                                                  |
| मध्यम-कालावधीचे निकाल            | "Generate a book" कार्य मध्यम-कालावधीचे निकाल स्ट्रीम करते, उदा., 1) कथा आर्क रूपरेषा, 2) अध्याय यादी, 3) प्रत्येक अध्याय पूर्ण झाल्याप्रमाणे. होस्ट कोणत्याही टप्प्यावर तपासू, रद्द करू किंवा पुनर्निर्देशित करू शकतो. | ✅ सूचना "विस्तारित" केल्या जाऊ शकतात ज्यामध्ये मध्यम-कालावधीचे निकाल समाविष्ट आहेत PR 383, 776 प्रस्ताव पहा |

<div align="center" style="font-style: italic; font-size: 0.95em; margin-bottom: 0.5em;">
<strong>चित्र 1:</strong> MCP एजंट लांब-कालावधीच्या कार्यादरम्यान होस्ट अॅप्लिकेशनला रिअल-टाइम प्रगती अद्यतने आणि मध्यम-कालावधीचे निकाल कसे स्ट्रीम करतो हे दर्शविणारे हे आकृती आहे, ज्यामुळे वापरकर्त्याला अंमलबजावणी रिअल-टाइममध्ये मॉनिटर करण्यास सक्षम होते.
</div>

```mermaid
sequenceDiagram
    participant User
    participant Host as Host App<br/>(MCP Client)
    participant Server as MCP Server<br/>(Agent Tool)

    User->>Host: Start long task
    Host->>Server: Call agent_tool()

    loop Progress Updates
        Server-->>Host: Progress + partial results
        Host-->>User: Stream updates
    end

    Server-->>Host: ✅ Final result
    Host-->>User: Complete
```

### 2. Resumability

एजंट्सना नेटवर्क व्यत्ययांचा सौम्यपणे सामना करणे आवश्यक आहे:

- डिसकनेक्शननंतर पुन्हा कनेक्ट करा
- जिथे थांबले होते तिथून सुरू ठेवा (message redelivery)

**MCP समर्थन**: MCP StreamableHTTP transport सत्र IDs आणि शेवटच्या इव्हेंट IDs सह सत्र पुनरारंभ आणि संदेश पुनर्प्रेषण समर्थन करते. येथे महत्त्वाची गोष्ट म्हणजे सर्व्हरने EventStore अंमलबजावणी करणे आवश्यक आहे जे क्लायंट पुनर्कनेक्शनवर इव्हेंट रीप्ले सक्षम करते.  
सामुदायिक प्रस्ताव (PR #975) transport-agnostic resumable streams एक्सप्लोर करतो हे लक्षात घ्या.

| वैशिष्ट्य      | उपयोग प्रकरण                                                                                                                                                   | MCP समर्थन                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Resumability | लांब-कालावधीच्या कार्यादरम्यान क्लायंट डिसकनेक्ट होतो. पुनर्कनेक्शन झाल्यावर, सत्र पुन्हा सुरू होते आणि गमावलेले इव्हेंट रीप्ले केले जातात, जिथे थांबले होते तिथून अखंडपणे सुरू ठेवते. | ✅ StreamableHTTP transport सत्र IDs, इव्हेंट रीप्ले, आणि EventStore सह |

<div align="center" style="font-style: italic; font-size: 0.95em; margin-bottom: 0.5em;">
<strong>चित्र 2:</strong> MCP च्या StreamableHTTP transport आणि इव्हेंट स्टोअर कसे अखंड सत्र पुनरारंभ सक्षम करतात हे दर्शविणारे हे आकृती आहे: जर क्लायंट डिसकनेक्ट झाला, तर तो पुन्हा कनेक्ट करू शकतो आणि गमावलेले इव्हेंट रीप्ले करू शकतो, प्रगती न गमावता कार्य सुरू ठेवू शकतो.
</div>

```mermaid
sequenceDiagram
    participant User
    participant Host as Host App<br/>(MCP Client)
    participant Server as MCP Server<br/>(Agent Tool)
    participant Store as Event Store

    User->>Host: Start task
    Host->>Server: Call tool [session: abc123]
    Server->>Store: Save events

    Note over Host,Server: 💥 Connection lost

    Host->>Server: Reconnect [session: abc123]
    Store-->>Server: Replay events
    Server-->>Host: Catch up + continue
    Host-->>User: ✅ Complete
```

### 3. Durability

लांब-कालावधीचे एजंट्सना टिकाऊ स्थिती आवश्यक आहे:

- सर्व्हर रीस्टार्ट झाल्यानंतरही निकाल टिकून राहतात
- स्टेटस बाहेरून मिळवता येतो
- सत्रांमध्ये प्रगती ट्रॅकिंग

**MCP समर्थन**: MCP आता टूल कॉलसाठी Resource link return प्रकार समर्थन करते. आज, एक संभाव्य पॅटर्न म्हणजे टूल डिझाइन करणे जे एक resource तयार करते आणि त्वरित resource link परत करते. टूल पार्श्वभूमीत कार्यावर लक्ष केंद्रित करू शकते आणि resource अद्यतनित करू शकते. याउलट, क्लायंट resource च्या स्थितीची तपासणी करण्यासाठी निवड करू शकतो जेणेकरून resource अद्यतनांवर आधारित मध्यम-कालावधीचे किंवा पूर्ण निकाल मिळतील किंवा resource अद्यतनांसाठी सदस्यता घेऊ शकतो.

येथे एक मर्यादा आहे की resource polling किंवा अद्यतनांसाठी सदस्यता घेणे स्केलवर परिणामांसह संसाधने वापरू शकते. सामुदायिक प्रस्ताव (यामध्ये #992 समाविष्ट आहे) सर्व्हर क्लायंट/होस्ट अॅप्लिकेशनला अद्यतनांची सूचना देण्यासाठी कॉल करू शकतो अशा वेबहुक्स किंवा ट्रिगर्स समाविष्ट करण्याची शक्यता एक्सप्लोर करतो.

| वैशिष्ट्य    | उपयोग प्रकरण                                                                                                                                        | MCP समर्थन                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Durability | डेटा माइग्रेशन कार्यादरम्यान सर्व्हर क्रॅश होतो. निकाल आणि प्रगती रीस्टार्ट टिकून राहते, क्लायंट स्थिती तपासू शकतो आणि टिकाऊ resource वरून सुरू ठेवू शकतो. | ✅ Resource links टिकाऊ स्टोरेज आणि स्थिती सूचना सह |

आज, एक सामान्य पॅटर्न म्हणजे टूल डिझाइन करणे जे एक resource तयार करते आणि त्वरित resource link परत करते. टूल पार्श्वभूमीत कार्यावर लक्ष केंद्रित करू शकते, resource सूचना जारी करू शकते ज्यामुळे प्रगती अद्यतने किंवा मध्यम-कालावधीचे निकाल मिळतात, आणि आवश्यकतेनुसार resource मधील सामग्री अद्यतनित करू शकते.

<div align="center" style="font-style: italic; font-size: 0.95em; margin-bottom: 0.5em;">
<strong>चित्र 3:</strong> MCP एजंट्स टिकाऊ resources आणि स्थिती सूचना कसे वापरतात हे दर्शविणारे हे आकृती आहे, ज्यामुळे लांब-कालावधीचे कार्य सर्व्हर रीस्टार्ट टिकून राहते, क्लायंटला प्रगती तपासण्यास आणि अपयशानंतरही निकाल मिळविण्यास अनुमती देते.
</div>

```mermaid
sequenceDiagram
    participant User
    participant Host as Host App<br/>(MCP Client)
    participant Server as MCP Server<br/>(Agent Tool)
    participant DB as Persistent Storage

    User->>Host: Start task
    Host->>Server: Call tool
    Server->>DB: Create resource + updates
    Server-->>Host: 🔗 Resource link

    Note over Server: 💥 Server restart

    User->>Host: Check status
    Host->>Server: Get resource
    Server->>DB: Load state
    Server-->>Host: Current progress
    Server->>DB: Complete + notify
    Host-->>User: ✅ Complete
```

### 4. Multi-Turn Interactions

एजंट्सना अंमलबजावणी दरम्यान अतिरिक्त इनपुट आवश्यक असते:

- मानवी स्पष्टीकरण किंवा मान्यता
- जटिल निर्णयांसाठी AI सहाय्य
- डायनॅमिक पॅरामीटर समायोजन

**MCP समर्थन**: पूर्णपणे sampling (AI इनपुटसाठी) आणि elicitation (मानवी इनपुटसाठी) द्वारे समर्थित.

| वैशिष्ट्य                 | उपयोग प्रकरण                                                                                                                                     | MCP समर्थन                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Multi-Turn Interactions | ट्रॅव्हल बुकिंग एजंट वापरकर्त्याकडून किंमतीची पुष्टी मागतो, नंतर बुकिंग व्यवहार पूर्ण करण्यापूर्वी ट्रॅव्हल डेटा सारांशित करण्यासाठी AI ला विचारतो. | ✅ मानवी इनपुटसाठी elicitation, AI इनपुटसाठी sampling |

<div align="center" style="font-style: italic; font-size: 0.95em; margin-bottom: 0.5em;">
<strong>चित्र 4:</strong> MCP एजंट्स अंमलबजावणी दरम्यान मानवी इनपुट संवादात्मकपणे कसे elicitation करू शकतात किंवा जटिल, मल्टी-टर्न वर्कफ्लो जसे की पुष्टीकरणे आणि डायनॅमिक निर्णय घेणे यासाठी AI सहाय्य कसे मागू शकतात हे दर्शविणारे हे आकृती आहे.
</div>

```mermaid
sequenceDiagram
    participant User
    participant Host as Host App<br/>(MCP Client)
    participant Server as MCP Server<br/>(Agent Tool)

    User->>Host: Book flight
    Host->>Server: Call travel_agent

    Server->>Host: Elicitation: "Confirm $500?"
    Note over Host: Elicitation callback (if available)
    Host->>User: 💰 Confirm price?
    User->>Host: "Yes"
    Host->>Server: Confirmed

    Server->>Host: Sampling: "Summarize data"
    Note over Host: AI callback (if available)
    Host->>Server: Report summary

    Server->>Host: ✅ Flight booked
```

## MCP वर लांब-कालावधीचे एजंट्स अंमलबजावणी करणे - कोड विहंगावलोकन

या लेखाचा भाग म्हणून, आम्ही MCP Python SDK वापरून StreamableHTTP transport सह सत्र पुनरारंभ आणि संदेश पुनर्प्रेषणासाठी लांब-कालावधीचे एजंट्स अंमलबजावणी करणारे [कोड रिपॉझिटरी](https://github.com/victordibia/ai-tutorials/tree/main/MCP%20Agents) प्रदान करतो. अंमलबजावणी MCP क्षमतांचा उपयोग करून जटिल एजंटसारखे वर्तन सक्षम करण्याचे प्रदर्शन करते.

विशेषतः, आम्ही दोन प्राथमिक एजंट टूल्ससह सर्व्हर अंमलबजावितो:

- **Travel Agent** - elicitation द्वारे किंमतीची पुष्टीकरणासह ट्रॅव्हल बुकिंग सेवा अनुकरण करते
- **Research Agent** - sampling द्वारे AI-सहाय्यित सारांशांसह संशोधन कार्ये करते

दोन्ही एजंट्स रिअल-टाइम प्रगती अद्यतने, संवादात्मक पुष्टीकरणे, आणि पूर्ण सत्र पुनरारंभ क्षमता प्रदर्शित करतात.

### मुख्य अंमलबजावणी संकल्पना

खालील विभाग प्रत्येक क्षमतेसाठी सर्व्हर-साइड एजंट अंमलबजावणी आणि क्लायंट-साइड होस्ट हाताळणी दर्शवितात:

#### Streaming & Progress Updates - रिअल-टाइम कार्य स्थिती

Streaming एजंट्सना लांब-कालावधीच्या कार्यादरम्यान रिअल-टाइम प्रगती अद्यतने प्रदान करण्यास सक्षम करते, वापरकर्त्यांना कार्य स्थिती आणि मध्यम-कालावधीचे निकालांची माहिती ठेवते.

**सर्व्हर अंमलबजावणी (एजंट प्रगती सूचना पाठवतो):**

```python
# From server/server.py - Travel agent sending progress updates
for i, step in enumerate(steps):
    await ctx.session.send_progress_notification(
        progress_token=ctx.request_id,
        progress=i * 25,
        total=100,
        message=step,
        related_request_id=str(ctx.request_id)
    )
    await anyio.sleep(2)  # Simulate work

# Alternative: Log messages for detailed step-by-step updates
await ctx.session.send_log_message(
    level="info",
    data=f"Processing step {current_step}/{steps} ({progress_percent}%)",
    logger="long_running_agent",
    related_request_id=ctx.request_id,
)
```

**क्लायंट अंमलबजावणी (होस्ट प्रगती अद्यतने प्राप्त करतो):**

```python
# From client/client.py - Client handling real-time notifications
async def message_handler(message) -> None:
    if isinstance(message, types.ServerNotification):
        if isinstance(message.root, types.LoggingMessageNotification):
            console.print(f"📡 [dim]{message.root.params.data}[/dim]")
        elif isinstance(message.root, types.ProgressNotification):
            progress = message.root.params
            console.print(f"🔄 [yellow]{progress.message} ({progress.progress}/{progress.total})[/yellow]")

# Register message handler when creating session
async with ClientSession(
    read_stream, write_stream,
    message_handler=message_handler
) as session:
```

#### Elicitation - वापरकर्त्याचा इनपुट मागणे

Elicitation एजंट्सना अंमलबजावणी दरम्यान वापरकर्त्याचा इनपुट मागण्यास सक्षम करते. हे लांब-कालावधीच्या कार्यादरम्यान पुष्टीकरणे, स्पष्टीकरणे, किंवा मान्यता यासाठी आवश्यक आहे.

**सर्व्हर अंमलबजावणी (एजंट पुष्टीकरण मागतो):**

```python
# From server/server.py - Travel agent requesting price confirmation
elicit_result = await ctx.session.elicit(
    message=f"Please confirm the estimated price of $1200 for your trip to {destination}",
    requestedSchema=PriceConfirmationSchema.model_json_schema(),
    related_request_id=ctx.request_id,
)

if elicit_result and elicit_result.action == "accept":
    # Continue with booking
    logger.info(f"User confirmed price: {elicit_result.content}")
elif elicit_result and elicit_result.action == "decline":
    # Cancel the booking
    booking_cancelled = True
```

**क्लायंट अंमलबजावणी (होस्ट elicitation callback प्रदान करतो):**

```python
# From client/client.py - Client handling elicitation requests
async def elicitation_callback(context, params):
    console.print(f"💬 Server is asking for confirmation:")
    console.print(f"   {params.message}")

    response = console.input("Do you accept? (y/n): ").strip().lower()

    if response in ['y', 'yes']:
        return types.ElicitResult(
            action="accept",
            content={"confirm": True, "notes": "Confirmed by user"}
        )
    else:
        return types.ElicitResult(
            action="decline",
            content={"confirm": False, "notes": "Declined by user"}
        )

# Register the callback when creating the session
async with ClientSession(
    read_stream, write_stream,
    elicitation_callback=elicitation_callback
) as session:
```

#### Sampling - AI सहाय्य मागणे

Sampling एजंट्सना अंमलबजावणी दरम्यान जटिल निर्णय किंवा सामग्री निर्मितीसाठी LLM सहाय्य मागण्यास सक्षम करते. हे हायब्रिड मानवी-AI वर्कफ्लो सक्षम करते.

**सर्व्हर अंमलबजावणी (एजंट AI सहाय्य मागतो):**

```python
# From server/server.py - Research agent requesting AI summary
sampling_result = await ctx.session.create_message(
    messages=[
        SamplingMessage(
            role="user",
            content=TextContent(type="text", text=f"Please summarize the key findings for research on: {topic}")
        )
    ],
    max_tokens=100,
    related_request_id=ctx.request_id,
)

if sampling_result and sampling_result.content:
    if sampling_result.content.type == "text":
        sampling_summary = sampling_result.content.text
        logger.info(f"Received sampling summary: {sampling_summary}")
```

**क्लायंट अंमलबजावणी (होस्ट sampling callback प्रदान करतो):**

```python
# From client/client.py - Client handling sampling requests
async def sampling_callback(context, params):
    message_text = params.messages[0].content.text if params.messages else 'No message'
    console.print(f"🧠 Server requested sampling: {message_text}")

    # In a real application, this could call an LLM API
    # For demo purposes, we provide a mock response
    mock_response = "Based on current research, MCP has evolved significantly..."

    return types.CreateMessageResult(
        role="assistant",
        content=types.TextContent(type="text", text=mock_response),
        model="interactive-client",
        stopReason="endTurn"
    )

# Register the callback when creating the session
async with ClientSession(
    read_stream, write_stream,
    sampling_callback=sampling_callback,
    elicitation_callback=elicitation_callback
) as session:
```

#### Resumability - डिसकनेक्शन दरम्यान सत्र अखंडता

Resumability सुनिश्चित करते की लांब-कालावधीचे एजंट कार्य क्लायंट डिसकनेक्शन टिकून राहते आणि पुनर्कनेक्शन झाल्यावर अखंडपणे सुरू ठेवते. हे इव्हेंट स्टोअर्स आणि पुनरारंभ टोकनद्वारे अंमलबजाविते.

**Event Store अंमलबजावणी (सर्व्हर सत्र स्थिती ठेवतो):**

```python
# From server/event_store.py - Simple in-memory event store
class SimpleEventStore(EventStore):
    def __init__(self):
        self._events: list[tuple[StreamId, EventId, JSONRPCMessage]] = []
        self._event_id_counter = 0

    async def store_event(self, stream_id: StreamId, message: JSONRPCMessage) -> EventId:
        """Store an event and return its ID."""
        self._event_id_counter += 1
        event_id = str(self._event_id_counter)
        self._events.append((stream_id, event_id, message))
        return event_id

    async def replay_events_after(self, last_event_id: EventId, send_callback: EventCallback) -> StreamId | None:
        """Replay events after the specified ID for resumption."""
        # Find events after the last known event and replay them
        for _, event_id, message in self._events[start_index:]:
            await send_callback(EventMessage(message, event_id))

# From server/server.py - Passing event store to session manager
def create_server_app(event_store: Optional[EventStore] = None) -> Starlette:
    server = ResumableServer()

    # Create session manager with event store for resumption
    session_manager = StreamableHTTPSessionManager(
        app=server,
        event_store=event_store,  # Event store enables session resumption
        json_response=False,
        security_settings=security_settings,
    )

    return Starlette(routes=[Mount("/mcp", app=session_manager.handle_request)])

# Usage: Initialize with event store
event_store = SimpleEventStore()
app = create_server_app(event_store)
```

**Client Metadata with Resumption Token (क्लायंट साठवलेल्या स्थितीचा वापर करून पुन्हा कनेक्ट होतो):**

```python
# From client/client.py - Client resumption with metadata
if existing_tokens and existing_tokens.get("resumption_token"):
    # Use existing resumption token to continue where we left off
    metadata = ClientMessageMetadata(
        resumption_token=existing_tokens["resumption_token"],
    )
else:
    # Create callback to save resumption token when received
    def enhanced_callback(token: str):
        protocol_version = getattr(session, 'protocol_version', None)
        token_manager.save_tokens(session_id, token, protocol_version, command, args)

    metadata = ClientMessageMetadata(
        on_resumption_token_update=enhanced_callback,
    )

# Send request with resumption metadata
result = await session.send_request(
    types.ClientRequest(
        types.CallToolRequest(
            method="tools/call",
            params=types.CallToolRequestParams(name=command, arguments=args)
        )
    ),
    types.CallToolResult,
    metadata=metadata,
)
```

होस्ट अॅप्लिकेशन स्थानिकपणे सत्र IDs आणि पुनरारंभ टोकन ठेवते, ज्यामुळे ते प्रगती किंवा स्थिती न गमावता विद्यमान सत्रांशी पुन्हा कनेक्ट होऊ शकते.

### कोड संघटन

<div align="center" style="font-style: italic; font-size: 0.95em; margin-bottom: 0.5em;">
<strong>चित्र 5:</strong> MCP-आधारित एजंट प्रणाली आर्किटेक्चर
</div>

```mermaid
graph LR
    User([User]) -->|"Task"| Host["Host<br/>(MCP Client)"]
    Host -->|list tools| Server[MCP Server]
    Server -->|Exposes| AgentsTools[Agents as Tools]
    AgentsTools -->|Task| AgentA[Travel Agent]
    AgentsTools -->|Task| AgentB[Research Agent]

    Host -->|Monitors| StateUpdates[Progress & State Updates]
    Server -->|Publishes| StateUpdates

    class User user;
    class AgentA,AgentB agent;
    class Host,Server,StateUpdates core;
```

**मुख्य फाइल्स:**

- **`server/server.py`** - Travel आणि Research एजंट्ससह पुनरारंभ MCP सर्व्हर जे elicitation, sampling, आणि प्रगती अद्यतने प्रदर्शित करतात
- **`client/client.py`** - पुनरारंभ समर्थन, callback handlers, आणि टोकन व्यवस्थापनासह संवादात्मक होस्ट अॅप्लिकेशन
- **`server/event_store.py`** - सत्र पुनरारंभ आणि संदेश पुनर्प्रेषण सक्षम करणारे इव्हेंट स्टोअर अंमलबजावणी

## MCP वर मल्टी-एजंट संवादासाठी विस्तार

वरील अंमलबजावणी होस्ट अॅप्लिकेशनची बुद्धिमत्ता आणि व्याप्ती वाढवून मल्टी-एजंट प्रणालींमध्ये विस्तारित केली जाऊ शकते:

- **Intelligent Task Decomposition**: होस्ट जटिल वापरकर्ता विनंत्या विश्लेषित करतो आणि वेगवेगळ्या विशेष एजंट्ससाठी उपकार्यांमध्ये विभागतो
- **Multi-Server Coordination**: होस्ट अनेक MCP सर्व्हर्सशी कनेक्शन ठेवतो, प्रत्येक वेगवेगळ्या एजंट क्षमतांचा उघडपणे
- **Task State Management**: होस्ट अनेक समकालीन एजंट कार्यांमध्ये प्रगती ट्रॅक करतो, अवलंबित्वे आणि अनुक्रम हाताळतो
- **Resilience & Retries**: होस्ट अपयश हाताळतो, पुनर्प्रयत्न लॉजिक अंमलबजावतो, आणि एजंट्स अनुपलब्ध झाल्यावर कार्य पुनर्निर्द

---

**अस्वीकरण**:  
हा दस्तऐवज AI भाषांतर सेवा [Co-op Translator](https://github.com/Azure/co-op-translator) चा वापर करून भाषांतरित करण्यात आला आहे. आम्ही अचूकतेसाठी प्रयत्नशील असलो तरी, कृपया लक्षात घ्या की स्वयंचलित भाषांतरांमध्ये त्रुटी किंवा अचूकतेचा अभाव असू शकतो. मूळ भाषेतील दस्तऐवज हा अधिकृत स्रोत मानला जावा. महत्त्वाच्या माहितीसाठी व्यावसायिक मानवी भाषांतराची शिफारस केली जाते. या भाषांतराचा वापर केल्यामुळे उद्भवणाऱ्या कोणत्याही गैरसमज किंवा चुकीच्या अर्थासाठी आम्ही जबाबदार राहणार नाही.