# CORE Website 🌟

Official website for CORE - Center Of Real Essence

## Features

- 🎨 Modern, responsive design with sci-fi aesthetics
- 🖼️ AI-powered PFP generator using OpenAI DALL-E
- 📊 Live stats integration
- 🎭 Art gallery with infinite carousel
- 🚀 Optimized performance with GPU-accelerated animations

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/Corecoreonsol/corecore.git
cd corecore
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the development server:
```bash
npm start
```

## Deployment

### Vercel (Recommended)

1. Import project to Vercel from GitHub
2. Add environment variable in Vercel dashboard:
   - `OPENAI_API_KEY` = your OpenAI API key
3. Deploy!

### Manual Deployment

Ensure these environment variables are set:
- `OPENAI_API_KEY` - Your OpenAI API key for PFP generation

## Project Structure

```
corecore/
├── index.html          # Main website
├── server.js           # Express server with API endpoints
├── css/                # Stylesheets
├── js/                 # JavaScript modules
├── images/             # Assets and media
└── movement1/          # Additional components
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/generate-pfp` - Generate AI-powered profile pictures
- `GET /api/debug` - Debug information

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Private - All rights reserved by CORE team