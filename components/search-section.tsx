'use client'

import { SearchResults } from './search-results'
import { SearchSkeleton } from './search-skeleton'
import { SearchResultsImageSection } from './search-results-image'
import { Section } from './section'
import { ToolBadge } from './tool-badge'
import type { SearchResults as TypeSearchResults, SearchResultItem as TypeSearchResultItem, InputResult as TypeInputResult,  } from '@/lib/types'
import { StreamableValue, useStreamableValue } from 'ai/rsc'

export type SearchSectionProps = {
  result?: StreamableValue<string>
  includeDomains?: string[]
}



export function transformSearchResults(input: StreamableValue<any, any> | undefined): TypeSearchResults {
  if (!input) {
      throw new Error('StreamableValue does not contain a value');
  }

  const inputResult = input as TypeInputResult;

  const searchResultItems: TypeSearchResultItem[] = inputResult.result.results.map(item => ({
    title: item.title,
    url: item.url,
    content: item.content
  }));

  return {
    results: searchResultItems,
    query: inputResult.args.url // Using the URL as the query, adjust if needed
  };
}


export function SearchSection({ result, includeDomains }: SearchSectionProps) {
  const [data, error, pending] = useStreamableValue(result)
  const searchResults: TypeSearchResults = transformSearchResults(data ? JSON.parse(data) : undefined)

  const includeDomainsString = includeDomains
    ? ` [${includeDomains.join(', ')}]`
    : ''
  return (
    <div>
      {!pending && data ? (
        <>
          {/* <Section size="sm" className="pt-2 pb-0">
            <ToolBadge tool="search">{`${searchResults.query}${includeDomainsString}`}</ToolBadge>
          </Section> */}
          <Section title="Groq Documentation">
            <SearchResults results={searchResults.results} />
          </Section>
        </>
      ) : (
        <Section className="pt-2 pb-0">
          <SearchSkeleton />
        </Section>
      )}
    </div>
  )
}
