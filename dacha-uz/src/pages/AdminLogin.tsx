import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Home, Loader2 } from 'lucide-react';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!password.trim()) {
      setError('Parolni kiriting');
      return;
    }
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin/dashboard');
      } else {
        setError("Parol notogri. Qayta urinib koring.");
        setPassword('');
      }
      setLoading(false);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Home size={32} className="text-green-700" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">DachaUz Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Boshqaruv paneliga kirish</p>
          </div>

          {/* Xato */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          {/* Parol */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Parol
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={17} />
              </div>
              <input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={handleKeyDown}
                placeholder="Parolni kiriting"
                autoFocus
                className={`w-full border rounded-xl pl-10 pr-12 py-3 text-sm focus:outline-none transition-colors ${
                  error
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-green-500 bg-gray-50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Kirish */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-700 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Tekshirilmoqda...
              </>
            ) : (
              <>
                <Lock size={17} />
                Kirish
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 py-3 rounded-xl text-sm text-gray-500 hover:text-green-700 hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Home size={16} /> Bosh sahifaga qaytish
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Parolni unutdingizmi? .env faylidan tekshiring
        </p>

      </div>
    </div>
  );
};

export default AdminLogin;