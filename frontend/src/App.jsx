import { Routes, Route, Link, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import Header from './components/Header/Header'
import BlogPage from './pages/BlogPage/BlogPage'
import AboutUsPage from './pages/AboutUsPage/AboutUsPage'
import ContactPage from './pages/ContactPage/ContactPage'
import RecipesPage from './pages/Recipes/RecipesPage'
import Footer from './components/Footer/Footer'
function NotFound() {
  return <div style={{ padding: 24 }}>Страница не найдена</div>
}

export default function App() {
  return (
    <div class='wrapper'>
      <Header />
      <main>
        <Routes>
          <Route path="*" element={<HomePage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="recipies" element={<RecipesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
