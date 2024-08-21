export type SearchResults = {
  results: SearchResultItem[]
  query: string
}

export type SearchResultItem = {
  title: string
  url: string
  content: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: AIMessage[]
  sharePath?: string
}

export interface InputResult {
  type: string;
  toolCallId: string;
  toolName: string;
  args: {
    url: string;
  };
  result: {
    results: {
      title: string;
      url: string;
      content: string;
    }[];
  };
}

export type AIMessage = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
  type?:
    | 'answer'
    | 'related'
    | 'skip'
    | 'inquiry'
    | 'input'
    | 'input_related'
    | 'tool'
    | 'followup'
    | 'end'
}

export interface NearTextType {
  concepts: [string] | [];
  certainty?: number;
  moveAwayFrom?: object;
}