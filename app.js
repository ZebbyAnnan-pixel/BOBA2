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
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "You are BOBA.ai. Generate ONLY clean HTML with inline CSS for an A4 assignment cover page. No explanations."
          },
          {
            role: "user",
            content: text
          }
        ]
      })
    });

    const data = await res.json();

    console.log("API RESPONSE:", data); // IMPORTANT DEBUG

    if (!data.choices) {
      document.getElementById(loadingId).innerText =
        "Error: API not responding. Check console (F12)";
      return;
    }

    let html = data.choices[0].message.content;
    html = html.replace(/```html|```/g, "");

    document.getElementById(loadingId).outerHTML =
      `<div class="msg bot">${html}</div>`;

  } catch (err) {
    document.getElementById(loadingId).innerText =
      "Network error. Check API key or internet.";
    console.error(err);
  }
}
