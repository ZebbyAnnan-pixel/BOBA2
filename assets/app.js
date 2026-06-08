async function generate() {
  const prompt = document.getElementById("prompt").value;
  const preview = document.getElementById("preview");
  const loading = document.getElementById("loading");
  const downloadBtn = document.getElementById("downloadBtn");

  if (!prompt) return;

  loading.classList.remove("hidden");
  preview.innerHTML = "";
  downloadBtn.classList.add("hidden");

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
            content: "You are BOBA.ai. Generate ONLY clean HTML with inline CSS for a beautiful A4 assignment cover page. No explanations. No markdown. Just HTML."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();
    let html = data.choices[0].message.content;

    // Clean accidental markdown
    html = html.replace(/```html|```/g, "");

    preview.innerHTML = html;
    downloadBtn.classList.remove("hidden");

  } catch (err) {
    preview.innerHTML = "Error generating design.";
    console.error(err);
  }

  loading.classList.add("hidden");
}

function download() {
  window.print();
}
