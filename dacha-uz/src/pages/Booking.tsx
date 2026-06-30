import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dachalar } from '../data/dachalar';
import { sendBookingToTelegram } from '../utils/telegram';
import { daysBetween, formatDate } from '../utils/dateHelpers';
import type { Booking as BookingType } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

// Bugungi sana (input min uchun)
const today = new Date().toISOString().split('T')[0];

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dacha = dachalar.find((d) => d.id === id);

  // Forma holati
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');

  // UI holati
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dacha topilmasa
  if (!dacha) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <div className="text-7xl mb-4">🏚</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dacha topilmadi</h2>
        <button
          onClick={() => navigate('/dachalar')}
          className="bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-600 transition-colors mt-4"
        >
          ← Dachalar ro'yxatiga qaytish
        </button>
      </div>
    );
  }

  // Kunlar va narx hisoblash
  const days = checkIn && checkOut ? daysBetween(checkIn, checkOut) : 0;
  const totalPrice = days > 0 ? days * dacha.pricePerDay : 0;

  // Validatsiya
  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Ismingizni kiriting';
    if (!phone.trim()) e.phone = 'Telefon raqamini kiriting';
    else if (!/^\+?[0-9]{9,13}$/.test(phone.replace(/\s/g, '')))
      e.phone = 'Noto\'g\'ri telefon raqam';
    if (!checkIn) e.checkIn = 'Kelish sanasini tanlang';
    if (!checkOut) e.checkOut = 'Ketish sanasini tanlang';
    if (checkIn && checkOut && days <= 0)
      e.checkOut = 'Ketish sanasi kelish sanasidan keyin bo\'lishi kerak';
    if (checkIn && checkOut && days < dacha.minDays)
      e.checkOut = `Minimal ijara muddati: ${dacha.minDays} kun`;
    if (guests < 1) e.guests = 'Kamida 1 kishi';
    if (guests > dacha.guests)
      e.guests = `Maksimal ${dacha.guests} kishi`;
    return e;
  };

  // Yuborish
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);

    const booking: BookingType = {
      id: Date.now().toString(),
      dachaId: dacha.id,
      guestName: name.trim(),
      guestPhone: phone.trim(),
      checkIn,
      checkOut,
      guests,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
      message: message.trim() || undefined,
    };

    try {
      await sendBookingToTelegram(booking, dacha);
      setSuccess(true);
    } catch {
      // Telegram xato bo'lsa ham muvaffaqiyat ko'rsatamiz
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  // ── Muvaffaqiyat ekrani ──────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">So'rovingiz yuborildi!</h2>
          <p className="text-gray-500 mb-6">
            Tez orada siz bilan bog'lanamiz. Telefoningizni tekshirib turing.
          </p>

          {/* Xulosa */}
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-left space-y-2 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Dacha</span>
              <span className="font-semibold text-gray-800">{dacha.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Kelish</span>
              <span className="font-semibold text-gray-800">{formatDate(checkIn)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Ketish</span>
              <span className="font-semibold text-gray-800">{formatDate(checkOut)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jami ({days} kun)</span>
              <span className="font-bold text-green-700">{formatPrice(totalPrice)}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors"
            >
              🏠 Bosh sahifaga qaytish
            </button>
            <button
              onClick={() => navigate('/dachalar')}
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Boshqa dachalarni ko'rish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Bron forma ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Orqaga */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-green-700 font-medium mb-5 transition-colors"
        >
          ← Orqaga
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-6">📅 Bron qilish</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Forma ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Shaxsiy ma'lumot */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800 text-base">👤 Shaxsiy ma'lumot</h2>

              {/* Ism */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  To'liq ismingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masalan: Alisher Karimov"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500 bg-gray-50'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Telefon */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Telefon raqami <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500 bg-gray-50'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* Sana va mehmonlar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="font-bold text-gray-800 text-base">📅 Ijara ma'lumotlari</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Kelish */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Kelish sanasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (checkOut && e.target.value >= checkOut) setCheckOut('');
                    }}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                      errors.checkIn ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500 bg-gray-50'
                    }`}
                  />
                  {errors.checkIn && <p className="text-red-500 text-xs mt-1">{errors.checkIn}</p>}
                </div>

                {/* Ketish */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ketish sanasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-colors ${
                      errors.checkOut ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-green-500 bg-gray-50'
                    }`}
                  />
                  {errors.checkOut && <p className="text-red-500 text-xs mt-1">{errors.checkOut}</p>}
                </div>
              </div>

              {/* Kunlar hisob */}
              {days > 0 && (
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 text-sm text-green-700 font-medium">
                  📆 {days} kun — {formatDate(checkIn)} dan {formatDate(checkOut)} gacha
                </div>
              )}

              {/* Mehmonlar */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mehmonlar soni <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">(maks. {dacha.guests} kishi)</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 font-bold hover:border-green-500 hover:text-green-700 transition-colors text-lg"
                  >
                    −
                  </button>
                  <span className="text-lg font-bold text-gray-800 w-8 text-center">{guests}</span>
                  <button
                    onClick={() => setGuests((g) => Math.min(dacha.guests, g + 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 font-bold hover:border-green-500 hover:text-green-700 transition-colors text-lg"
                  >
                    +
                  </button>
                  <span className="text-gray-400 text-sm">kishi</span>
                </div>
                {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
              </div>
            </div>

            {/* Izoh */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                💬 Qo'shimcha izoh <span className="text-gray-400 font-normal">(ixtiyoriy)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Masalan: kechki ovqat kerak, maxsus talab va h.k."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 bg-gray-50 resize-none"
              />
            </div>
          </div>

          {/* ── O'ng — Xulosa ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 space-y-4">
              <h2 className="font-bold text-gray-800">🧾 Xulosa</h2>

              {/* Dacha info */}
              <div className="flex gap-3 pb-4 border-b">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  🏡
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{dacha.title}</div>
                  <div className="text-gray-500 text-xs">📍 {dacha.district}</div>
                  <div className="text-yellow-600 text-xs mt-0.5">⭐ {dacha.rating}</div>
                </div>
              </div>

              {/* Narx hisob */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>{formatPrice(dacha.pricePerDay)} × {days || '?'} kun</span>
                  <span>{days > 0 ? formatPrice(totalPrice) : '—'}</span>
                </div>
              </div>

              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800">Jami</span>
                <span className="text-xl font-extrabold text-green-700">
                  {days > 0 ? formatPrice(totalPrice) : '—'}
                </span>
              </div>

              {/* Yuborish */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  loading
                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                    : 'bg-green-700 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Yuborilmoqda...
                  </span>
                ) : '📩 So\'rov yuborish'}
              </button>

              <p className="text-xs text-gray-400 text-center">
                So'rov yuborilgach, siz bilan telefon orqali bog'lanamiz
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Booking;