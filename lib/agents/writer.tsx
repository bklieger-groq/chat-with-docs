import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { AnswerSection } from '@/components/answer-section'

export async function writer(
  uiStream: ReturnType<typeof createStreamableUI>,
  messages: CoreMessage[]
) {
  let fullResponse = ''
  let hasError = false
  const streamableAnswer = createStreamableValue<string>('')
  const answerSection = <AnswerSection result={streamableAnswer.value} />
  uiStream.append(answerSection)

  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  })
  // console.log(JSON.stringify(messages, null, 2));

  await streamText({
    model: groq!.chat('llama-3.1-8b-instant'), //llama-3.1-8b-instant
    maxTokens: 2500,
    system: `As a professional writer, your job is to generate a comprehensive and informative, yet concise answer of 400 words or less for the given question based solely on the provided search results (URL and content). You must only use information from the provided search results. Use a concise and straightforward tone.  Aim to directly address the user's question using context from the provided search results. 

    Remember:
    1. Do not make claims about what any company or person thinks or believes unless you are citing directly from the results.
    2. Some provided context may be irrelevant to the user's question. Omit anything relating to irrelevant content.
    3. Incorporate as much of the relevent material as possible while keeping it formatted with markdown and links. 
    4. Link back to the pages and their links whenever possible. You can also include tables and code.
    5. Do not try to overly interpret the documentation. Provide the relevant parts back to the user near exactly as written.

    Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly. Please match the language of the response to the user's language.
    Always answer in Markdown format. Links and images must follow the correct format.
    Link format: [link text](url)
    Image format: ![alt text](url)`,
    messages,
    onFinish: event => {
      fullResponse = event.text
      streamableAnswer.done(event.text)
    }
  })
    .then(async result => {
      for await (const text of result.textStream) {
        if (text) {
          fullResponse += text
          streamableAnswer.update(fullResponse)
        }
      }
    })
    .catch(err => {
      hasError = true
      fullResponse = 'Error: ' + err.message
      streamableAnswer.update(fullResponse)
    })

  return { response: fullResponse, hasError }
}
