import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Bed, DoorOpen, Maximize, Star, ArrowLeft, Send, Phone, Map, Loader2 } from 'lucide-react';
import { useDachalar } from '../hooks/useDachalar';
import { amenityLabels } from '../data/dachalar';

const formatPrice = (price: number) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

const DachaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dachalar, loading } = useDachalar();
  const [activeImg, setActiveImg] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-green-600" />
      </div>
    );
  }

  const dacha = dachalar.find((d) => d.id === id);

  if (!dacha) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Dacha topilmadi</h2>
        <p className="text-gray-500 mb-6">Bu dacha mavjud emas yoki ochirilgan</p>
        <button
          onClick={() => navigate('/dachalar')}
          className="bg-green-700 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-green-600 transition-colors"
        >
          Dachalar royxatiga qaytish
        </button>
      </div>
    );
  }

  const images = dacha.images?.length > 0 ? dacha.images : [null];
  const telegramUsername = dacha.ownerTelegram?.replace('@', '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-green-700 font-medium mb-5 transition-colors"
        >
          <ArrowLeft size={18} /> Orqaga
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* CHAP USTUN */}
          <div className="lg:col-span-2 space-y-6">

            {/* Rasmlar */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative h-72 md:h-96 bg-gradient-to-br from-green-100 to-green-200">
                {images[activeImg] ? (
                  <img
                    src={images[activeImg]!}
                    alt={dacha.title}
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : null}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 font-bold text-yellow-600">
                  <Star size={15} fill="currentColor" />
                  {dacha.rating}
                  <span className="text-gray-400 text-sm font-normal">({dacha.reviewCount})</span>
                </div>
                {!dacha.isAvailable && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm">
                    Band
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImg === i ? 'border-green-600' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      {img ? (
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-green-100" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sarlavha */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">{dacha.title}</h1>
              <p className="text-gray-500 mb-4 flex items-center gap-1">
                <MapPin size={15} /> {dacha.district}, {dacha.location}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { Icon: Users,    label: 'Mehmon',  value: `${dacha.guests} kishi` },
                  { Icon: Bed,      label: 'Karavot', value: `${dacha.beds} ta`      },
                  { Icon: DoorOpen, label: 'Xona',    value: `${dacha.rooms} ta`     },
                  { Icon: Maximize, label: 'Maydon',  value: `${dacha.area} sotix`   },
                ].map((item) => (
                  <div key={item.label} className="bg-green-50 rounded-xl p-3 text-center">
                    <item.Icon size={24} className="mx-auto mb-1 text-green-700" strokeWidth={1.5} />
                    <div className="font-bold text-gray-800 text-sm">{item.value}</div>
                    <div className="text-gray-400 text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tavsif */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Tavsif</h2>
              <p className="text-gray-600 leading-relaxed">{dacha.description}</p>
            </div>

            {/* Qulayliklar */}
            {dacha.amenities?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Qulayliklar</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {dacha.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                      <span className="text-sm text-green-800 font-medium">{amenityLabels[a]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Egasi bilan boglanish */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Egasi bilan boglanish</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {dacha.ownerTelegram && (
                  <a
                    href={"https://t.me/" + telegramUsername}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    <Send size={17} /> Telegramda yozish
                    <span className="text-blue-200 text-sm font-normal">{dacha.ownerTelegram}</span>
                  </a>
                )}
                {dacha.ownerPhone && (
                  <a
                    href={"tel:" + dacha.ownerPhone}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                  >
                    <Phone size={17} /> {dacha.ownerPhone}
                  </a>
                )}
              </div>
            </div>

            {/* Joylashuv */}
            {dacha.coordinates && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Joylashuv</h2>
                <a
                  href={"https://www.google.com/maps?q=" + dacha.coordinates.lat + "," + dacha.coordinates.lng}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors group"
                >
                  <Map size={22} className="text-blue-500" />
                  <div>
                    <div className="font-semibold text-blue-700 text-sm group-hover:underline">Google Maps da ochish</div>
                    <div className="text-gray-400 text-xs">
                      {dacha.coordinates.lat.toFixed(4)}, {dacha.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>

          {/* ONG USTUN */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24 space-y-4">

              <div>
                <span className="text-3xl font-extrabold text-green-700">{formatPrice(dacha.pricePerDay)}</span>
                <span className="text-gray-400 text-sm ml-1">/ kun</span>
                {dacha.pricePerWeekend !== dacha.pricePerDay && (
                  <div className="mt-2 bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 text-sm">
                    <span className="text-orange-700 font-semibold">
                      Dam olish kuni: {formatPrice(dacha.pricePerWeekend)}
                    </span>
                  </div>
                )}
              </div>

              {dacha.minDays > 1 && (
                <div className="bg-yellow-50 border border-yellow-100 rounded-xl px-3 py-2 text-sm text-yellow-700">
                  Minimal ijara: <strong>{dacha.minDays} kun</strong>
                </div>
              )}

              <div className={`rounded-xl px-3 py-2 text-sm font-semibold text-center ${
                dacha.isAvailable
                  ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-600 border border-red-100'
              }`}>
                {dacha.isAvailable ? "Bosh — bron qilish mumkin" : "Hozircha band"}
              </div>

              <button
                onClick={() => dacha.isAvailable && navigate("/bron/" + dacha.id)}
                disabled={!dacha.isAvailable}
                className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${
                  dacha.isAvailable
                    ? 'bg-green-700 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Bron qilish
              </button>

              {dacha.ownerTelegram && (
                <a
                  href={"https://t.me/" + telegramUsername}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
                >
                  <Send size={16} /> Telegramda yozish
                </a>
              )}

              {dacha.ownerPhone && (
                <a
                  href={"tel:" + dacha.ownerPhone}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-green-700 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
                >
                  <Phone size={16} /> {dacha.ownerPhone}
                </a>
              )}

              <div className="border-t pt-4 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Reyting</span>
                  <span className="font-semibold text-gray-700 flex items-center gap-1">
                    <Star size={13} className="text-yellow-500" fill="currentColor" />
                    {dacha.rating} ({dacha.reviewCount} sharh)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Hudud</span>
                  <span className="font-semibold text-gray-700">{dacha.district}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DachaDetail;