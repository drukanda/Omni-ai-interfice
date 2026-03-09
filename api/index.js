const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  // Pengaturan Header agar bisa diakses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // 1. TAMPILAN (FRONTEND) - Gaya Neural Link kamu
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Omni-AI v800</title>
        <style>
          body { background: #080a0c; color: #00f2ff; font-family: 'Courier New', monospace; margin: 0; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
          .status { text-align: center; padding: 10px; font-size: 10px; letter-spacing: 2px; border-bottom: 1px solid #1a1a1a; color: #00f2ff; text-transform: uppercase; }
          #display { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; scroll-behavior: smooth; }
          .msg { max-width: 85%; padding: 12px; border-radius: 4px; font-size: 14px; line-height: 1.4; }
          .user { align-self: flex-end; color: #fff; background: #1a1a1a; border: 1px solid #333; }
          .ai { align-self: flex-start; color: #00f2ff; border-left: 2px solid #00f2ff; background: rgba(0, 242, 255, 0.05); }
          .input-box { padding: 15px; border-top: 1px solid #1a1a1a; background: #000; }
          input { width: 100%; background: #0a0c0e; border: 1px solid #00f2ff; color: #fff; padding: 12px; outline: none; box-sizing: border-box; font-family: inherit; }
        </style>
      </head>
      <body>
        <div class="status">NEURAL LINK V800 ULTRA - ONLINE</div>
        <div id="display"></div>
        <div class="input-box">
          <input type="text" id="in" placeholder="INPUT COMMAND..." onkeypress="exec(event)">
        </div>
        <script>
          async function exec(e) {
            if (e.key === 'Enter' && e.target.value) {
              const d = document.getElementById('display');
              const val = e.target.value;
              d.innerHTML += '<div class="msg user">> ' + val + '</div>';
              e.target.value = '';
              d.scrollTop = d.scrollHeight;
              
              try {
                const res = await fetch(window.location.href, {
                  method: 'POST',
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({ prompt: val })
                });
                const data = await res.json();
                d.innerHTML += '<div class="msg ai">' + (data.reply || data.error) + '</div>';
              } catch (err) {
                d.innerHTML += '<div class="msg ai">SYSTEM ERROR: CONNECTION LOST</div>';
              }
              d.scrollTop = d.scrollHeight;
            }
          }
        </script>
      </body>
      </html>
    `);
  }

  // 2. MESIN AI (BACKEND)
  try {
    const { prompt } = req.body;
    // Pastikan nama variabel di Vercel adalah GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) return res.status(500).json({ error: "KEY_MISSING: Masukkan GEMINI_API_KEY di Vercel Settings." });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.status(200).json({ reply: response.text() });
  } catch (err) {
    res.status(500).json({ error: "LINK_ERROR", details: err.message });
  }
};
