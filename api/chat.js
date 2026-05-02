import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { history, latestMsg, userName } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing GEMINI_API_KEY environment variable. Add it in Vercel settings.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const systemMsg = `You are 'AskMNIT', an empathetic, street-smart senior B.Tech student from MNIT Jaipur. You are talking to your junior, whose name is ${userName || 'Junior'}. You must ONLY reply in 'WhatsApp Hinglish' (Hindi written in the English alphabet mixed with English). Keep sentences short, punchy, and conversational like texting. Use emojis naturally. Act like a real human peer, validate their college stress, and give practical 'jugaad' (solutions). NEVER say 'As an AI' or break character. Your job is to help them survive academics and campus life.`;

    const formattedHistory = (history || []).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: systemMsg 
    });

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage([{text: latestMsg}]);
    
    return res.status(200).json({ reply: result.response.text() });
  } catch (error) {
    console.error("Gemini Backend Error:", error);
    return res.status(500).json({ reply: "Arre bhai, MNIT ka wifi lagta hai band pad gaya. Server down hai, thodi der me try kar! 💀" });
  }
}
