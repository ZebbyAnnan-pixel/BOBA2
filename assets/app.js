async function generate() {
  const input = document.getElementById("prompt");
  const chat = document.getElementById("chat");

  const userText = input.value.trim();
  if (!userText) return;

  // Show user message
  chat.innerHTML += `
    <div class="message user">${userText}</div>
  `;

  input.value = "";

  // Show loading message
  const loadingId = "load-" + Date.now();
  chat.innerHTML += `
    <div id="${loadingId}" class="message bot loading">Generating...</div>
  `;

  chat.scrollTop = chat.scrollHeight;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
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
            content: "Generate ONLY clean HTML with inline CSS for a centered A4 assignment cover page. No text explanation. No markdown."
          },
          {
            role: "user",
            content: userText
          }
        ]
      })
    });

    const data = await response.json();

    let html = data.choices[0].message.content;

    // Clean markdown if exists
    html = html.replace(/```html|```/g, "");

    // Replace loading with result
    document.getElementById(loadingId).outerHTML = `
      <div class="message bot">
        <div class="cover">${html}</div>
      </div>
    `;

  } catch (err) {
    document.getElementById(loadingId).innerText = "Error generating design.";
    console.error(err);
  }

  chat.scrollTop = chat.scrollHeight;
}
