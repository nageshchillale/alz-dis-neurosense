import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function SignupPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    role: 'PATIENT' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-[#7000FF]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-[600px] h-[600px] bg-[#00F0FF]/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card w-full max-w-2xl p-10 relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-3 text-base text-white/50 hover:text-white mb-10 transition-colors group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" /> {t('landing.explore_btn')}
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl font-heading font-semibold text-white mb-3">{t('auth.create_account')}</h1>
          <p className="text-white/60 text-lg font-medium">{t('auth.signup_desc')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-[#00F0FF] ml-1">{t('auth.username')}</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                <input
                  type="text"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF] transition-all shadow-inner"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-[#00F0FF] ml-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
                <input
                  type="email"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF] transition-all shadow-inner"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold uppercase tracking-widest text-[#00F0FF] ml-1">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-white/40" />
              <input
                type="password"
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-[#00F0FF] transition-all shadow-inner"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-widest text-[#00F0FF] ml-1">{t('auth.account_type')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'PATIENT' })}
                className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.role === 'PATIENT' 
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-white shadow-[0_0_30px_rgba(0,240,255,0.2)]' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                }`}
              >
                <User className="w-8 h-8 mb-1" />
                <span className="text-xl font-bold">{t('auth.patient')}</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'CAREGIVER' })}
                className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
                  formData.role === 'CAREGIVER' 
                    ? 'bg-[#7000FF]/15 border-[#7000FF] text-white shadow-[0_0_30px_rgba(112,0,255,0.2)]' 
                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                }`}
              >
                <ShieldCheck className="w-8 h-8 mb-1" />
                <span className="text-xl font-bold">{t('auth.caregiver')}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-lg font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 bg-white text-black font-bold text-2xl rounded-2xl flex items-center justify-center gap-3 hover:bg-[#00F0FF] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-2xl shadow-[#00F0FF]/20"
          >
            {isLoading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                {t('auth.signup_btn')} <UserPlus className="w-8 h-8" />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 text-center text-lg">
          <span className="text-white/50">{t('auth.have_acc')} </span>
          <Link to="/login" className="text-[#00F0FF] hover:underline font-bold decoration-2 underline-offset-4">{t('nav.login')}</Link>
        </div>
      </motion.div>
    </div>
  );
}
