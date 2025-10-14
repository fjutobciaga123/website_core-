const express = require("express");
const multer = require("multer");
const cors = require("cors");
const OpenAI = require("openai");
const { toFile } = require("openai/uploads");
const path = require("path");
const sharp = require("sharp");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Performance optimizations
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://corecoreonsol.vercel.app', 'https://your-domain.com'] 
    : true,
  credentials: true
}));

// Compress responses
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Request logging with performance metrics
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`Response time: ${duration}ms`);
    return originalSend.call(this, data);
  };
  
  next();
});

// Serve static files from dashboard directory
app.use(express.static(__dirname));
// Also serve root images directory for shared assets like favicon when running standalone
const rootImagesPath = path.join(__dirname, '..', 'images');
app.use('/images', express.static(rootImagesPath));

// Optimized multer configuration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit to accommodate canvas PNGs
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  }
});

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ 
    ok: true, 
    uptime: Math.floor(process.uptime()),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Apply Core style transformation endpoint
app.post("/api/apply-style", upload.single("image"), async (req, res) => {
  const requestStart = Date.now();
  console.log("=== APPLY STYLE REQUEST ===");
  console.log("File size:", req.file?.size, "bytes");
  console.log("Style:", req.body.style);
  console.log("Prompt:", req.body.prompt);
  
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: "No image uploaded",
        code: "MISSING_FILE"
      });
    }

    if (!req.body.prompt) {
      return res.status(400).json({ 
        error: "No style prompt provided",
        code: "MISSING_PROMPT"
      });
    }

    // Optimize image before sending to OpenAI (must be PNG with transparency)
    let optimizedBuffer;
    try {
      optimizedBuffer = await sharp(req.file.buffer)
        .resize(1024, 1024, {
          fit: 'cover',
          position: 'center'
        })
        .png({ 
          quality: 90,
          compressionLevel: 6
        })
        .toBuffer();
      
      console.log(`Image optimized: ${req.file.size} -> ${optimizedBuffer.length} bytes`);
    } catch (sharpError) {
      console.error("Image optimization failed:", sharpError);
      optimizedBuffer = req.file.buffer;
    }

    // Create file object using OpenAI helper for compatibility
    const imageFile = await toFile(optimizedBuffer, 'current-frame.png', {
      type: 'image/png'
    });
    
    console.log("Sending style transform request to OpenAI...");
    const openAIStart = Date.now();
    
    // Use OpenAI image edit API with gpt-image-1
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: req.body.prompt,
      size: "1024x1024",
      n: 1
    });

    const openAIDuration = Date.now() - openAIStart;
    console.log(`OpenAI response time: ${openAIDuration}ms`);

    const dataItem = response?.data?.[0];
    if (!dataItem?.b64_json && !dataItem?.url) {
      console.error("OpenAI returned unexpected payload", response);
      return res.status(502).json({ 
        error: "OpenAI did not return an image",
        code: "NO_IMAGE_RETURNED"
      });
    }

    // Handle response
    let imageData;
    if (dataItem.b64_json) {
      imageData = dataItem.b64_json;
    } else if (dataItem.url) {
      console.log("Fetching image from URL:", dataItem.url);
      const imageResponse = await fetch(dataItem.url, { 
        timeout: 15000
      });
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      imageData = Buffer.from(imageBuffer).toString('base64');
    }

    const totalDuration = Date.now() - requestStart;
    console.log(`Total style transform time: ${totalDuration}ms`);

    res.json({ 
      image: imageData, 
      style: req.body.style,
      processingTime: totalDuration,
      success: true
    });
    
  } catch (err) {
    const totalDuration = Date.now() - requestStart;
    console.error(`/api/apply-style error after ${totalDuration}ms:`, err.message);
    if (err) {
      console.error('OpenAI error details:', {
        status: err.status,
        code: err.code,
        type: err.type,
        message: err.message,
      });
      if (err.response) {
        try {
          console.error('OpenAI error status:', err.response.status);
          console.error('OpenAI error data:', JSON.stringify(err.response.data));
          if (err.response.data?.error?.message) {
            console.error('OpenAI error message:', err.response.data.error.message);
          }
        } catch (e) {
          console.error('Failed to stringify OpenAI error response');
        }
      } else if (err.data) {
        try { console.error('OpenAI error data (no response object):', JSON.stringify(err.data)); } catch {}
      }
    }
    
    let status = 500;
    let errorCode = "UNKNOWN_ERROR";
    
    if (err.status) status = err.status;
    if (err.code === 'ENOTFOUND') {
      status = 503;
      errorCode = "NETWORK_ERROR";
    } else if (err.message?.includes('timeout')) {
      status = 408;
      errorCode = "TIMEOUT";
    } else if (err.message?.includes('rate limit')) {
      status = 429;
      errorCode = "RATE_LIMITED";
    }
    
    res.status(status).json({ 
      error: "Style transformation failed", 
      details: err.message,
      code: errorCode,
      processingTime: totalDuration
    });
  }
});

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: "File too large. Maximum size is 15MB.",
        code: "FILE_TOO_LARGE"
      });
    }
    return res.status(400).json({ error: 'Upload error', code: err.code || 'UPLOAD_ERROR' });
  }
  
  res.status(500).json({ 
    error: "Internal server error",
    code: "SERVER_ERROR"
  });
});

const PORT = process.env.DASHBOARD_PORT || process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   CORE Dashboard Server Running 🚀     ║
║   Port: ${PORT}                        ║
║   URL: http://localhost:${PORT}        ║
║   Mode: ${process.env.NODE_ENV || 'development'}                         ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
