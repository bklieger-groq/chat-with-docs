import { DeepPartial } from 'ai'
import { z } from 'zod'

export const retrieveSchema = z.object({
  query: z.string().describe('The query to semantically search the documentation.')
})

export type PartialInquiry = DeepPartial<typeof retrieveSchema>
