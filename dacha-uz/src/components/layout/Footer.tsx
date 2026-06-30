import { NavLink } from 'react-router-dom';
import { Home, Send } from 'lucide-react';
import { districts } from '../../data/dachalar';

const Footer = () => {
  return (
    <footer className="bg-green-900 text-green-100">

      {/* Asosiy qism */}
      <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Logo va tavsif */}
        <div>
          <div className="flex items-center gap-2 text-2xl font-extrabold text-white mb-3">
            <Home size={24} />
            DachaUz
          </div>
          <p className="text-green-300 text-sm leading-relaxed">
            Toshkent viloyati bo'ylab eng yaxshi dachalarni ijaraga olish platformasi.
            Oila va do'stlar bilan unutilmas dam olish.
          </p>
          <a
            href="https://t.me/your_telegram"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-4 bg-green-700 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200"
          >
            <Send size={16} />
            Telegram
          </a>
        </div>

        {/* Havolalar */}
        <div>
          <h4 className="text-white font-bold mb-4">Sahifalar</h4>
          <ul className="flex flex-col gap-2 text-sm">
            {[
              { to: '/',               label: 'Bosh sahifa'    },
              { to: '/dachalar',       label: 'Barcha dachalar' },
              { to: '/biz-haqimizda', label: 'Biz haqimizda'  },
            ].map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className="text-green-300 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Hududlar */}
        <div>
          <h4 className="text-white font-bold mb-4">Mashhur hududlar</h4>
          <div className="flex flex-wrap gap-2">
            {districts.slice(0, 6).map((d) => (
              <NavLink
                key={d}
                to={`/dachalar?district=${d}`}
                className="text-xs bg-green-800 hover:bg-green-700 text-green-200 px-3 py-1.5 rounded-full transition-colors duration-200"
              >
                {d}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Pastki chiziq */}
      <div className="border-t border-green-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-green-400">
          <span>© {new Date().getFullYear()} DachaUz. Barcha huquqlar himoyalangan.</span>
          <span>Toshkent, O'zbekiston</span>
        </div>
      </div>

    </footer>
  );
};

export default Footer;