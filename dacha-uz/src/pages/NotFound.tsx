import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        <div className="text-8xl mb-4">🏚</div>
        <h1 className="text-6xl font-extrabold text-green-700 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Sahifa topilmadi</h2>
        <p className="text-gray-500 mb-8">
          Siz qidirgan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-green-700 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            🏠 Bosh sahifaga
          </button>
          <button
            onClick={() => navigate('/dachalar')}
            className="border-2 border-green-700 text-green-700 font-bold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
          >
            🏡 Dachalarni ko'rish
          </button>
        </div>

      </div>
    </div>
  );
};

export default NotFound;