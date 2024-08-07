import weaviate
from weaviate.classes.init import Auth
from weaviate.classes.config import Property, DataType
from weaviate.exceptions import UnexpectedStatusCodeError
from dotenv import load_dotenv
import os
from summary_agent import summarize_content

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

try:
    # Create the collection
    client.collections.create(
        "GroqCloudDocumentation",
        properties=[
            Property(name="url", data_type=DataType.TEXT),
            Property(name="title", data_type=DataType.TEXT),
            Property(name="summary", data_type=DataType.TEXT),
            Property(name="content", data_type=DataType.TEXT,skip_vectorization=True),
        ],
        vectorizer_config=weaviate.classes.config.Configure.Vectorizer.text2vec_openai(),
    )
    print("Collection 'GroqCloudDocumentation' created successfully.")
except UnexpectedStatusCodeError as e:
    # Check if the error is due to the collection already existing
    if e.status_code == 422 and "class name GroqCloudDocumentation already exists" in str(e):
        print("Collection 'GroqCloudDocumentation' already exists. Skipping creation.")
    else:
        # Re-raise the exception if it's a different error
        raise

documentation = client.collections.get("GroqCloudDocumentation")

docs = get_docs(docs_directory="export")

def add_record(url,title,content):
    return documentation.data.insert({
        "url": url,
        "title": title,
        "summary": summarize_content(f"{content}\nThis is the page URL: {url}"),
        "content": content,
    })


for doc in docs:
    print(f"Adding {doc['title']}")
    print(f"ID: {add_record(doc['url'],doc['title'],doc['content'])}")


# print(uuid)  # the return value is the object's UUID

client.close()