
export default async function handler(req, res) {
  const { mood } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant suggesting sound frequencies based on emotional mood." },
        { role: "user", content: `Suggest a sound therapy frequency for someone feeling ${mood}.` }
      ]
    }),
  });

  const data = await response.json();
  res.status(200).json({ reply: data.choices?.[0]?.message?.content || "No response" });
}
