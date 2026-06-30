import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { dachalar, districts, amenityLabels } from '../data/dachalar';
import type { Amenity, Dacha } from '../types';

// ── Yordamchi ──────────────────────────────────────────────────
const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

// ── DachaCard ──────────────────────────────────────────────────
const DachaCard = ({ dacha }: { dacha: Dacha }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/dacha/${dacha.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Rasm */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-200">
        {dacha.images[0] && (
          <img
            src={dacha.images[0]}
            alt={dacha.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center text-5xl opacity-20">🏡</div>

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-sm font-semibold text-yellow-600">
          ⭐ {dacha.rating}
        </div>
        {!dacha.isAvailable && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Band
          </div>
        )}
      </div>

      {/* Ma'lumot */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base mb-1">{dacha.title}</h3>
        <p className="text-gray-500 text-sm mb-3">📍 {dacha.district}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {dacha.amenities.slice(0, 3).map((a) => (
            <span key={a} className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
              {amenityLabels[a]}
            </span>
          ))}
          {dacha.amenities.length > 3 && (
            <span className="text-xs text-gray-400 px-1">+{dacha.amenities.length - 3}</span>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3">
          <div>
            <span className="text-green-700 font-bold">{formatPrice(dacha.pricePerDay)}</span>
            <span className="text-gray-400 text-sm"> / kun</span>
          </div>
          <div className="flex gap-3 text-sm text-gray-500">
            <span>👥 {dacha.guests}</span>
            <span>🛏 {dacha.beds}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Asosiy Catalog ─────────────────────────────────────────────
const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  // URL dan boshlang'ich qiymatlar
  const [district, setDistrict] = useState(searchParams.get('district') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '');
  const [priceMax, setPriceMax] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'rating'>('rating');
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);

  // Amenity toggle
  const toggleAmenity = (a: Amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  // Filterlash + saralash
  const filtered = useMemo(() => {
    let result = [...dachalar];

    if (district) result = result.filter((d) => d.district === district);
    if (guests) result = result.filter((d) => d.guests >= parseInt(guests));
    if (priceMax) result = result.filter((d) => d.pricePerDay <= parseInt(priceMax));
    if (showOnlyAvailable) result = result.filter((d) => d.isAvailable);
    if (selectedAmenities.length > 0) {
      result = result.filter((d) =>
        selectedAmenities.every((a) => d.amenities.includes(a))
      );
    }

    if (sortBy === 'price_asc') result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    else result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [district, guests, priceMax, selectedAmenities, sortBy, showOnlyAvailable]);

  // Filterni tozalash
  const clearFilters = () => {
    setDistrict('');
    setGuests('');
    setPriceMax('');
    setSelectedAmenities([]);
    setShowOnlyAvailable(false);
    setSearchParams({});
  };

  const activeFilterCount = [
    district, guests, priceMax, showOnlyAvailable ? '1' : '',
  ].filter(Boolean).length + selectedAmenities.length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Sarlavha ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Dachalar</h1>
          <p className="text-gray-500 text-sm">{filtered.length} ta dacha topildi</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Saralash + Filter tugmasi ── */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 border border-gray-300 bg-white text-gray-700 font-medium px-4 py-2.5 rounded-xl hover:border-green-500 hover:text-green-700 transition-colors duration-200"
          >
            🎛 Filterlar
            {activeFilterCount > 0 && (
              <span className="bg-green-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="border border-gray-200 bg-white rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-green-500"
          >
            <option value="rating">⭐ Reyting bo'yicha</option>
            <option value="price_asc">💰 Arzondan qimmatga</option>
            <option value="price_desc">💰 Qimmatdan arzonga</option>
          </select>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">

              {/* Hudud */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">📍 Hudud</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option value="">Barchasi</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Mehmonlar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">👥 Mehmonlar soni</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option value="">Muhim emas</option>
                  <option value="5">5+ kishi</option>
                  <option value="10">10+ kishi</option>
                  <option value="20">20+ kishi</option>
                  <option value="30">30+ kishi</option>
                </select>
              </div>

              {/* Narx */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">💰 Maksimal narx (kun)</label>
                <select
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-green-500 bg-gray-50"
                >
                  <option value="">Muhim emas</option>
                  <option value="500000">500 000 so'm</option>
                  <option value="800000">800 000 so'm</option>
                  <option value="1000000">1 000 000 so'm</option>
                  <option value="1500000">1 500 000 so'm</option>
                </select>
              </div>
            </div>

            {/* Qulayliklar */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">✨ Qulayliklar</label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(amenityLabels) as Amenity[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleAmenity(a)}
                    className={`text-sm px-3 py-1.5 rounded-full border transition-all duration-200 ${
                      selectedAmenities.includes(a)
                        ? 'bg-green-700 text-white border-green-700'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    {amenityLabels[a]}
                  </button>
                ))}
              </div>
            </div>

            {/* Faqat bo'sh */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 accent-green-700"
                />
                Faqat bo'sh dachalar
              </label>

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                >
                  ✕ Filterni tozalash
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Aktiv filterlar badge ── */}
        {(district || guests) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {district && (
              <span className="flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                📍 {district}
                <button onClick={() => setDistrict('')} className="ml-1 hover:text-red-500">✕</button>
              </span>
            )}
            {guests && (
              <span className="flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                👥 {guests}+ kishi
                <button onClick={() => setGuests('')} className="ml-1 hover:text-red-500">✕</button>
              </span>
            )}
          </div>
        )}

        {/* ── Natijalar ── */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((dacha) => (
              <DachaCard key={dacha.id} dacha={dacha} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="text-7xl mb-4">🏡</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Dacha topilmadi</h3>
            <p className="text-gray-400 mb-6">Filter shartlarini o'zgartirib ko'ring</p>
            <button
              onClick={clearFilters}
              className="bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-600 transition-colors"
            >
              Filterni tozalash
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;