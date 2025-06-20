export default async function handler(req, res) {
  const { mood } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ reply: "Missing OpenAI API Key" });
  }

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
            content: "You are a helpful assistant that suggests healing sound frequencies like 432Hz or 528Hz based on mood.",
          },
          {
            role: "user",
            content: `Suggest a healing sound frequency for someone who is feeling ${mood}.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    if (reply) {
      res.status(200).json({ reply });
    } else {
      console.error("OpenAI gave empty response:", data);
      res.status(200).json({ reply: "AI did not return a suggestion." });
    }

  } catch (error) {
    console.error("OpenAI error:", error);
    res.status(500).json({ reply: "AI Error: " + error.message });
  }
}
