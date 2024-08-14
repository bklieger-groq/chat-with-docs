// import { tool } from 'ai'
// import { z } from 'zod'

// const searchResultItemSchema = z.object({
//   title: z.string(),
//   url: z.string().url(),
//   content: z.string()
// })

// type TypeSearchResultItem = z.infer<typeof searchResultItemSchema>

// const filterSearchResultsSchema = z.object({
//   searchResults: z.array(searchResultItemSchema),
//   indicesToKeep: z.array(z.number().int().nonnegative())
// })

// export const filterSearchResultsTool = tool({
//   description: 'Filter search results by keeping only the items at specified indices. This tool takes an array of search result items and an array of indices, and returns a new array containing only the items at the specified indices.',
//   parameters: filterSearchResultsSchema,
//   execute: async ({ searchResults, indicesToKeep }) => {
//     // Filter the search results based on the provided indices
//     const filteredResults = indicesToKeep
//       .sort((a, b) => a - b) // Sort indices to maintain original order
//       .map(index => searchResults[index])
//       .filter((item): item is TypeSearchResultItem => item !== undefined) // Remove any undefined items (in case of out-of-bounds indices)

//     return filteredResults
//   }
// })