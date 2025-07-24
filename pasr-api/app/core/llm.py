from openai import OpenAI
from app.config import config


client = OpenAI(api_key=config.openai_api_key, base_url=config.openai_api_base_url)


def chat(prompt, model="gpt-4.1-mini", max_tokens=2000, temperature=0.7, stream=False):
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=max_tokens,
        temperature=temperature,
        stream=stream,
    )
    if not stream:
        return response.choices[0].message.content
    else:
        for chunk in response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
