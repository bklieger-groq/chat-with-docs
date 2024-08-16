"use server"
import { generateText, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { SearchResults as searchResultsType } from '@/lib/types'

const filterSearchResultsTool = tool({
  description: 'Filter search results based on relevance to the query',
  parameters: z.object({
    indicesToKeep: z.array(z.number()).describe('Indices of the most relevant search results'),
  }),
  execute: async ({ indicesToKeep }) => ({ indicesToKeep }),
})

export async function filterer(
  query: string,
  searchResults: searchResultsType
): Promise<searchResultsType> {
  const groq = createOpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
  })
  
  const response = await generateText({
    model: groq("llama3-groq-70b-8192-tool-use-preview"),
    messages: [
      {
        role: 'system',
        content: `As an AI search result filterer, your task is to analyze search results and determine which are most relevant to the given query. You will receive a query and a list of search results. Your goal is to select the most relevant results and return their indices.

        Analyze each search result carefully, considering its title, URL, and content in relation to the query. Focus on selecting results that directly address the user's question or provide the most pertinent information.

        Return your selection as a JSON array of indices corresponding to the most relevant results.`
      },
      {
        role: 'user',
        content: `Query: "${query}"

Search Results:
${JSON.stringify(searchResults, null, 2)}

Analyze these search results and return the indices of the most relevant ones as a JSON array.`
      }
    ],
    tools: {
      filterSearchResults: filterSearchResultsTool
    },
    toolChoice: "required"
  })

  const toolCallArgs = response.toolResults[0].args

  if (toolCallArgs.indicesToKeep) {
    const filteredIndices = toolCallArgs.indicesToKeep;

    const filteredResults = filteredIndices
      .map(index => {
        const result = searchResults.results[index];
        return result;
      })
      .filter(Boolean);

    return {
        results: filteredResults,
        query: searchResults.query
      };
 }

  // If no filtering occurred, return all results
  return searchResults
}