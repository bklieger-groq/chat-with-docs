import { tool } from 'ai'
import { retrieveSchema } from '@/lib/schema/retrieve'
import { ToolProps } from '.'
import { SearchSkeleton } from '@/components/search-skeleton'
import { SearchResults as SearchResultsType } from '@/lib/types'
import RetrieveSection from '@/components/retrieve-section'

export const docSearchTool = ({ uiStream, fullResponse }: ToolProps) => tool({
  description: 'Retrieve content from the documentation',
  parameters: retrieveSchema,
  execute: async ({ query }) => {
    let hasError = false
    // Append the search section
    uiStream.append(<SearchSkeleton />)

    let results: SearchResultsType | undefined
    try {
        const response = await fetch('http://localhost:4000/api/docs', { // TODO: Change hard code
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query,
            })
          })
            .then((res) => {
              console.log(res)
              return res.json();
            });
            
      if (!response.data || response.data.length === 0) {
        hasError = true
      }
      
      results = response;

    } catch (error) {
      hasError = true
      console.error('Retrieve API error:', error)
    }

    if (hasError || !results) {
      fullResponse = `An error occurred while retrieving "${query}".`
      uiStream.update(null)
      return results
    }
    
    uiStream.update(<RetrieveSection data={results} />)

    return results
  }
})



