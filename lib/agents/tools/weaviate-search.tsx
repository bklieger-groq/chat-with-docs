import { NearTextType, SearchResults, SearchResultItem } from '@/lib/types'
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

export async function weaviateSearch(query: string): Promise<SearchResults> {
    try {
        const weaviateClusterUrl = process.env.WCD_URL?.replace("https://", "")

        let headers: { [key: string]: string } = {};

        if (process.env.OPENAI_API_KEY) {
            headers['X-OpenAI-Api-Key'] = process.env.OPENAI_API_KEY;
        }
        
        if (!weaviateClusterUrl || !process.env.WCD_API_KEY) {
            throw Error("Environment variables missing for Weaviate.")
        }

        const client: WeaviateClient = weaviate.client({
            scheme: 'https',
            host: weaviateClusterUrl,
            apiKey: new ApiKey(process.env.WCD_API_KEY),
            headers: headers,
        });

        let nearText: NearTextType = {
            concepts: [query],
            certainty: 0.70
        }

        let recDataBuilder = client.graphql
            .get()
            .withClassName('GroqCloudDocumentation')
            .withFields('content title url')
            .withNearText(nearText)
            .withLimit(3);

        const recData = await recDataBuilder.do();

        const initialSearchResults: SearchResultItem[] = recData.data.Get.GroqCloudDocumentation.map((item: any): SearchResultItem => ({
            title: item.title,
            url: item.url,
            content: item.content
        }));

        const searchResults: SearchResults = {
            results: initialSearchResults,
            query: query
        };
        
        return searchResults;
    } catch (err) {
        console.error(err);
        throw new Error('Internal Server Error');
    }
}