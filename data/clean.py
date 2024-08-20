import weaviate
from weaviate.classes.init import Auth
from dotenv import load_dotenv
import os
import argparse
from rich.console import Console
from rich.table import Table
from rich import print as rprint
from rich.text import Text

load_dotenv()

wcd_url = os.environ["WCD_URL"]
wcd_api_key = os.environ["WCD_API_KEY"]
openai_api_key = os.environ["OPENAI_API_KEY"]

client = weaviate.connect_to_weaviate_cloud(
    cluster_url=wcd_url,
    auth_credentials=Auth.api_key(wcd_api_key),
    headers={'X-OpenAI-Api-key': openai_api_key}
)

console = Console()

def get_collection_items():
    documentation = client.collections.get("GroqCloudDocumentation")
    response = documentation.query.fetch_objects(
        limit=100,
        include_vector=False
    ).objects
    
    items = []
    for item in response:
        items.append({
            "ID": str(item.uuid),
            "URL": item.properties.get("url", "N/A"),
            "Title": item.properties.get("title", "N/A"),
            "Summary": item.properties.get("summary", "N/A"),
            "Content Preview": item.properties.get("content", "")[:50] + "..."
        })
    return items

def display_table(items):
    table = Table(title="GroqCloudDocumentation Collection", show_lines=True)
    
    table.add_column("ID", style="cyan", width=38)
    table.add_column("URL", style="magenta", width=30)
    table.add_column("Title", style="green", width=30)
    table.add_column("Summary", style="yellow")
    table.add_column("Content Preview", style="blue", width=50)

    for item in items:
        table.add_row(
            Text(item["ID"], overflow="fold"),
            Text(item["URL"], overflow="fold"),
            Text(item["Title"], overflow="fold"),
            Text(item["Summary"], overflow="fold"),
            Text(item["Content Preview"], overflow="fold")
        )

    console.print(table)

def delete_item(item_id):
    collection = client.collections.get("GroqCloudDocumentation")
    try:
        collection.data.delete_by_id(item_id)
        rprint(f"[green]Item with ID {item_id} has been deleted successfully.[/green]")
    except Exception as e:
        rprint(f"[red]Error deleting item with ID {item_id}: {str(e)}[/red]")

def main():
    parser = argparse.ArgumentParser(description="Weaviate Collection Cleaner")
    parser.add_argument("--delete", type=str, help="Delete an item by its ID")
    args = parser.parse_args()

    if args.delete:
        delete_item(args.delete)
    else:
        items = get_collection_items()
        display_table(items)

    client.close()

if __name__ == "__main__":
    main()