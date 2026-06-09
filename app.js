async function generate() {
  const input = document.getElementById("prompt");
  const chat = document.getElementById("chat");

  const text = input.value.trim();
  if (!text) return;

  chat.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = "";

  const msgId = "msg-" + Date.now();
  chat.innerHTML += `<div id="${msgId}" class="msg bot"></div>`;

  const msgDiv = document.getElementById(msgId);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Reply naturally."
        },
        {
          role: "user",
          content: text
        }
      ],
      stream: true
    })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");

    for (let line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.replace("data: ", "");

        if (data === "[DONE]") return;

        try {
          const json = JSON.parse(data);
          const content = json.choices[0].delta?.content;

          if (content) {
            fullText += content;
            msgDiv.innerHTML = fullText.replace(/\n/g, "<br>");
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  }
}
