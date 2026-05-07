import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Activity, Brain, Clock, ShieldAlert, Loader2, TrendingUp, Sparkles, FileText, PlusCircle } from 'lucide-react';
import { fetchDashboardAnalytics } from '../services/api';
import { useTranslation } from 'react-i18next';

const MEMORY_DATA = [
  { month: 'Jan', memory: 85, attention: 90 },
  { month: 'Feb', memory: 88, attention: 92 },
  { month: 'Mar', memory: 85, attention: 88 },
  { month: 'Apr', memory: 89, attention: 94 },
  { month: 'May', memory: 92, attention: 95 },
  { month: 'Jun', memory: 94, attention: 96 },
];

const RADAR_DATA = [
  { subject: 'Memory', A: 120, fullMark: 150 },
  { subject: 'Attention', A: 98, fullMark: 150 },
  { subject: 'Language', A: 86, fullMark: 150 },
  { subject: 'Visuospatial', A: 99, fullMark: 150 },
  { subject: 'Orientation', A: 85, fullMark: 150 },
  { subject: 'Execution', A: 65, fullMark: 150 },
];

export default function DashboardPage() {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';
  const [trends, setTrends] = useState([]);
  const [lastAssessment, setLastAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Marathi labels for Radar subjects
  const getSubjectLabel = (subject) => {
    const labels = {
      'Memory': isMarathi ? 'स्मरणशक्ती' : 'Memory',
      'Attention': isMarathi ? 'एकाग्रता' : 'Attention',
      'Language': isMarathi ? 'भाषा' : 'Language',
      'Visuospatial': isMarathi ? 'दृष्टी-अवकाशीय' : 'Visuospatial',
      'Orientation': isMarathi ? 'ओळख' : 'Orientation',
      'Execution': isMarathi ? 'अंमलबजावणी' : 'Execution',
    };
    return labels[subject] || subject;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchDashboardAnalytics();
        setTrends(data.trends.length > 0 ? data.trends : MEMORY_DATA);
        setLastAssessment(data.latest_assessment);
      } catch (e) {
        console.error(e);
        setTrends(MEMORY_DATA); 
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F19] gap-4">
         <Loader2 className="w-16 h-16 animate-spin text-[#00F0FF]" />
         <p className="text-white/40 font-bold uppercase tracking-widest">{isMarathi ? 'डेटा लोड होत आहे...' : 'Loading Data...'}</p>
       </div>
     );
  }

  const dynamicRadar = [
    { subject: getSubjectLabel('Memory'), A: lastAssessment?.memory_score || 85, fullMark: 100 },
    { subject: getSubjectLabel('Attention'), A: lastAssessment?.attention_score || 90, fullMark: 100 },
    { subject: getSubjectLabel('Language'), A: 86, fullMark: 100 },
    { subject: getSubjectLabel('Visuospatial'), A: 92, fullMark: 100 },
    { subject: getSubjectLabel('Orientation'), A: lastAssessment?.orientation_score || 85, fullMark: 100 },
    { subject: getSubjectLabel('Execution'), A: 75, fullMark: 100 },
  ];

  return (
    <div className="container mx-auto px-4 py-16 lg:px-12">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-16 gap-8">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white tracking-tight mb-4">{t('dashboard.title')}</h1>
          <p className="text-white/60 text-xl font-medium max-w-2xl">{t('dashboard.desc')}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-wrap gap-4 w-full sm:w-auto"
        >
           <button className="flex-1 sm:flex-none px-8 py-4 glass-card font-bold text-lg text-white hover:border-[#00F0FF]/60 hover:bg-white/5 transition-all flex items-center justify-center gap-3">
             <FileText className="w-5 h-5 text-[#00F0FF]" /> {t('dashboard.gen_report')}
           </button>
           <button className="flex-1 sm:flex-none px-8 py-4 bg-[#00F0FF] text-black font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.5)] hover:scale-[1.03] transition-all flex items-center justify-center gap-3">
             <PlusCircle className="w-5 h-5" /> {t('dashboard.new_assessment')}
           </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <MetricCard 
          icon={<ShieldAlert className="w-8 h-8 text-[#00F0FF]" />} 
          title={t('dashboard.risk_index')} 
          value={lastAssessment?.risk_level ? t(`dashboard.${lastAssessment.risk_level.toLowerCase()}`) : t('dashboard.low')} 
          trend={t('dashboard.stable')} 
        />
        <MetricCard 
          icon={<Brain className="w-8 h-8 text-[#7000FF]" />} 
          title={t('dashboard.memory_score')} 
          value={`${lastAssessment?.memory_score || 94}/100`} 
          trend={`+2% ${t('dashboard.improvement')}`} 
        />
        <MetricCard 
          icon={<Activity className="w-8 h-8 text-emerald-400" />} 
          title={t('dashboard.processing_speed')} 
          value="1.2s" 
          trend="-0.1s सुधारणा" 
        />
        <MetricCard 
          icon={<Clock className="w-8 h-8 text-white/50" />} 
          title={t('dashboard.last_screening')} 
          value={t('dashboard.today')} 
          trend="Automated Checkup" 
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Trajectory Chart */}
        <div className="glass-card p-10 xl:col-span-2 min-h-[550px] flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-[#00F0FF]" /> {t('dashboard.trajectory')}
            </h3>
            <div className="flex gap-4 text-xs font-bold uppercase tracking-widest">
               <span className="flex items-center gap-2 text-[#00F0FF]"><div className="w-2.5 h-2.5 rounded-full bg-[#00F0FF]" /> {t('dashboard.memory_score')}</span>
               <span className="flex items-center gap-2 text-[#7000FF]"><div className="w-2.5 h-2.5 rounded-full bg-[#7000FF]" /> {t('landing.feat2_title')}</span>
            </div>
          </div>
          
          <div className="h-[400px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAttention" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7000FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7000FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.1)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 700}} />
                <YAxis stroke="rgba(255,255,255,0.1)" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: 700}} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(11, 15, 25, 0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="memory" stroke="#00F0FF" strokeWidth={4} fillOpacity={1} fill="url(#colorMemory)" />
                <Area type="monotone" dataKey="attention" stroke="#7000FF" strokeWidth={4} fillOpacity={1} fill="url(#colorAttention)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Neural Radar & Insight */}
        <div className="flex flex-col gap-8">
          <div className="glass-card p-10 flex-1 min-h-[400px] flex flex-col items-center">
            <h3 className="text-2xl font-heading font-bold text-white mb-6 self-start w-full">{t('dashboard.neural_sig')}</h3>
            <div className="w-full h-full flex-1 min-h-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={dynamicRadar}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="Cognitive Profile" dataKey="A" stroke="#00F0FF" fill="#00F0FF" fillOpacity={0.3} strokeWidth={3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="glass-card p-8 border-[#00F0FF]/10 relative group overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform duration-700">
               <Sparkles className="w-24 h-24 text-[#00F0FF]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00F0FF]" /> {t('dashboard.wellness_insight')}
            </h3>
            <p className="text-lg text-white/70 leading-relaxed font-medium">
              {isMarathi 
                ? 'तुमच्या मेमरी रिकॉलमध्ये सातत्यपूर्ण सुधारणा झाली आहे. मेमरी कन्सोलिडेशनसाठी दररोज ७.५+ तास झोप घेण्याची खात्री करा.' 
                : "Your memory retrieval latency has improved consistently. Ensure 7.5+ hours of sleep to maintain memory consolidation optimization."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, value, trend }) {
  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} className="glass-card p-8 group transition-all duration-500">
      <div className="flex justify-between items-start mb-6">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-[#00F0FF]/40 group-hover:bg-[#00F0FF]/5 transition-all">
          {icon}
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00F0FF] opacity-0 group-hover:opacity-100 transition-opacity">Live Stream</div>
      </div>
      <div>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest mb-3">{title}</p>
        <h4 className="text-4xl font-heading font-bold text-white tracking-tight mb-3">{value}</h4>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
           <p className="text-xs text-white/40 font-bold">{trend}</p>
        </div>
      </div>
    </motion.div>
  );
}
