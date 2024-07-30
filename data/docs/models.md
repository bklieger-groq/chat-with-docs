[https://console.groq.com/docs/models]

**Supported Models**
GroqCloud currently supports the following models:

* **Llama 3.1 405B (Preview)**
	+ Model ID: `llama-3.1-405b-reasoning`
	+ Developer: Meta
	+ Context Window: 131,072 tokens
* **Llama 3.1 70B (Preview)**
	+ Model ID: `llama-3.1-70b-versatile`
	+ Developer: Meta
	+ Context Window: 131,072 tokens
* **Llama 3.1 8B (Preview)**
	+ Model ID: `llama-3.1-8b-instant`
	+ Developer: Meta
	+ Context Window: 131,072 tokens

Early API access to Llama 3.1 405B is currently only available to paying customers - stay tuned for general availability. During preview launch, we are limiting all 3.1 models to max_tokens of 8k and 405b to 16k input tokens.

* **Llama 3 Groq 70B Tool Use (Preview)**
	+ Model ID: `llama3-groq-70b-8192-tool-use-preview`
	+ Developer: Groq
	+ Context Window: 8,192 tokens
* **Llama 3 Groq 8B Tool Use (Preview)**
	+ Model ID: `llama3-groq-8b-8192-tool-use-preview`
	+ Developer: Groq
	+ Context Window: 8,192 tokens
* **Meta Llama 3 70B**
	+ Model ID: `llama3-70b-8192`
	+ Developer: Meta
	+ Context Window: 8,192 tokens
* **Meta Llama 3 8B**
	+ Model ID: `llama3-8b-8192`
	+ Developer: Meta
	+ Context Window: 8,192 tokens
* **Mixtral 8x7B**
	+ Model ID: `mixtral-8x7b-32768`
	+ Developer: Mistral
	+ Context Window: 32,768 tokens
* **Gemma 7B**
	+ Model ID: `gemma-7b-it`
	+ Developer: Google
	+ Context Window: 8,192 tokens
* **Gemma 2 9B**
	+ Model ID: `gemma2-9b-it`
	+ Developer: Google
	+ Context Window: 8,192 tokens
* **Whisper**
	+ Model ID: `whisper-large-v3`
	+ Developer: OpenAI
	+ File Size: 25 MB

**Accessing Models via API**

To retrieve a list of active models, use the following API endpoint:

`https://api.groq.com/openai/v1/models`

**Example Requests**

* **cURL**
```bash
curl -X GET "https://api.groq.com/openai/v1/models" \
     -H "Authorization: Bearer $GROQ_API_KEY" \
     -H "Content-Type: application/json"
```
* **JavaScript**
```javascript
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getModels = async () => {
  return await groq.models.list();
};

getModels().then((models) => {
  // console.log(models);
});
```
* **Python**
```python
import requests
import os

api_key = os.environ.get("GROQ_API_KEY")
url = "https://api.groq.com/openai/v1/models"

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

response = requests.get(url, headers=headers)

print(response.json())
```