import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Star, Calendar, Home as HomeIcon, ArrowRight, Bed } from 'lucide-react';
import { dachalar, districts, amenityLabels } from '../data/dachalar';
import type { Dacha } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

// ── DachaCard komponenti ────────────────────────────────────────
const DachaCard = ({ dacha }: { dacha: Dacha }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/dacha/${dacha.id}`)}
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Rasm */}
      <div className="relative h-52 bg-gradient-to-br from-green-100 to-green-200 overflow-hidden">
        {dacha.images[0] ? (
          <img
            src={dacha.images[0]}
            alt={dacha.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <HomeIcon size={80} strokeWidth={1} />
        </div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-sm font-semibold text-yellow-600">
          <Star size={14} fill="currentColor" />
          {dacha.rating}
        </div>

        {!dacha.isAvailable && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Band
          </div>
        )}
      </div>

      {/* Ma'lumot */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1">{dacha.title}</h3>

        <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
          <MapPin size={14} />
          {dacha.district}, {dacha.location}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {dacha.amenities.slice(0, 4).map((a) => (
            <span key={a} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
              {amenityLabels[a]}
            </span>
          ))}
          {dacha.amenities.length > 4 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">+{dacha.amenities.length - 4}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <span className="text-green-700 font-bold text-base">{formatPrice(dacha.pricePerDay)}</span>
            <span className="text-gray-400 text-sm"> / kun</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Users size={14} />{dacha.guests}</span>
            <span className="flex items-center gap-1"><Bed size={14} />{dacha.beds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Asosiy Home sahifasi ────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchGuests, setSearchGuests] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchDistrict) params.set('district', searchDistrict);
    if (searchGuests) params.set('guests', searchGuests);
    navigate(`/dachalar?${params.toString()}`);
  };

  const featuredDachalar = dachalar.filter((d) => d.isAvailable).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-green-300 font-medium mb-3 text-sm tracking-widest uppercase">
            Toshkent viloyati bo'ylab
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
            Yoz uchun mukammal
            <br />
            <span className="text-green-300">dacha toping</span>
          </h1>
          <p className="text-green-100 text-lg mb-10 max-w-xl mx-auto">
            Chorvoq, Parkent, Ohangaron... Oila va do'stlar bilan unutilmas dam olish
          </p>

          {/* Search box */}
          <div className="bg-white rounded-2xl p-4 max-w-2xl mx-auto shadow-2xl">
            <div className="flex flex-col md:flex-row gap-3">
              <select
                value={searchDistrict}
                onChange={(e) => setSearchDistrict(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-green-500 bg-gray-50"
              >
                <option value="">Qaysi joy?</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={searchGuests}
                onChange={(e) => setSearchGuests(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-green-500 bg-gray-50"
              >
                <option value="">Nechta kishi?</option>
                <option value="5">5 tagacha</option>
                <option value="10">10 tagacha</option>
                <option value="20">20 tagacha</option>
                <option value="30">30 tagacha</option>
                <option value="50">50+ kishi</option>
              </select>

              <button
                onClick={handleSearch}
                className="bg-green-700 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Qidirish
              </button>
            </div>
          </div>

          {/* Statistika */}
          <div className="flex justify-center gap-10 mt-10 text-center">
            <div>
              <div className="text-3xl font-extrabold text-white">50+</div>
              <div className="text-green-300 text-sm">Dacha</div>
            </div>
            <div className="w-px bg-green-600" />
            <div>
              <div className="text-3xl font-extrabold text-white">9</div>
              <div className="text-green-300 text-sm">Hudud</div>
            </div>
            <div className="w-px bg-green-600" />
            <div>
              <div className="text-3xl font-extrabold text-white">500+</div>
              <div className="text-green-300 text-sm">Xursand mijoz</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QANDAY ISHLAYDI ──────────────────────────────────── */}
      <section className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-10">
            Qanday ishlaydi?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { Icon: Search, step: '1', title: 'Dacha tanlang', desc: "Joy, narx va qulayliklar bo'yicha filter qiling" },
              { Icon: Calendar, step: '2', title: 'Bron qiling', desc: "Sana va mehmonlar sonini kiriting, so'rov yuboring" },
              { Icon: HomeIcon, step: '3', title: 'Dam oling', desc: 'Tasdiqlash keladi, belgilangan kunda keling' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center shadow-sm">
                  <item.Icon size={28} strokeWidth={1.5} />
                </div>
                <div className="w-7 h-7 bg-green-700 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED DACHALAR ────────────────────────────────── */}
      <section className="py-14 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Mashhur dachalar</h2>
          <button
            onClick={() => navigate('/dachalar')}
            className="text-green-700 font-semibold hover:underline text-sm flex items-center gap-1"
          >
            Hammasini ko'rish <ArrowRight size={16} />
          </button>
        </div>

        {featuredDachalar.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {featuredDachalar.map((dacha) => (
              <DachaCard key={dacha.id} dacha={dacha} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <HomeIcon size={64} className="mx-auto mb-4" strokeWidth={1} />
            <p>Hozircha dachalar yo'q</p>
          </div>
        )}
      </section>

      {/* ── HUDUDLAR ─────────────────────────────────────────── */}
      <section className="bg-green-50 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2">
            <MapPin size={22} />
            Mashhur hududlar
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {districts.map((district) => (
              <button
                key={district}
                onClick={() => navigate(`/dachalar?district=${district}`)}
                className="bg-white border border-green-200 text-green-800 font-medium px-5 py-2.5 rounded-full hover:bg-green-700 hover:text-white hover:border-green-700 transition-all duration-200 shadow-sm"
              >
                {district}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-green-800 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold mb-3">Dachangizni ijaraga bering</h2>
        <p className="text-green-200 mb-8 max-w-md mx-auto">
          Yozda bo'sh turadigan dachaingizdan daromad oling. Ro'yxatdan o'tish bepul!
        </p>
        <a
          href="https://t.me/your_telegram"
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-white text-green-800 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors duration-200"
        >
          Telegram orqali bog'laning
        </a>
      </section>

    </div>
  );
};

export default Home;