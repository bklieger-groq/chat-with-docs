import { createStreamableUI, createStreamableValue } from 'ai/rsc'
import { CoreMessage, ToolCallPart, ToolResultPart, streamText } from 'ai'
import { getDocTools } from './tools'
import { AnswerSection } from '@/components/answer-section'
import { createOpenAI } from '@ai-sdk/openai'

export async function researcher(
  uiStream: ReturnType<typeof createStreamableUI>,
  streamableText: ReturnType<typeof createStreamableValue<string>>,
  messages: CoreMessage[]
) {
  let fullResponse = ''
  let hasError = false
  let finishReason = ''

  let processedMessages = messages



  const streamableAnswer = createStreamableValue<string>('')
  const answerSection = <AnswerSection result={streamableAnswer.value} />


  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  })


  const result = await streamText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    maxTokens: 500,
    system: `As a professional documentation search expert, you possess the ability to search for any information in the Groq developer documentation.

    Find a search query that is likely to directly address the user's question. The search is semantic. Include relevant keywords and concepts.

    Only complete one search. Do not provide multiple queries. Your query should be comprehensive.

    (1) Your search must include the name of the software or platform in it.
    (2) Your search should be a full question.

    Examples:
    "What client libraries does Groq have?"
    "What models are available on Groq?"
    `,
    messages: processedMessages,
    tools: getDocTools({
      uiStream,
      fullResponse
    }),
    toolChoice: 'required',
    onFinish: async event => {
      // console.log(JSON.stringify(processedMessages, null, 2))
      finishReason = event.finishReason
      fullResponse = event.text
      streamableAnswer.done()
    }
  }).catch(err => {
    hasError = true
    fullResponse = 'Error: ' + err.message
    streamableText.update(fullResponse)
  })

  // If the result is not available, return an error response
  if (!result) {
    return { result, fullResponse, hasError, toolResponses: [] }
  }

  const hasToolResult = messages.some(message => message.role === 'tool')
  if (hasToolResult) {
    uiStream.append(answerSection)
  }

  // Process the response
  const toolCalls: ToolCallPart[] = []
  const toolResponses: ToolResultPart[] = []
  for await (const delta of result.fullStream) {
    switch (delta.type) {
      case 'text-delta':
        if (delta.textDelta) {
          fullResponse += delta.textDelta
            streamableAnswer.update(fullResponse)
        }
        break
      case 'tool-call':
        toolCalls.push(delta)
        break
      case 'tool-result':
        if (!delta.result) {
          hasError = true
        }
        toolResponses.push(delta)
        break
      case 'error':
        console.log('Error: ' + delta.error)
        hasError = true
        fullResponse += `\nError occurred while executing the tool`
        break
    }
  }
  messages.push({
    role: 'assistant',
    content: [{ type: 'text', text: fullResponse }, ...toolCalls]
  })

  if (toolResponses.length > 0) {
    // Add tool responses to the messages
    messages.push({ role: 'tool', content: toolResponses })
  }

  return { result, fullResponse, hasError, toolResponses, finishReason }
}
