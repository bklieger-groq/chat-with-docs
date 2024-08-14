import { createStreamableUI } from 'ai/rsc'
import { docSearchTool } from './doc-search'

export interface ToolProps {
  uiStream: ReturnType<typeof createStreamableUI>
  fullResponse: string
}

export const getDocTools = ({ uiStream, fullResponse }: ToolProps) => {
  const tools: any = {
    docSearch: docSearchTool({
      uiStream,
      fullResponse
    }),
  }

  return tools
}
