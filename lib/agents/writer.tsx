import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { AnswerSection } from '@/components/answer-section'
import { AnswerSectionGenerated } from '@/components/answer-section-generated'

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

  await streamText({
    model: groq!.chat('llama3-70b-8192'),
    maxTokens: 2500,
    system: `As a professional writer, your job is to generate a comprehensive and informative, yet concise answer of 400 words or less for the given question based solely on the provided search results (URL and content). You must only use information from the provided search results. Use a concise and straightforward tone. Combine search results together into a coherent answer. Do not repeat text. If there are any images relevant to your answer, you can include them as well. Aim to directly address the user's question, augmenting your response with insights gleaned from the search results. 
    Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly. Please match the language of the response to the user's language.
    Always answer in Markdown format. Links and images must follow the correct format.
    Link format: [link text](url)
    Image format: ![alt text](url)
    `,
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
