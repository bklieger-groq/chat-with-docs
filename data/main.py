from scrape import scrape_site
from loader import create_weaviate_embed_summarize_docs
from search import get_query_results

# (1) Scrape your docs (ensure you provide a URL to 
# a page on your docs) and save the exported results 
# as markdown files in export folder

scrape_site(website="https://console.groq.com/docs")

# (2) Create weaviate vector DB and save the exported
# pages after providing them with a title and summary

create_weaviate_embed_summarize_docs()

# (3) Test the results to get the top result from a 
# custom query to the weaviate DB

get_query_results("What models are available?")