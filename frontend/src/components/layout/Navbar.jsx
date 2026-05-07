import { Link } from 'react-router-dom';
import { Activity, LogOut, User as UserIcon, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'mr' ? 'en' : 'mr';
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav className="fixed top-0 inset-x-0 z-50 h-24 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Activity className="h-10 w-10 text-[#00F0FF] group-hover:text-white transition-colors glow-icon" />
          <span className="text-2xl font-heading font-semibold tracking-wide text-white">
            नेअुरो<span className="text-[#00F0FF]">सेन्स</span>
          </span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-10 text-base font-medium text-white/70">
          <Link to="/" className="hover:text-white transition-colors tracking-wide">{t('nav.platform')}</Link>
          <Link to="/assessment" className="hover:text-[#00F0FF] transition-colors tracking-wide">{t('nav.screening')}</Link>
          <Link to="/dashboard" className="hover:text-[#00F0FF] transition-colors tracking-wide">{t('nav.dashboard')}</Link>
        </div>

        <div className="flex items-center gap-6">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-xs font-semibold text-[#00F0FF] uppercase tracking-tighter"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{i18n.language === 'mr' ? 'English' : 'मराठी'}</span>
          </button>

          <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />

          {isAuthenticated ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 text-white/70">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#00F0FF]">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="hidden sm:inline text-sm font-semibold">{t('nav.hello')}, {user?.username || 'Member'}</span>
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-sm font-semibold text-white/50 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" /> {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm font-semibold text-white hover:text-[#00F0FF] transition-colors">{t('nav.login')}</Link>
              <Link 
                to="/signup"
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-all backdrop-blur-md shadow-lg shadow-[#00F0FF]/5"
              >
                {t('nav.signup')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
