# ContentFlow - AI-Powered Article Enhancement System

Fully automated article scraping and AI enhancement pipeline built with React, Express, SQLite, and Google Gemini AI via AIPipe.

## 🚀 Features

### Phase 1: Web Scraping & CRUD API
- ✅ Auto-scrape articles from BeyondChats blog on startup
- ✅ SQLite database with Prisma ORM
- ✅ RESTful CRUD APIs for articles
- ✅ Automated database seeding (no manual steps)

### Phase 2: AI-Powered Enhancement
- ✅ Google Search integration via SearchAPI
- ✅ Intelligent web scraping from top search results
- ✅ AI article enhancement using Gemini 2.5 Flash (via AIPipe)
- ✅ Automatic reference citation with titles and URLs
- ✅ Token-optimized 50-word generation
- ✅ Auto-enhancement on server startup

### Phase 3: Modern Frontend
- ✅ React 19 with Vite 7 and Tailwind CSS v4
- ✅ Professional component-based CSS architecture
- ✅ Smart polling (stops when all articles enhanced)
- ✅ Side-by-side original vs enhanced comparison
- ✅ Fully responsive mobile design with panel switching
- ✅ Reference display with external links

## 🛠️ Tech Stack

**Backend:**
- Node.js v22 LTS
- Express.js v5.2.1
- SQLite with better-sqlite3 v12.5.0
- Prisma ORM v7.2.0
- Cheerio v1.1.2 for web scraping
- Axios v1.13.2 for HTTP requests

**AI & Search:**
- Gemini 2.5 Flash via AIPipe (free tier, latest model)
- SearchAPI for Google Search integration
- Automated enhancement pipeline

**Frontend:**
- React v19.2.3
- Vite v7.3.0
- Tailwind CSS v4.1.18 with @layer components
- TypeScript for type safety
- Lucide React for icons

## 📦 Installation & Quick Start

### Prerequisites
- Node.js v20+ or v22 LTS
- npm or pnpm
- Git

### Complete Setup (One-time)

```bash
# Clone the repository
git clone https://github.com/Atulmishra22/contentflow.git
cd contentflow

# Backend setup
cd backend
npm install

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Create .env file and add API keys
cp .env.example .env
# Edit .env and add:
# - AIPIPE_KEY (get from https://aipipe.org)
# - SEARCHAPI_KEY (get from https://searchapi.io)

# Frontend setup
cd ../frontend
npm install

# Done! Ready to run
```

### Running the Application

**Option 1: Automatic (Recommended)**
```bash
# Terminal 1: Start backend (auto-scrapes and enhances on first run)
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev

# Visit http://localhost:5173
```

**Option 2: Manual Enhancement**
```bash
# If you want to manually trigger enhancement
cd backend
npm run enhance
```

### First Run Experience
1. Backend starts → Checks database
2. If empty → Auto-scrapes 5 articles from BeyondChats
3. Auto-enhances all articles with AI
4. Frontend shows articles (updates automatically while enhancing)
5. Once all enhanced → Polling stops automatically

No manual seeding or enhancement commands needed!

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
DATABASE_URL="file:./dev.db"
NODE_ENV=development
FRONTEND_URL=http://localhost:5173  # For production, set to your deployed frontend URL
AIPIPE_KEY=your_aipipe_token_here  # Get from https://aipipe.org
SEARCHAPI_KEY=your_searchapi_key_here  # Get from https://searchapi.io
```

**Required API Keys:**
- **AIPipe**: Free Gemini API access - Sign up at https://aipipe.org
- **SearchAPI**: Google Search API - Free tier at https://searchapi.io

**CORS Configuration:**
- `FRONTEND_URL`: Defaults to `http://localhost:5173` for development
- For production: Set to your deployed frontend URL (e.g., `https://yourapp.vercel.app`)

## 🎯 API Endpoints

