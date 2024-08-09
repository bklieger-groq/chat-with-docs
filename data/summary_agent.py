from groq import Groq
from dotenv import load_dotenv
import os
import json
from pydantic import BaseModel

load_dotenv()
groq = Groq()

class TitleSummary(BaseModel):
    title: str
    summary: str

def summarize_title_content(content):
    return TitleSummary.model_validate_json(groq.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": """In a few words, provide a title for this documentation page based on what it discusses. In 1-3 sentences, summarize the main focus of this scraped documentation page. It should have the important keywords and concepts for later running a semantic search. In the summary, omit anything general about the fact that these are documentation pages. Only discuss the specific unique main points of this particular page. Disregard any navigation bar links.
                Your response should be in JSON. The JSON schema should include:
  {
    "title": "string (few words to title the page, such as 'OpenAI Compatability' or 'Quickstart Instructions')",
    "summary": "string (few sentences to summarize the contents, in the style of the examples)"
  }
                """,
            },
            {
                "role": "user",
                "content": f"Summarize the main points: \n<content>{content}</content>\n<examples>\n1. The page focuses on OpenAI compatibility with Groq's APIs, highlighting differences and limitations. It covers unsupported fields in text completion, temperature handling, audio transcription and translation restrictions, and provides the base URL for Groq's OpenAI-compatible API endpoint.\n\n2. This page showcases various AI applications and demos built using Groq, including text editors, chatbots, voice assistants, and RAG systems. It highlights the speed and capabilities of Groq's AI infrastructure across different use cases and integrations.\n\n3. This page details Groq's Speech to Text API, which uses the Whisper model for audio transcription and translation. It covers API endpoints, supported file formats, optional parameters, and provides code examples for both transcription and translation tasks.</examples>\nProvide your response in JSON with the title and summary.",
            },
        ],
        temperature=0.3,
        max_tokens=1020,
        top_p=1,
        stream=False,
        stop=None,
        response_format={"type": "json_object"}
    ).choices[0].message.content)
