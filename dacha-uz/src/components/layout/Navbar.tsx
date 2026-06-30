import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Send, Menu, X } from 'lucide-react';

const navLinks = [
  { to: '/',              label: 'Bosh sahifa' },
  { to: '/dachalar',      label: 'Dachalar'    },
  { to: '/biz-haqimizda', label: 'Biz haqimizda' },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-extrabold text-xl text-green-800 hover:text-green-700 transition-colors"
        >
          <Home size={22} />
          <span>DachaUz</span>
        </button>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://t.me/your_telegram"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <Send size={16} />
            Bog'lanish
          </a>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'bg-green-100 text-green-800'
                    : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://t.me/your_telegram"
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-2 bg-green-700 text-white text-sm font-semibold px-4 py-3 rounded-xl text-center"
            onClick={() => setMenuOpen(false)}
          >
            <Send size={16} />
            Telegram orqali bog'lanish
          </a>
        </div>
      )}
    </header>
  );
};

export default Navbar;