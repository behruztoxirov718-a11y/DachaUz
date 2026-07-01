import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/index';
import Catalog from './pages/Catalog';
import DachaDetail from './pages/DachaDetail';
import Booking from './pages/Booking';
import About from './pages/About';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dachalar" element={<Catalog />} />
        <Route path="/dacha/:id" element={<DachaDetail />} />
        <Route path="/bron/:id" element={<Booking />} />
        <Route path="/biz-haqimizda" element={<About />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;