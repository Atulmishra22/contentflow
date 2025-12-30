import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ArticleDetail from './pages/ArticleDetail';
import ComparisonView from './pages/ComparisonView';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <nav className="bg-dark text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="text-2xl font-bold">
                ContentFlow
              </Link>
              <div className="flex gap-6">
                <Link to="/" className="hover:text-primary transition">
                  Articles
                </Link>
                <Link to="/comparison" className="hover:text-primary transition">
                  Compare
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/comparison" element={<ComparisonView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
