const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const result = await model.generateContent(req.body.pesan);
      const balasanTeks = result.response.text();
      
      // Kita kirim dengan nama 'jawaban'
      return res.status(200).json({ jawaban: balasanTeks });
    } catch (err) {
      return res.status(500).json({ jawaban: "Error: Koneksi API Gagal" });
    }
  }
  res.status(200).send("Quantum Engine Online");
};