### Articles
- `POST /api/articles` - Create new article
- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get single article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Enhancement
- `GET /api/articles?page=1&limit=100` - Get all articles with pagination
- `GET /api/articles/:id` - Get single article
- `POST /Features

**Design System:**
- Tailwind CSS v4 with `@layer components`
- Semantic CSS class names for maintainability
- Professional serif fonts for enhanced content
- Monospace fonts for raw scraped content

**Responsive Design:**
- Desktop: Side-by-side article list and content view
- Tablet: Optimized spacing and navigation
- Mobile: Panel switching with "Back to Articles" button
- Smart viewport handling for all screen sizes

**User Experience:**
- Real-time article status updates
- Smart polling that stops when complete
- Reference citations with external links
- Original vs Enhanced comparison toggle
- Loading states and progress indicators

## 🏗️ Architecture

```
contentflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Prisma client
│   │   ├── routes/
│   │   │   └── articleRoutes.js     # API routes
│   │   ├── controllers/
│   │   │   └── articleController.js # Request handlers
│   │   ├── services/
│   │   │   ├── scraperService.js    # BeyondChats scraper
│   │   │   └── enhancementService.js # AI enhancement + search
│   │   ├── scripts/
│   │   │   └── enhance.js           # Manual enhancement script
│   │   ├── utils/
│   │   │   └── seed.js              # Database seeding
│   │   └── server.js                # Express server + auto-pipeline
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── .env                         # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx       # Sidebar navigation
│   │   │   ├── ArticleListPanel.tsx # Article list
│   │   │   ├── ArticleListItem.tsx  # Article card
│   │   │   ├── ContentPanel.tsx     # Main content area
│   │   │   └── ContentHeader.tsx    # Article header
│   │   ├── services/
│   │   │   └── api.ts               # API client
│   │   ├── App.tsx                  # Main app component
│   │   ├── index.css                # Tailwind + component styles
│   │   └── main.tsx                 # Entry point
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

**Component Architecture:**
- Separation of concerns (CSS in index.css, logic in TypeScript)
- Reusable component classes
- Type-safe with TypeScript
- Clean, maintainable code
- System fonts for performance
- Professional styling

## � Available Scripts

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Manually seed database (auto on startup if empty)
npm run enhance  # Manually enhance articles (auto on startup)
npm run db:push  # Push Prisma schema to database
npm run db:generate # Generate Prisma client
npm run db:studio   # Open Prisma Studio (database GUI)
```

### Frontend
```bash
npm run dev      # Start Vite development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔄 Database Management

**View Database:**
```bash
cd backend
npx prisma studio
# Opens at http://localhost:5555
```

**Reset Database:**
```bash
cd backend
npx prisma migrate reset --force
# Clears all data and re-applies schema
```

## 🐛 Troubleshooting

**Issue: No articles showing**
- Check backend is running on port 5000
- Check database was seeded (look for console logs on startup)
- Run `npm run seed` manually if needed

**Issue: Articles not enhancing**
- Verify AIPIPE_KEY in .env
- Verify SEARCHAPI_KEY in .env
- Check backend console for error messages
- Try running `npm run enhance` manually

**Issue: Frontend can't connect**
- Ensure backend is running on http://localhost:5000
- Check CORS is enabled (it is by default)
- Clear browser cache and reload

## 🎯 Key Features Implemented

✅ **Fully Automated Pipeline**: Zero manual intervention needed  
✅ **Smart Resource Management**: Polling stops when work is done  
✅ **Mobile-First Design**: Works perfectly on all devices  
✅ **Professional Code**: Clean architecture with separation of concerns  
✅ **Type Safety**: TypeScript for frontend reliability  
✅ **Token Optimization**: 50-word generation for efficiency  
✅ **Reference Citations**: Proper attribution with external links  
✅ **Error Handling**: Graceful fallbacks for failed scrapes  
✅ **Production Ready**: Environment-based configuration

## 📝 License

MIT

## 👤 Author

Atul Mishra

---

**Built with ❤️ for BeyondChats Assignment**
