import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await loginUser(formData);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7000FF]/10 rounded-full blur-[140px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-lg p-10 relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-3 text-base text-white/50 hover:text-white mb-10 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" /> {t('landing.explore_btn')}
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-heading font-semibold text-white mb-3">{t('auth.welcome_back')}</h1>
          <p className="text-white/60 text-lg font-medium">{t('auth.login_desc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-[#00F0FF] ml-1">{t('auth.username')}</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
              <input
                type="text"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF] focus:bg-white/10 transition-all shadow-inner"
                placeholder={t('auth.username')}
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-[#00F0FF] ml-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF] focus:bg-white/10 transition-all shadow-inner"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-base font-medium text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-white text-black font-bold text-xl rounded-2xl flex items-center justify-center gap-3 hover:bg-[#00F0FF] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-[#00F0FF]/10"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {t('auth.login_btn')} <LogIn className="w-6 h-6" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center text-lg">
          <span className="text-white/50">{t('auth.no_acc')} </span>
          <Link to="/signup" className="text-[#00F0FF] hover:underline font-bold decoration-2 underline-offset-4">{t('auth.signup')}</Link>
        </div>
      </motion.div>
    </div>
  );
}
