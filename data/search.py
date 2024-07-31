import weaviate
from weaviate.classes.init import Auth
from weaviate.classes.config import Property, DataType
from weaviate.exceptions import UnexpectedStatusCodeError
from dotenv import load_dotenv
import os

from getDocs import get_docs


load_dotenv()

wcd_url = os.environ["WCD_URL"]
wcd_api_key = os.environ["WCD_API_KEY"]
openai_api_key = os.environ["OPENAI_API_KEY"]

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=wcd_url,
    auth_credentials=Auth.api_key(wcd_api_key),
    headers={'X-OpenAI-Api-key': openai_api_key}
)

documentation = client.collections.get("GroqCloudDocumentation")

response = documentation.query.near_text(
    query="What models are available?",
    limit=1
)

print(response.objects[0].properties)

client.close()