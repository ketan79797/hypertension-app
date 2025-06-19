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
            content: "You are a helpful assistant that suggests healing sound frequencies (e.g., 432Hz, 528Hz, etc.) based on the user's emotional state.",
          },
          {
            role: "user",
            content: `Suggest a sound therapy frequency for someone feeling ${mood}.`,
          },
        ],
      }),
    });

    const data = await response.json();

    // Log for debug
    console.log("OpenAI raw response:", JSON.stringify(data));

    const reply = data?.choices?.[0]?.message?.content;
    res.status(200).json({ reply: reply || "Error: OpenAI returned no content." });

  } catch (error) {
    console.error("OpenAI API failed:", error);
    res.status(500).json({ reply: "AI service error: " + error.message });
  }
}
