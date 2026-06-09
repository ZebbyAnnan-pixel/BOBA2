async function generate() {
  const input = document.getElementById("prompt");
  const chat = document.getElementById("chat");

  const text = input.value.trim();
  if (!text) return;

  // user message
  chat.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = "";

  const id = "msg-" + Date.now();
  chat.innerHTML += `<div id="${id}" class="msg bot">Thinking...</div>`;

  chat.scrollTop = chat.scrollHeight;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a helpful AI assistant." },
          { role: "user", content: text }
        ]
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Error";

    document.getElementById(id).innerText = reply;

  } catch (err) {
    document.getElementById(id).innerText = "Error.";
  }

  chat.scrollTop = chat.scrollHeight;
}
