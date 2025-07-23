import os
from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_API_BASE_URL", "https://api.openai.com/v1")


client = OpenAI(api_key=api_key, base_url=base_url)


def chat(prompt, model="gpt-4.1-mini", max_tokens=1000, temperature=0.7, stream=False):
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        temperature=temperature,
        stream=stream,
    )
    if not stream:
        return response.choices[0].message["content"]
    else:
        for chunk in response:
            yield "data: " + chunk.model_dump_json(exclude_defaults=True) + "\n\n"
