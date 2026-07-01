import { useNavigate } from 'react-router-dom';
import { Home, CheckCircle, Banknote, MessageCircle, Map, Send } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Home size={32} className="text-white" strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3">Biz haqimizda</h1>
          <p className="text-green-200 text-lg">
            Toshkent viloyatidagi eng yaxshi dachalarni bir joyda
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">

        {/* Kim biz */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Kim biz?</h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>DachaUz</strong> — Toshkent viloyati boylab dacha ijarasi boyicha
            ishonchli platforma. Biz Chorvoq, Parkent, Ohangaron va boshqa gozal
            hududlardagi dachalarni bir joyda jamlagan holda, sizga oson va qulay
            qidirish imkoniyatini taqdim etamiz.
          </p>
          <p className="text-gray-600 leading-relaxed mt-3">
            Maqsadimiz — oila va dostlar bilan unutilmas dam olish uchun eng mos
            dachani topishni osonlashtirish.
          </p>
        </div>

        {/* Raqamlar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '50+',  label: 'Dacha'           },
            { value: '9',    label: 'Hudud'           },
            { value: '500+', label: 'Xursand mijoz'   },
            { value: '4.8',  label: "Ortacha reyting" },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-2xl font-extrabold text-green-700 mb-1">{item.value}</div>
              <div className="text-gray-400 text-sm">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Nima uchun biz */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Nima uchun DachaUz?</h2>
          <div className="space-y-4">
            {[
              { Icon: CheckCircle,   title: 'Tekshirilgan dachalar', desc: "Har bir dacha shaxsan korib chiqilgan va tasdiqlangan"     },
              { Icon: Banknote,      title: 'Qulay narxlar',         desc: "Togridan-togri egadan — vositachilarsiz"                  },
              { Icon: MessageCircle, title: 'Tezkor boglanish',      desc: "Bron sorovi yuborilgach, 1 soat ichida javob"             },
              { Icon: Map,           title: 'Qulay joylashuv',       desc: "Har bir dacha uchun aniq manzil va xarita"                },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.Icon size={20} className="text-green-700" strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{item.title}</div>
                  <div className="text-gray-500 text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boglanish */}
        <div className="bg-green-800 rounded-2xl p-6 text-white text-center">
          <h2 className="text-xl font-bold mb-2">Boglanish</h2>
          <p className="text-green-200 text-sm mb-5">
            Savollaringiz bormi? Telegram orqali yozing!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/your_telegram"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-white text-green-800 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
            >
              <Send size={17} /> Telegram
            </a>
            <button
              onClick={() => navigate('/dachalar')}
              className="flex items-center justify-center gap-2 border-2 border-white/40 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              <Home size={17} /> Dachalarni korish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;