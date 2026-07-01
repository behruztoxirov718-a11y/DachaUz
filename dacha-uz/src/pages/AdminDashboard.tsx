import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LogOut, X, CheckCircle, Clock, XCircle, DollarSign, ClipboardList, Plus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { useDachalar } from '../hooks/useDachalar';
import { useBooking } from '../hooks/useBooking';
import type { Dacha } from '../types';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

type Status = 'pending' | 'confirmed' | 'cancelled';
type Tab = 'bronlar' | 'dachalar';

const statusConfig: Record<Status, { label: string; color: string; Icon: React.FC<{ size?: number }> }> = {
  pending:   { label: 'Kutilmoqda',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', Icon: Clock       },
  confirmed: { label: 'Tasdiqlandi',   color: 'bg-green-100 text-green-700 border-green-200',   Icon: CheckCircle },
  cancelled: { label: 'Bekor qilindi', color: 'bg-red-100 text-red-600 border-red-200',          Icon: XCircle     },
};

const emptyDacha = {
  title: '', location: 'Toshkent viloyati', district: '', pricePerDay: 0,
  pricePerWeekend: 0, guests: 0, rooms: 0, beds: 0, area: 0,
  images: [], amenities: [], description: '', rating: 5.0,
  reviewCount: 0, isAvailable: true, ownerId: '',
  ownerTelegram: '', ownerPhone: '', minDays: 1, createdAt: new Date().toISOString(),
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { dachalar, loading: dLoading, addDacha, deleteDacha, updateDacha } = useDachalar();
  const { bronlar, loading: bLoading, updateStatus } = useBooking();

  const [tab, setTab] = useState<Tab>('bronlar');
  const [filterStatus, setFilterStatus] = useState<'all' | Status>('all');
  const [selectedBron, setSelectedBron] = useState<any>(null);
  const [showDachaForm, setShowDachaForm] = useState(false);
  const [editingDacha, setEditingDacha] = useState<Dacha | null>(null);
  const [formData, setFormData] = useState<Omit<Dacha, 'id'>>(emptyDacha);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_auth') !== 'true') navigate('/admin');
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    navigate('/admin');
  };

  // Bron status
  const handleStatusChange = async (id: string, newStatus: Status) => {
    await updateStatus(id, newStatus);
    if (selectedBron?.id === id) setSelectedBron((p: any) => p ? { ...p, status: newStatus } : null);
  };

  // Dacha form
  const openAddForm = () => {
    setEditingDacha(null);
    setFormData(emptyDacha);
    setShowDachaForm(true);
  };

  const openEditForm = (dacha: Dacha) => {
    setEditingDacha(dacha);
    setFormData({ ...dacha } as any);
    setShowDachaForm(true);
  };

  const handleSaveDacha = async () => {
    if (!formData.title || !formData.district || !formData.pricePerDay) return;
    setSaving(true);
    try {
      if (editingDacha) {
        await updateDacha(editingDacha.id, formData);
      } else {
        await addDacha(formData);
      }
      setShowDachaForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDacha = async (id: string) => {
    if (window.confirm('Dachani ochirmoqchimisiz?')) {
      await deleteDacha(id);
    }
  };

  const filtered = filterStatus === 'all' ? bronlar : bronlar.filter((b) => b.status === filterStatus);

  const stats = {
    total:     bronlar.length,
    pending:   bronlar.filter((b) => b.status === 'pending').length,
    confirmed: bronlar.filter((b) => b.status === 'confirmed').length,
    revenue:   bronlar.filter((b) => b.status === 'confirmed').reduce((s, b) => s + b.totalPrice, 0),
  };

  const field = (label: string, el: React.ReactNode) => (
    <div key={label}>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {el}
    </div>
  );

  const input = (key: keyof typeof formData, type = 'text', placeholder = '') => (
    <input
      type={type}
      value={formData[key] as string}
      onChange={(e) => setFormData((p) => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 bg-gray-50"
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Home size={20} className="text-green-700" />
            <span className="font-extrabold text-gray-900">DachaUz</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500 font-medium">Admin panel</span>
          </div>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors flex items-center gap-1.5">
            <LogOut size={16} /> Chiqish
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Statistika */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { Icon: ClipboardList, label: 'Jami bronlar',  value: stats.total,               color: 'bg-blue-50 border-blue-100',     text: 'text-blue-700'   },
            { Icon: Clock,         label: 'Kutilmoqda',    value: stats.pending,              color: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-700' },
            { Icon: CheckCircle,   label: 'Tasdiqlangan',  value: stats.confirmed,            color: 'bg-green-50 border-green-100',   text: 'text-green-700'  },
            { Icon: DollarSign,    label: 'Daromad',       value: formatPrice(stats.revenue), color: 'bg-purple-50 border-purple-100', text: 'text-purple-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl border p-4 ${s.color}`}>
              <s.Icon size={22} className={s.text + " mb-2"} strokeWidth={1.5} />
              <div className={`text-xl font-extrabold ${s.text}`}>{s.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tablar */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('bronlar')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'bronlar' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
            }`}
          >
            Bronlar {bronlar.length > 0 && <span className="ml-1 opacity-70">{bronlar.length}</span>}
          </button>
          <button
            onClick={() => setTab('dachalar')}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              tab === 'dachalar' ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400'
            }`}
          >
            Dachalar {dachalar.length > 0 && <span className="ml-1 opacity-70">{dachalar.length}</span>}
          </button>
        </div>

        {/* ── BRONLAR TAB ── */}
        {tab === 'bronlar' && (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {(['all', 'pending', 'confirmed', 'cancelled'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    filterStatus === s ? 'bg-green-700 text-white border-green-700' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
                  }`}
                >
                  {s === 'all' ? 'Barchasi' : statusConfig[s].label}
                  <span className="ml-1.5 text-xs opacity-70">
                    {s === 'all' ? bronlar.length : bronlar.filter((b) => b.status === s).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {bLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <Loader2 size={32} className="animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ClipboardList size={48} className="mx-auto mb-3" strokeWidth={1} />
                  <p>Bu bolimda bronlar yoq</p>
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
                        const StatusIcon = statusConfig[bron.status].Icon;
                        return (
                          <tr key={bron.id} onClick={() => setSelectedBron(bron)} className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <td className="px-5 py-4">
                              <div className="font-semibold text-gray-900">{bron.guestName}</div>
                              <div className="text-gray-400 text-xs">{bron.guestPhone}</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-gray-700">{dacha?.title || bron.dachaId}</div>
                              <div className="text-gray-400 text-xs">{bron.guests} kishi</div>
                            </td>
                            <td className="px-5 py-4">
                              <div className="text-gray-700">{bron.checkIn}</div>
                              <div className="text-gray-400 text-xs">{bron.checkOut}</div>
                            </td>
                            <td className="px-5 py-4 font-semibold text-green-700">{formatPrice(bron.totalPrice)}</td>
                            <td className="px-5 py-4">
                              <span className={`flex items-center gap-1 w-fit px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig[bron.status].color}`}>
                                <StatusIcon size={12} /> {statusConfig[bron.status].label}
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
          </>
        )}

        {/* ── DACHALAR TAB ── */}
        {tab === 'dachalar' && (
          <>
            <div className="flex justify-end mb-4">
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 bg-green-700 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Plus size={18} /> Dacha qoshish
              </button>
            </div>

            {dLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">
                <Loader2 size={32} className="animate-spin" />
              </div>
            ) : dachalar.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm text-gray-400">
                <Home size={48} className="mx-auto mb-3" strokeWidth={1} />
                <p className="mb-4">Hali dachalar yoq</p>
                <button onClick={openAddForm} className="bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-600 transition-colors">
                  Birinchi dachani qoshish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dachalar.map((dacha) => (
                  <div key={dacha.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="h-36 bg-gradient-to-br from-green-100 to-green-200 relative">
                      {dacha.images?.[0] && (
                        <img src={dacha.images[0]} alt={dacha.title} className="w-full h-full object-cover" />
                      )}
                      <div className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full ${
                        dacha.isAvailable ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {dacha.isAvailable ? 'Bosh' : 'Band'}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{dacha.title}</h3>
                      <p className="text-gray-500 text-sm mb-1">{dacha.district}</p>
                      <p className="text-green-700 font-semibold text-sm mb-3">{formatPrice(dacha.pricePerDay)} / kun</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(dacha)}
                          className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-700 text-sm font-medium py-2 rounded-xl transition-colors"
                        >
                          <Edit2 size={15} /> Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDeleteDacha(dacha.id)}
                          className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-400 hover:border-red-400 hover:text-red-500 text-sm font-medium px-3 py-2 rounded-xl transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Bron detail modal */}
      {selectedBron && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setSelectedBron(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-gray-900 text-lg">Bron malumotlari</h3>
              <button onClick={() => setSelectedBron(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Mijoz',     value: selectedBron.guestName },
                { label: 'Telefon',   value: selectedBron.guestPhone },
                { label: 'Kelish',    value: selectedBron.checkIn },
                { label: 'Ketish',    value: selectedBron.checkOut },
                { label: 'Mehmonlar', value: selectedBron.guests + " kishi" },
                { label: 'Jami',      value: formatPrice(selectedBron.totalPrice) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-800">{item.value}</span>
                </div>
              ))}
              {selectedBron.message && (
                <div className="bg-gray-50 rounded-xl p-3 mt-2">
                  <div className="text-gray-500 text-xs mb-1">Izoh</div>
                  <div className="text-gray-700">{selectedBron.message}</div>
                </div>
              )}
              <div className="pt-3">
                <div className="text-gray-500 mb-2 text-xs font-semibold uppercase tracking-wide">Status ozgartirish</div>
                <div className="flex gap-2">
                  {(['pending', 'confirmed', 'cancelled'] as Status[]).map((s) => {
                    const Icon = statusConfig[s].Icon;
                    return (
                      <button key={s} onClick={() => handleStatusChange(selectedBron.id, s)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                          selectedBron.status === s ? statusConfig[s].color : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                        }`}>
                        <Icon size={12} /> {statusConfig[s].label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <a
              href={"https://t.me/" + selectedBron.guestPhone.replace('+', '')}
              target="_blank" rel="noreferrer"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-xl transition-colors"
            >
              Telegram orqali boglanish
            </a>
          </div>
        </div>
      )}

      {/* Dacha form modal */}
      {showDachaForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setShowDachaForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-extrabold text-gray-900 text-lg">
                {editingDacha ? 'Dachani tahrirlash' : 'Yangi dacha qoshish'}
              </h3>
              <button onClick={() => setShowDachaForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {field('Nomi *',        input('title',          'text',   'Chorvoq kolida uy'))}
              {field('Hudud *',       input('district',       'text',   'Chorvoq'))}
              {field('Kunlik narx *', input('pricePerDay',    'number', '800000'))}
              {field('Dam olish kuni narxi', input('pricePerWeekend', 'number', '1200000'))}
              {field('Max mehmon',    input('guests',         'number', '20'))}
              {field('Xonalar',       input('rooms',          'number', '5'))}
              {field('Karavotlar',    input('beds',           'number', '10'))}
              {field('Maydon (sotix)', input('area',          'number', '12'))}
              {field('Minimal kun',   input('minDays',        'number', '1'))}
              {field('Egasi Telegram', input('ownerTelegram', 'text',   '@username'))}
              {field('Egasi telefon', input('ownerPhone',     'text',   '+998901234567'))}
              {field('Rasm URL',
                <input
                  type="text"
                  value={formData.images?.[0] || ''}
                  onChange={(e) => setFormData((p) => ({ ...p, images: [e.target.value] }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 bg-gray-50"
                />
              )}
            </div>

            <div className="mt-3">
              {field('Tavsif',
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                  placeholder="Dacha haqida..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-green-500 bg-gray-50 resize-none"
                />
              )}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <input
                type="checkbox"
                id="isAvailable"
                checked={formData.isAvailable}
                onChange={(e) => setFormData((p) => ({ ...p, isAvailable: e.target.checked }))}
                className="w-4 h-4 accent-green-700"
              />
              <label htmlFor="isAvailable" className="text-sm text-gray-700 font-medium">Dacha bosh (ijaraga beriladi)</label>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowDachaForm(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSaveDacha}
                disabled={saving || !formData.title || !formData.district}
                className={`flex-1 py-3 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  saving || !formData.title || !formData.district
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-700 hover:bg-green-600 text-white'
                }`}
              >
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saqlanmoqda...</> : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;