### Instructions

Create a virtual environment:
~~~
python3 -m venv .venv
~~~

Activate the virtual environment:
~~~
source .venv/bin/activate
~~~

Install the requirements:
~~~
pip install -r requirements.txt
~~~

Copy .env.example to .env:
~~~
cp .env.example .env
~~~
Fill out the .env variables.

Run loader.py:
~~~
python loader.py
~~~

On Weaviate Cloud, run the following GraphQL query:
```
{
  Get {
    GroqCloudDocumentation {
      url
      title
      content
    }
  }
}
```