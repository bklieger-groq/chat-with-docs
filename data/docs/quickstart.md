[Quickstart Instructions](https://console.groq.com/docs/quickstart)

Here is the cleaned and restructured documentation:

**Quickstart**
===============

Get started with the Groq API in a few minutes.

**Create an API Key**
--------------------

Create an API key by visiting [here](/keys).

**Set up your API Key**
----------------------

Recommended: Configure your API key as an environment variable to streamline your API usage and enhance security.

**In your terminal:**

```bash
export GROQ_API_KEY=<your-api-key-here>
```

**Requesting your First Chat Completion**
----------------------------------------

### Using `curl`
curl -X POST "https://api.groq.com/openai/v1/chat/completions" \
     -H "Authorization: Bearer $GROQ_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"messages": [{"role": "user", "content": "Explain the importance of fast language models"}], "model": "llama3-8b-8192"}'


### Using JavaScript
Install the Groq JavaScript library:

Copy
npm install --save groq-sdk

Performing a Chat Completion:

Copy
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main() {
  const chatCompletion = await getGroqChatCompletion();
  // Print the completion returned by the LLM.
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

export async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama3-8b-8192",
  });
}
Now that you have successfully received a chat completion, you can try out the other endpoints in the API.


### Using Python
Install the Groq Python library:

Copy
pip install groq

Performing a Chat Completion:

Copy
import os

from groq import Groq

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": "Explain the importance of fast language models",
        }
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)
Now that you have successfully received a chat completion, you can try out the other endpoints in the API.


### Using JSON
{
  "messages": [
    {
      "role": "user",
      "content": "Explain the importance of fast language models"
    }
  ],
  "model": "mixtral-8x7b-32768"
}


**Install the Groq Python library:**

```bash
pip install groq
```

**Perform a Chat Completion:**

```python
import os
from groq import Groq

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

chat_completion = client.chat.completions.create(
    messages=[
        {"role": "user", "content": "Explain the importance of fast language models"}
    ],
    model="llama3-8b-8192",
)

print(chat_completion.choices[0].message.content)
```

**Next Steps**
--------------

* Try out the Groq API in your browser with the [Playground](/playground)
* Join our GroqCloud developer community on [Discord](https://discord.gg/groq)
* Chat with our Docs at lightning speed using the Groq API!
* Contribute to the [Groq API Cookbook](https://github.com/groq/groq-api-cookbook)