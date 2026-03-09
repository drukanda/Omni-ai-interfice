const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Pengaturan Header agar tidak error saat dipanggil
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. TAMPILAN (FRONTEND) - Tetap gaya lama kamu
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { background: #080a0c; color: #00f2ff; font-family: sans-serif; margin: 0; display: flex; flex-direction: column; height: 100vh; }
          .status { text-align: center; padding: 10px; font-size: 10px; letter-spacing: 2px; border-bottom: 1px solid #1a1a1a; color: #00f2ff; opacity: 0.7; }
          #display { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
          .msg { max-width: 80%; padding: 10px; border-radius: 5px; font-size: 14px; }
          .user { align-self: flex-end; color: #fff; background: #1a1a1a; }
          .ai { align-self: flex-start; color: #00f2ff; border-left: 1px solid #00f2ff; }
          .input-box { padding: 20px; border-top: 1px solid #1a1a1a; }
          input { width: 100%; background: transparent; border: 1px solid #00f2ff; color: #fff; padding: 12px; outline: none; box-sizing: border-box; }
        </style>
      </head>
      <body>
        <div class="status">NEURAL LINK V4.2 ACTIVE</div>
        <div id="display"></div>
        <div class="input-box">
          <input type="text" id="in" placeholder="Ketik perintah..." onkeypress="exec(event)">
        </div>
        <script>
          async function exec(e) {
            if (e.key === 'Enter' && e.target.value) {
              const d = document.getElementById('display');
              const val = e.target.value;
              d.innerHTML += '<div class="msg user">' + val + '</div>';
              e.target.value = '';
              d.scrollTop = d.scrollHeight;
              
              const res = await fetch(window.location.href, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ prompt: val })
              });
              const data = await res.json();
              d.innerHTML += '<div class="msg ai">' + (data.reply || data.error) + '</div>';
              d.scrollTop = d.scrollHeight;
            }
          }
        </script>
      </body>
      </html>
    `);
  }

  // 2. MESIN AI (BACKEND) - Solusi error v1beta
  try {
    const { prompt } = req.body;
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: "KEY MISSING" });

    // PAKSA KE MODEL STABIL
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ reply: response.text() });
  } catch (err) {
    res.status(500).json({ error: "LINK ERROR", details: err.message });
  }
};
