import express from "express";
import multer from "multer";
import cors from "cors";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

const upload = multer({ dest: "uploads/" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

// Debug endpoint to check available routes
app.get("/api/debug", (_req, res) => {
  res.json({ 
    message: "CORE PFP Generator API", 
    endpoints: ["/api/health", "/api/generate-avatar", "/api/debug"],
    timestamp: new Date().toISOString()
  });
});

// Avatar generation (image -> edited image) using gpt-image-1
app.post("/api/generate-avatar", upload.single("image"), async (req, res) => {
  console.log("=== GENERATE AVATAR REQUEST ===");
  console.log("File:", req.file);
  console.log("Body:", req.body);
  try {
    if (!req.file) return res.status(400).json({ error: "No image uploaded" });

    const stylePrompt = `Transform this image into a highly detailed digital illustration in a futuristic neon style.
Retain the composition, shapes and recognizability of the original subject, but stylize it with an intense electric-blue aura.
Outline the subject with glowing neon blue light, add soft blue energy mist and cosmic particles drifting in the background.
Integrate subtle glowing infinity symbols floating around to reinforce the theme.
The lighting should feel dramatic, with vivid highlights and deep shadows.
The overall look is otherworldly, cosmic, and powerful — like the subject is infused with radiant blue energy.`;

    // Read file as buffer to preserve MIME type information
    console.log("Using original file:", req.file.path, "mimetype:", req.file.mimetype);
    const imageBuffer = fs.readFileSync(req.file.path);
    
    // Create a file-like object with proper type information
    const imageFile = new File([imageBuffer], req.file.originalname, {
      type: req.file.mimetype
    });
    
    // Use images.edit (not edits) with model: gpt-image-1
    const response = await openai.images.edit({
      model: "gpt-image-1", 
      image: imageFile,
      prompt: stylePrompt,
      size: "1024x1024"
    });

    const dataItem = response?.data?.[0];
    if (!dataItem?.url && !dataItem?.b64_json) {
      console.error("OpenAI images.edit returned unexpected payload", response);
      return res.status(502).json({ error: "OpenAI did not return an image" });
    }

    // If we get a URL, we need to fetch and convert to base64
    let imageData;
    if (dataItem.url) {
      console.log("Got image URL, fetching:", dataItem.url);
      const imageResponse = await fetch(dataItem.url);
      const imageBuffer = await imageResponse.arrayBuffer();
      imageData = Buffer.from(imageBuffer).toString('base64');
    } else {
      imageData = dataItem.b64_json;
    }

    res.json({ image: imageData, model: "gpt-image-1" });
  } catch (err) {
    // Try to surface OpenAI error details if available
    const status = err?.status || err?.response?.status;
    const data = err?.response?.data;
    const msg = data || err?.message || String(err);
    console.error("/api/generate-avatar error:", msg);
    res.status(status || 500).json({ error: "Image edit failed", details: msg });
  } finally {
    // cleanup temp files
    if (req.file?.path) fs.unlink(req.file.path, () => {});
  }
});

// Static files AFTER API routes
app.use(express.static('.'));

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'index.html'));
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Up at http://localhost:${PORT}`);
});

// Export for Vercel
export default app;