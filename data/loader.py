import weaviate
from weaviate.classes.init import Auth
from weaviate.classes.config import Property, DataType
from dotenv import load_dotenv
import os

load_dotenv()

wcd_url = os.environ["WCD_URL"]
wcd_api_key = os.environ["WCD_API_KEY"]
openai_api_key = os.environ["OPENAI_API_KEY"]

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=wcd_url,
    auth_credentials=Auth.api_key(wcd_api_key),
    headers={'X-OpenAI-Api-key': openai_api_key}
)

# Create collection for the documentation content
client.collections.create(
    "GroqCloudDocumentation",
    properties=[
        Property(name="url", data_type=DataType.TEXT),
        Property(name="title", data_type=DataType.TEXT),
        Property(name="content", data_type=DataType.TEXT),
    ]
)

documentation = client.collections.get("GroqCloudDocumentation")

uuid = documentation.data.insert({
    "url": "https://console.groq.com/docs/models",
    "title": "Supported Models",
    "content": "GroqCloud currently supports the following models:...",
})

print(uuid)  # the return value is the object's UUID

client.close()