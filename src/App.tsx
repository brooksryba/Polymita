import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from 'pages/Home';
import GalleryPage from 'pages/Gallery';
import StorePage from 'pages/Store';
import AboutPage from 'pages/About';
import ContactPage from 'pages/Contact';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  );
}

export default App;
