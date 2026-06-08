async function generate() {
  const input = document.getElementById("prompt");
  const chat = document.getElementById("chat");

  const text = input.value.trim();
  if (!text) return;

  // Show user message
  chat.innerHTML += `<div class="msg user">${text}</div>`;
  input.value = "";

  // Loading message
  const loadingId = "load-" + Date.now();
  chat.innerHTML += `<div id="${loadingId}" class="msg bot">Generating...</div>`;

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
          {
            role: "system",
            content: "You are BOBA.ai. Generate ONLY clean HTML with inline CSS for a beautiful A4 assignment cover page. No explanations. No markdown. Only HTML."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await res.json();

    console.log("Groq response:", data); // debug

    // safety check
    if (!data.choices || !data.choices[0]) {
      document.getElementById(loadingId).innerText =
        "Error: Invalid response from AI. Check console (F12)";
      return;
    }

    let html = data.choices[0].message.content;

    // remove accidental code blocks
    html = html.replace(/```html|```/g, "");

    document.getElementById(loadingId).outerHTML =
      `<div class="msg bot"><div class="cover">${html}</div></div>`;

  } catch (err) {
    console.error(err);
    document.getElementById(loadingId).innerText =
      "Network/API error. Check API key or internet.";
  }
}
