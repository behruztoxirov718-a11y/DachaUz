import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dachalar } from '../data/dachalar';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

// Fake bronlar (keyinchalik localStorage yoki backenddan keladi)
const fakeBronlar = [
  {
    id: '1', dachaId: '1', guestName: 'Alisher Karimov', guestPhone: '+998901234567',
    checkIn: '2025-07-10', checkOut: '2025-07-12', guests: 8,
    totalPrice: 1600000, status: 'pending' as const, createdAt: '2025-06-28T10:00:00',
    message: 'Kechki ovqat ham kerak',
  },
  {
    id: '2', dachaId: '2', guestName: 'Dilnoza Yusupova', guestPhone: '+998901112233',
    checkIn: '2025-07-15', checkOut: '2025-07-17', guests: 5,
    totalPrice: 1200000, status: 'confirmed' as const, createdAt: '2025-06-27T15:30:00',
    message: '',
  },
  {
    id: '3', dachaId: '1', guestName: 'Jasur Toshmatov', guestPhone: '+998977778899',
    checkIn: '2025-07-20', checkOut: '2025-07-21', guests: 12,
    totalPrice: 800000, status: 'cancelled' as const, createdAt: '2025-06-26T09:15:00',
    message: '',
  },
];

type Status = 'pending' | 'confirmed' | 'cancelled';

const statusConfig: Record<Status, { label: string; color: string }> = {
  pending:   { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  confirmed: { label: 'Tasdiqlandi', color: 'bg-green-100 text-green-700 border-green-200' },
  cancelled: { label: 'Bekor qilindi', color: 'bg-red-100 text-red-600 border-red-200' },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bronlar, setBronlar] = useState(fakeBronlar);
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
  const [selectedBron, setSelectedBron] = useState<typeof fakeBronlar[0] | null>(null);

  // Auth tekshirish
  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    setBronlar((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBron?.id === id) {
      setSelectedBron((prev) => prev ? { ...prev, status: newStatus } : null);
    }
  };

  // Filterlangan bronlar
  const filtered = filterStatus === 'all'
    ? bronlar
    : bronlar.filter((b) => b.status === filterStatus);

  // Statistika
  const stats = {
    total: bronlar.length,
    pending: bronlar.filter((b) => b.status === 'pending').length,
    confirmed: bronlar.filter((b) => b.status === 'confirmed').length,
    revenue: bronlar
      .filter((b) => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Navbar ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">🏡</span>
            <span className="font-extrabold text-gray-900">DachaUz</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 font-medium">Admin panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1"
          >
            🚪 Chiqish
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ── Statistika ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { icon: '📋', label: 'Jami bronlar', value: stats.total, color: 'border-blue-100 bg-blue-50', text: 'text-blue-700' },
            { icon: '⏳', label: 'Kutilmoqda', value: stats.pending, color: 'border-yellow-100 bg-yellow-50', text: 'text-yellow-700' },
            { icon: '✅', label: 'Tasdiqlangan', value: stats.confirmed, color: 'border-green-100 bg-green-50', text: 'text-green-700' },
            { icon: '💰', label: 'Daromad', value: formatPrice(stats.revenue), color: 'border-purple-100 bg-purple-50', text: 'text-purple-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-xl font-extrabold ${s.text}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Filter ── */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                filterStatus === s
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {s === 'all' ? 'Barchasi' : statusConfig[s].label}
              <span className="ml-1.5 text-xs opacity-70">
                {s === 'all' ? bronlar.length : bronlar.filter((b) => b.status === s).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── Bronlar jadvali ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-3">📭</div>
              <p>Bu bo'limda bronlar yo'q</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Mijoz</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Dacha</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Sana</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Narx</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Status</th>
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((bron) => {
                    const dacha = dachalar.find((d) => d.id === bron.dachaId);
                    return (
                      <tr
                        key={bron.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedBron(bron)}
                      >
                        <td className="px-5 py-4">
                          <div className="font-semibold text-gray-900">{bron.guestName}</div>
                          <div className="text-gray-400 text-xs">{bron.guestPhone}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-gray-700">{dacha?.title || '—'}</div>
                          <div className="text-gray-400 text-xs">👥 {bron.guests} kishi</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-gray-700">{bron.checkIn}</div>
                          <div className="text-gray-400 text-xs">→ {bron.checkOut}</div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-green-700">
                          {formatPrice(bron.totalPrice)}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig[bron.status].color}`}>
                            {statusConfig[bron.status].label}
                          </span>
                        </td>
                        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={bron.status}
                            onChange={(e) => handleStatusChange(bron.id, e.target.value as Status)}
                            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-green-500 bg-white"
                          >
                            <option value="pending">Kutilmoqda</option>
                            <option value="confirmed">Tasdiqlash</option>
                            <option value="cancelled">Bekor qilish</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Bron detail modal ── */}
      {selectedBron && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4"
          onClick={() => setSelectedBron(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-gray-900 text-lg">Bron ma'lumotlari</h3>
              <button
                onClick={() => setSelectedBron(null)}
                className="text-gray-400 hover:text-gray-600 text-xl transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Ma'lumotlar */}
            <div className="space-y-3 text-sm">
              {[
                { label: '👤 Mijoz', value: selectedBron.guestName },
                { label: '📞 Telefon', value: selectedBron.guestPhone },
                { label: '🏡 Dacha', value: dachalar.find((d) => d.id === selectedBron.dachaId)?.title || '—' },
                { label: '📅 Kelish', value: selectedBron.checkIn },
                { label: '📅 Ketish', value: selectedBron.checkOut },
                { label: '👥 Mehmonlar', value: `${selectedBron.guests} kishi` },
                { label: '💰 Jami', value: formatPrice(selectedBron.totalPrice) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-start py-2 border-b border-gray-50">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-800 text-right">{item.value}</span>
                </div>
              ))}

              {selectedBron.message && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="text-gray-500 text-xs mb-1">💬 Izoh</div>
                  <div className="text-gray-700">{selectedBron.message}</div>
                </div>
              )}

              {/* Status o'zgartirish */}
              <div className="pt-2">
                <div className="text-gray-500 mb-2">Status o'zgartirish</div>
                <div className="flex gap-2">
                  {(['pending', 'confirmed', 'cancelled'] as Status[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedBron.id, s)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedBron.status === s
                          ? statusConfig[s].color + ' border-current'
                          : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {statusConfig[s].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Telegram orqali bog'lanish */}
            <a
              href={`https://t.me/${selectedBron.guestPhone.replace('+', '')}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
            >
              📲 Telegram orqali bog'lanish
            </a>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;