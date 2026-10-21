import {OLLAMA_URL, MODEL_NAME} from "./config.js";

export async function askModel(messages)
{
    const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      think: false,
      stream: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }

  return data.message.content;
}