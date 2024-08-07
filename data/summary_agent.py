from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

groq = Groq()

def summarize_content(content):
    return groq.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {
                "role": "system",
                "content": "In 1-3 sentences, summarize the main focus of this scraped documentation page. It should have the important keywords and concepts for later running a semantic search. Provide ONLY the SUMMARY, no preamble introducing it. Omit anything general about the fact that these are documentation pages. Only discuss the specific unique main points of this particular page. Disregard any navigation bar links.",
            },
            {
                "role": "user",
                "content": f"Summarize the main points: \n<content>{content}</content>\n<examples>\n1. The page focuses on OpenAI compatibility with Groq's APIs, highlighting differences and limitations. It covers unsupported fields in text completion, temperature handling, audio transcription and translation restrictions, and provides the base URL for Groq's OpenAI-compatible API endpoint.\n\n2. This page showcases various AI applications and demos built using Groq, including text editors, chatbots, voice assistants, and RAG systems. It highlights the speed and capabilities of Groq's AI infrastructure across different use cases and integrations.\n\n3. This page details Groq's Speech to Text API, which uses the Whisper model for audio transcription and translation. It covers API endpoints, supported file formats, optional parameters, and provides code examples for both transcription and translation tasks.</examples>",
            },
        ],
        temperature=0.3,
        max_tokens=500,
        top_p=1,
        stream=False,
        stop=None,
    ).choices[0].message.content