const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(req.body.pesan);
      return res.status(200).json({ jawaban: result.response.text() });
    } catch (err) {
      return res.status(500).json({ jawaban: "API Error: Cek API Key di Vercel" });
    }
  }
  res.status(200).send("Neural Link Active");
};
