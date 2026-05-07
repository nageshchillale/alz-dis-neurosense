import { motion } from 'framer-motion';
import { ArrowRight, Brain, Activity, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function DNAVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 mix-blend-screen overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        className="relative w-[1000px] h-[1000px]"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border-[1px] border-[#00F0FF]/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] border-[2px] border-[#7000FF]/20 rounded-full blur-[4px]" />
        
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 bg-[#00F0FF] rounded-full shadow-[0_0_20px_#00F0FF]"
            style={{
              top: `${50 + 42 * Math.sin(i * 0.4)}%`,
              left: `${50 + 42 * Math.cos(i * 0.4)}%`,
            }}
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0B0F19]/40 to-[#0B0F19] pointer-events-none" />
    </div>
  );
}

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';

  return (
    <div className="relative min-h-screen overflow-hidden">
      <DNAVisual />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-32 px-6 flex items-center justify-center text-center">
        <div className="max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-12 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] animate-pulse shadow-[0_0_10px_#00F0FF]" />
              <span className="text-sm font-semibold tracking-widest uppercase text-white/80">{t('landing.hero_badge')}</span>
            </div>
          </motion.div>
          
          <motion.h1 
            className={`font-heading font-semibold text-white tracking-tight mb-10 leading-[1.15] ${isMarathi ? 'text-6xl md:text-8xl lg:text-9xl' : 'text-5xl md:text-7xl lg:text-8xl'}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            {t('landing.hero_title')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] via-[#7000FF] to-[#00F0FF] bg-[length:200%_auto] animate-gradient text-glow">
              {t('landing.hero_subtitle')}
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/60 mb-16 max-w-3xl mx-auto leading-relaxed font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            {t('landing.hero_desc')}
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link to="/assessment" className="group relative px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl overflow-hidden w-full sm:w-auto shadow-2xl shadow-[#00F0FF]/10 hover:shadow-[#00F0FF]/30 transition-all">
              <span className="relative z-10 flex items-center justify-center gap-3">
                {t('landing.start_btn')} <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <a href="#features" className="px-10 py-5 text-white font-semibold text-xl hover:text-[#00F0FF] transition-colors flex items-center gap-2">
              {t('landing.explore_btn')}
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-32 px-6 bg-black/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto z-10">
          <div className="text-center mb-24">
             <h2 className="text-4xl md:text-6xl font-heading font-semibold text-white mb-8">{t('landing.features_title')}</h2>
             <p className="text-white/50 text-xl max-w-2xl mx-auto leading-relaxed font-medium">{t('landing.features_desc')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Brain className="w-10 h-10 text-[#00F0FF]" />}
              title={t('landing.feat1_title')}
              description={t('landing.feat1_desc')}
            />
            <FeatureCard 
              icon={<Activity className="w-10 h-10 text-[#7000FF]" />}
              title={t('landing.feat2_title')}
              description={t('landing.feat2_desc')}
            />
            <FeatureCard 
              icon={<ShieldCheck className="w-10 h-10 text-[#00F0FF]" />}
              title={t('landing.feat3_title')}
              description={t('landing.feat3_desc')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-card p-10 group hover:border-[#00F0FF]/40 transition-all duration-500"
    >
      <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#00F0FF]/10 transition-all shadow-inner border border-white/10">
        {icon}
      </div>
      <h3 className="text-3xl font-semibold text-white mb-6 font-heading tracking-tight leading-tight">{title}</h3>
      <p className="text-white/60 text-lg leading-relaxed font-medium">
        {description}
      </p>
    </motion.div>
  );
}
