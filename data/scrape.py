from firecrawl import FirecrawlApp
import os
import json
from dotenv import load_dotenv
from urllib.parse import urlparse
import re

# Load environment variables
load_dotenv()

# Initialize FirecrawlApp
app = FirecrawlApp(api_key=os.environ.get("FC_API_KEY"))

# Function to create a valid filename from URL
def url_to_filename(url):
    path = urlparse(url).path
    path = path.strip('/')
    path = path.replace('/', '_')
    path = re.sub(r'[^a-zA-Z0-9_]', '_', path)
    return f"{path}.md"

# Function to save results to JSON file
def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# Function to load results from JSON file
def load_from_json(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        return json.load(f)

# Check if cache file exists
cache_file = 'cache.json'
if os.path.exists(cache_file):
    print("Loading results from cache...")
    crawl_result = load_from_json(cache_file)
else:
    print("Crawling website...")
    crawl_result = app.crawl_url('https://console.groq.com/docs', {'crawlerOptions': {'excludes': ['blog/*']}})
    save_to_json(crawl_result, cache_file)
    print("Results saved to cache.")

# Create export directory if it doesn't exist
export_dir = 'export'
os.makedirs(export_dir, exist_ok=True)

# Process each result
for result in crawl_result:
    markdown_content = f"[{result['metadata']['ogTitle']}]({result['metadata']['sourceURL']})\n\n{result['markdown']}"
    filename = url_to_filename(result['metadata']['sourceURL'])
    file_path = os.path.join(export_dir, filename)
    
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(markdown_content)
    
    print(f"Saved: {file_path}")

print("Scraping and exporting completed.")