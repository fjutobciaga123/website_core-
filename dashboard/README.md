# CORE Dashboard

Video/Image Editor with AI Style Transformations powered by OpenAI.

## Features

- **Video & Image Upload**: Support for videos and images
- **20 AI Core Styles**: CyberCore, DreamCore, WeirdCore, VaporCore, Anime, Manga, and more
- **Logo Overlay**: Add and customize CORE logo with size, opacity, and positioning
- **Perfect Centering**: Intelligent visual centering for logo placement
- **Real-time Preview**: See changes instantly on canvas
- **Export**: Download your edited media as PNG

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `../.env.example` to `../.env` (if not already done)
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   
   The dashboard will be available at `http://localhost:3001`

4. **Production:**
   ```bash
   npm start
   ```

## API Endpoints

### POST `/api/apply-style`
Apply AI style transformation to an image.

**Request:**
- `image`: Image file (multipart/form-data)
- `style`: Style name (string)
- `prompt`: Style transformation prompt (string)

**Response:**
```json
{
  "image": "base64_encoded_image",
  "style": "cybercore",
  "processingTime": 3500,
  "success": true
}
```

## Tech Stack

- Express.js - Server framework
- OpenAI API - AI image transformations
- Sharp - Image optimization
- Multer - File upload handling
- HTML5 Canvas - Real-time rendering

## Notes

- Maximum file size: 5MB
- Supported formats: JPEG, PNG, WebP
- Videos export as current frame (PNG)
- Images are optimized to 1024x1024 before AI processing

---

Made with 🚀 by CORE Team
