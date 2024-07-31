import os
import re

def parse_md_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    # Parse title and URL
    title_url_pattern = r'\[(.*?)\]\((.*?)\)'
    match = re.search(title_url_pattern, content)
    
    if match:
        title = match.group(1)
        url = match.group(2)
    else:
        title = "No title found"
        url = "No URL found"

    # Parse content (everything after the title and URL)
    content_pattern = r'\[.*?\]\(.*?\)\s*\n\n([\s\S]*)'
    content_match = re.search(content_pattern, content)
    
    if content_match:
        parsed_content = content_match.group(1).strip()
    else:
        parsed_content = "No content found"

    return {
        'title': title,
        'url': url,
        'content': parsed_content
    }

def parse_all_md_files(directory):
    parsed_files = []
    
    for filename in os.listdir(directory):
        if filename.endswith('.md'):
            file_path = os.path.join(directory, filename)
            parsed_data = parse_md_file(file_path)
            parsed_files.append(parsed_data)
    
    return parsed_files

def get_docs(docs_directory="docs"):
    return parse_all_md_files(docs_directory)

# Usage example
if __name__ == "__main__":
    parsed_documents = get_docs()
    for doc in parsed_documents:
        print(f"Title: {doc['title']}")
        print(f"URL: {doc['url']}")
        print(f"Content: {doc['content'][:50]}...")  # Print first 50 characters of content
        print("\n" + "-"*50 + "\n")