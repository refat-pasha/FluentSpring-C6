import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();
const PORT = process.env.PORT || 8787;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini";
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);

app.disable("x-powered-by");
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("This website origin is not allowed by the tutor server."));
  },
  methods: ["GET", "POST"], allowedHeaders: ["Content-Type"]
}));
app.use(express.json({ limit: "20kb" }));
app.use("/api/", rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: "draft-7", legacyHeaders: false,
  message: { error: "A short pause, please. Try again in a minute." }
}));

app.get("/api/health", (_req, res) => res.json({ ok: true, aiReady: Boolean(OPENAI_API_KEY), service: "FluentSpring tutor" }));

const tutorInstructions = `
You are FluentSpring, a kind, patient English-learning tutor for school-age learners.
Keep every interaction age-appropriate, respectful, non-romantic and safe. Stay focused on English learning and everyday, school-appropriate topics. Do not request personal contact details, exact addresses, passwords, private photos, or sensitive personal information. If a learner shares sensitive details, gently encourage them not to share private information online and return to a safe learning topic.
Have open-ended conversations. Ask one natural follow-up question at a time. Adapt to beginner/intermediate English and never shame a learner for mistakes.
Give accurate, concise teaching feedback. Distinguish grammar errors from stylistic preferences. Do not claim an accent is wrong or score a person's identity/voice. Explain corrections simply.
Return ONLY valid JSON with these keys:
{"reply":"natural conversational reply with one follow-up question where appropriate","correction":"corrected sentence or empty string","explanation":"short grammar explanation or empty string","vocabulary":[{"word":"...","meaning":"simple definition","example":"short example sentence"}],"naturalAlternative":"more natural alternative or empty string"}
Give at most 3 vocabulary items. If the learner's sentence is already correct, say so kindly and focus on extending the conversation. Do not invent errors.
`;

app.post("/api/tutor", async (req, res) => {
  if (!OPENAI_API_KEY) return res.status(503).json({ error: "The AI tutor has not been configured by the site administrator yet." });
  const messages = req.body?.messages;
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12)
    return res.status(400).json({ error: "Please send a conversation with up to 12 recent messages." });
  const cleanMessages = [];
  for (const item of messages) {
    if (!item || !["user", "assistant"].includes(item.role) || typeof item.content !== "string" ||
        !item.content.trim() || item.content.length > 1200)
      return res.status(400).json({ error: "One of the messages is invalid or too long." });
    cleanMessages.push({ role: item.role, content: item.content.trim() });
  }
  if (cleanMessages.at(-1)?.role !== "user")
    return res.status(400).json({ error: "The latest conversation message must be from the learner." });

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OPENAI_MODEL, instructions: tutorInstructions,
        input: cleanMessages.map(m => ({ role: m.role, content: m.content })),
        text: { format: { type: "json_object" } },
        max_output_tokens: 700
      })
    });
    const payload = await response.json();
    if (!response.ok) {
      console.error("OpenAI API request failed:", response.status, payload?.error?.type || "unknown");
      return res.status(502).json({ error: "The AI tutor is temporarily unavailable. Please try again shortly." });
    }
    const output = payload.output_text || (payload.output || []).flatMap(x => x.content || []).map(x => x.text || "").join("\n");
    let result;
    try { result = JSON.parse(output); }
    catch { return res.status(502).json({ error: "The tutor returned an unreadable response. Please try again." }); }
    return res.json({
      reply: String(result.reply || "Let's keep practising!"),
      correction: String(result.correction || ""), explanation: String(result.explanation || ""),
      vocabulary: Array.isArray(result.vocabulary) ? result.vocabulary.slice(0, 3) : [],
      naturalAlternative: String(result.naturalAlternative || "")
    });
  } catch (error) {
    console.error("Tutor backend error:", error.message);
    return res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});

app.get("/health", (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`FluentSpring tutor backend listening on ${PORT}`));
