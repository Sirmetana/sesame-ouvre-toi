import {OLLAMA_URL, MODEL_NAME} from "./config.js";

export async function askModel(messages)
{
    const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      format:{
        "title": "OrderObject",
        "type": "object",
        "properties":
        {
          "orderItems":
          {
            "type": "array",
            "items":
            {
              "type": "object",
              "properties": 
              {
                "id": 
                { 
                  "type": "integer", 
                  "description": "Menu item's ID"
                },
                "name": 
                { 
                  "type": "string", 
                  "description": "Menu item's name"
                },
                "quantity": 
                { 
                  "type": "integer", 
                  "description": "Quantity ordered"
                }
              },
              "required": ["id", "quantity"]
            }
          }
        },
        "required": ["orderItems"]
      },
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