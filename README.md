# ContentFlow - AI-Powered Article Enhancement System

BeyondChats Article Enhancement System built with React, Express, SQLite, and Google Gemini AI.

## 🚀 Features

### Phase 1: Web Scraping & CRUD API
- ✅ Scrape articles from BeyondChats blog
- ✅ SQLite database with Prisma ORM
- ✅ RESTful CRUD APIs for articles

### Phase 2: AI-Powered Enhancement
- ✅ Google Search integration via SerpAPI
- ✅ Content scraping from top blog posts
- ✅ AI article enhancement using Google Gemini
- ✅ Citation management

### Phase 3: Modern Frontend
- ✅ React 19 with Vite 7
- ✅ Tailwind CSS (professional white/black design)
- ✅ Responsive UI with comparison views
- ✅ Clean, non-AI-looking design

## 🛠️ Tech Stack

**Backend:**
- Node.js v22 LTS
- Express.js v5.2.1
- SQLite with better-sqlite3
- Prisma ORM v7.2.0
- Cheerio for web scraping
- Axios for HTTP requests

**AI & Search:**
- Google Gen AI SDK (@google/genai)
- SerpAPI for Google Search

**Frontend:**
- React v19.2.3
- Vite v7.3.0
- React Router v7.11.0
- Tailwind CSS v4.1.18
- Axios

## 📦 Installation

### Prerequisites
- Node.js v20+ or v22 LTS
- npm or yarn
- Git

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push

# Create .env file
cp .env.example .env
# Add your API keys

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL="file:./dev.db"
NODE_ENV=development
```

### Enhancement Script (.env)
```env
BACKEND_API_URL=http://localhost:5000
SERPAPI_KEY=your_serpapi_key_here
GOOGLE_GENAI_API_KEY=your_google_ai_key_here
GEMINI_MODEL=gemini-2.0-flash-exp
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 API Endpoints

### Articles
- `POST /api/articles` - Create new article
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Enhancement
- `POST /api/enhance/:id` - Enhance specific article

## 🎨 UI Design Guidelines

**Color Scheme:**
- Background: White (#FFFFFF)
- Dark sections: Black (#111827)
- Text: Dark gray (#111827)
- Accent: Blue (#3B82F6)
- NO purple gradients!

**Typography:**
- System fonts for performance
- Clean, professional styling

## 📁 Project Structure

```
contentflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   └── utils/
│   ├── prisma/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── enhancement-script/
│   └── enhance.js
└── README.md
```

## 🚀 Development

```bash
# Run backend
cd backend && npm run dev

# Run frontend
cd frontend && npm run dev

# Run enhancement script
cd enhancement-script && node enhance.js
```

## 📝 License

MIT

## 👤 Author

Atul Mishra

---

**Built with ❤️ for BeyondChats Assignment**
