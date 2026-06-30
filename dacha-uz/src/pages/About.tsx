import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="text-5xl mb-4">🏡</div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Biz haqimizda</h1>
          <p className="text-green-200 text-lg">
            Toshkent viloyatidagi eng yaxshi dachalarni bir joyda
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* ── Kim biz ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Kim biz?</h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>DachaUz</strong> — Toshkent viloyati bo'ylab dacha ijarasi bo'yicha
            ishonchli platforma. Biz Chorvoq, Parkent, Ohangaron va boshqa go'zal
            hududlardagi dachalarni bir joyda jamlagan holda, sizga oson va qulay
            qidirish imkoniyatini taqdim etamiz.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Maqsadimiz — oila va do'stlar bilan unutilmas dam olish uchun eng mos
            dachani topishni osonlashtirish.
          </p>
        </div>

        {/* ── Raqamlar ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '🏡', value: '50+', label: 'Dacha' },
            { icon: '📍', value: '9',   label: 'Hudud' },
            { icon: '😊', value: '500+', label: 'Xursand mijoz' },
            { icon: '⭐', value: '4.8', label: 'O\'rtacha reyting' },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-extrabold text-green-700">{item.value}</div>
              <div className="text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>

        {/* ── Nima uchun biz ── */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Nima uchun DachaUz?</h2>
          <div className="space-y-4">
            {[
              { icon: '✅', title: 'Tekshirilgan dachalar', desc: 'Har bir dacha shaxsan ko\'rib chiqilgan va tasdiqlangan' },
              { icon: '💰', title: 'Qulay narxlar', desc: 'To\'g\'ridan-to\'g\'ri egadan — vositachilarsiz' },
              { icon: '📲', title: 'Tezkor bog\'lanish', desc: 'Bron so\'rovi yuborilgach, 1 soat ichida javob' },
              { icon: '🗺', title: 'Qulay joylashuv', desc: 'Har bir dacha uchun aniq manzil va xarita' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bog'lanish ── */}
        <div className="bg-green-800 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Bog'lanish</h2>
          <p className="text-green-200 text-sm mb-5">
            Savollaringiz bormi? Telegram orqali yozing!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noreferrer"
              className="bg-white text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
            >
              📲 Telegram
            </a>
            <button
              onClick={() => navigate('/dachalar')}
              className="border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              🏡 Dachalarni ko'rish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;