// server.js
require("dotenv").config(); // npm i dotenv
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const app = express();
const port = parseInt(process.env.PORT || "3030", 10);
const API_KEY = process.env.GSB_API_KEY;

if (!API_KEY) {
  console.warn(
    "Warning: GSB_API_KEY not set in environment. Set GSB_API_KEY in .env"
  );
}

// Basic middleware
app.use(express.json());

// CORS: allow extension origin(s) during dev + local UI
app.use(
  cors({
    origin: ["*", "moz-extension://809fd8dc-b002-463f-879a-c98067f0379d"],
  })
);

// rate limit
app.use(
  rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || "60", 10),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Health check
app.get("/", (req, res) => {
  res.send("GSB proxy server up");
});

// Helper: make the Safe Browsing API call with timeout
async function checkUrlSafety(urlToCheck, timeoutMs = 8000) {
  if (!API_KEY) throw new Error("GSB_API_KEY not set");

  // validate URL
  let parsed;
  try {
    parsed = new URL(urlToCheck);
  } catch (err) {
    throw new Error("Invalid URL");
  }

  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

  const body = {
    client: { clientId: "anti-phish-server", clientVersion: "1.0" },
    threatInfo: {
      threatTypes: ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE"],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url: parsed.href }],
    },
  };

  // Timeout via AbortController (works with built-in fetch in Node 18+)
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // sending req to GSB API
    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(id);

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      const message = `Upstream error: ${resp.status} ${resp.statusText} ${text}`;
      const err = new Error(message);
      err.status = 502;
      throw err;
    }

    const data = await resp.json();
    const isDanger = Array.isArray(data.matches) && data.matches.length > 0;
    return {
      status: isDanger ? "danger" : "safe",
      matches: data.matches || [],
    };
  } catch (err) {
    // differentiate AbortError
    if (err.name === "AbortError") {
      const e = new Error("Safe Browsing request timeout");
      e.status = 504;
      throw e;
    }
    throw err;
  }
}

// POST /check   -> expects JSON body: { "url": "https://..." }
app.post("/check", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url)
      return res.status(400).json({ error: "Missing url in request body" });

    // call GSB
    const result = await checkUrlSafety(url);
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error("Error in /check:", err);
    const status = err.status || 500;
    return res.status(status).json({ ok: false, error: err.message });
  }
});

// generic error catcher
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ ok: false, error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
