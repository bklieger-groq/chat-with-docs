import { NearTextType } from '@/lib/types'
import type { NextApiRequest, NextApiResponse } from 'next';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  try {
    const { method } = req;
    let { query } = req.body;

    const weaviateClusterUrl = process.env.WCD_URL?.replace("https://", "")

    switch (method) {

      case 'POST': {

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
          concepts: [],
        }

        nearText.certainty = .6

        nearText.concepts = query;

        let recDataBuilder = client.graphql
          .get()
          .withClassName('content')
          .withFields(
            'title url'
          )
          .withNearText(nearText)
          .withLimit(20);
        
      const recData = await recDataBuilder.do();

        res.status(200).json(recData);
        break;
      }
      default:
        res.status(400);
        break;
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
}
