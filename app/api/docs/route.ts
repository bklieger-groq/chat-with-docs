import { NearTextType, SearchResults, SearchResultItem } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    const weaviateClusterUrl = process.env.WCD_URL?.replace("https://", "")

    let headers: { [key: string]: string } = {};

    if (process.env.OPENAI_API_KEY) {
      headers['X-OpenAI-Api-Key'] = process.env.OPENAI_API_KEY;
    }
    
    const client: WeaviateClient = weaviate.client({
      scheme: 'https',
      host: weaviateClusterUrl,
      apiKey: new ApiKey(process.env.WCD_API_KEY),
      headers: headers,
    });

    let nearText: NearTextType = {
      concepts: [query ?? "What is Groq?"], // Backup for pickup up generic material in case tool calling fails.
      certainty: 0.90
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

    return NextResponse.json(searchResults);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}