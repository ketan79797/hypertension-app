export default async function handler(req, res) {
  const { mood } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You suggest healing sound frequencies like 528Hz, 432Hz, etc. based on emotional moods.",
          },
          {
            role: "user",
            content: `Suggest the best healing sound frequency for someone feeling "${mood}" and explain why.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    console.log("🔍 OpenAI raw response:", data);

    const reply = data?.choices?.[0]?.message?.content;
    res.status(200).json({ reply: reply || "No AI suggestion received." });

  } catch (error) {
    console.error("🚨 OpenAI Error:", error);
    res.status(500).json({ reply: "AI Error: " + error.message });
  }
}
