import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Loader2,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';

import { submitAssessment } from '../services/api';
import { useTranslation } from 'react-i18next';

export default function AssessmentPage() {
  const { t, i18n } = useTranslation();
  const isMarathi = i18n.language === 'mr';

  // Expanded multilingual question set with categories (20+ items)
  const MOCK_QUESTIONS = [
    { id: 1, type: 'orientation', question: t('assessment.q_1'), options: ['2022','2023','2025','2026'].map(v=>({value:v,label:v})), correct: '2026' },
    { id: 2, type: 'memory_display', question: t('assessment.q_2'), isDisplay: true, memorize: ['Apple','Table','Coin'] },
    { id: 3, type: 'pattern', question: t('assessment.q_3'), options: [{value:'circle',label:'◯'},{value:'triangle',label:'△'},{value:'square',label:'□'},{value:'star',label:'☆'}], correct: 'circle' },
    { id: 4, type: 'memory_recall', question: t('assessment.q_4'), options: [{value:'correct',label:t('assessment.ans_recall')},{value:'wrong1',label:t('assessment.recall_wrong1')},{value:'wrong2',label:t('assessment.recall_wrong2')},{value:'wrong3',label:t('assessment.recall_wrong3')}], correct: 'correct' },
    { id: 5, type: 'attention', question: t('assessment.q_5'), options: [{value:'red',label:'Red'},{value:'blue',label:'Blue'},{value:'green',label:'Green'},{value:'yellow',label:'Yellow'}], correct: 'green' },
    { id: 6, type: 'orientation', question: t('assessment.q_6'), options: [{value:'monday',label:t('assessment.days.monday')},{value:'tuesday',label:t('assessment.days.tuesday')},{value:'wednesday',label:t('assessment.days.wednesday')},{value:'thursday',label:t('assessment.days.thursday')}], correct: 'monday' },
    { id: 7, type: 'pattern', question: t('assessment.q_7'), options: [{value:'A',label:'A'},{value:'B',label:'B'},{value:'C',label:'C'},{value:'D',label:'D'}], correct: 'B' },
    { id: 8, type: 'memory_display', question: t('assessment.q_8'), isDisplay: true, memorize: ['Banana','Chair','Clock'] },
    { id: 9, type: 'memory_recall', question: t('assessment.q_9'), options: [{value:'correct',label:t('assessment.ans_recall2')},{value:'wrong1',label:'X'},{value:'wrong2',label:'Y'},{value:'wrong3',label:'Z'}], correct: 'correct' },
    { id:10, type: 'attention', question: t('assessment.q_10'), options: [{value:'5',label:'5'},{value:'3',label:'3'},{value:'7',label:'7'},{value:'9',label:'9'}], correct: '7' },
    { id:11, type: 'orientation', question: t('assessment.q_11'), options: [{value:'city',label:t('assessment.places.city')},{value:'village',label:t('assessment.places.village')},{value:'town',label:t('assessment.places.town')},{value:'suburb',label:t('assessment.places.suburb')}], correct: 'city' },
    { id:12, type: 'pattern', question: t('assessment.q_12'), options: [{value:'1',label:'1'},{value:'2',label:'2'},{value:'3',label:'3'},{value:'4',label:'4'}], correct: '3' },
    { id:13, type: 'memory_display', question: t('assessment.q_13'), isDisplay: true, memorize: ['Dog','Pen','Bottle'] },
    { id:14, type: 'memory_recall', question: t('assessment.q_14'), options: [{value:'correct',label:t('assessment.ans_recall3')},{value:'wrong1',label:'A'},{value:'wrong2',label:'B'},{value:'wrong3',label:'C'}], correct: 'correct' },
    { id:15, type: 'attention', question: t('assessment.q_15'), options: [{value:'left',label:t('assessment.dirs.left')},{value:'right',label:t('assessment.dirs.right')},{value:'up',label:t('assessment.dirs.up')},{value:'down',label:t('assessment.dirs.down')}], correct: 'right' },
    { id:16, type: 'orientation', question: t('assessment.q_16'), options: [{value:'am',label:'AM'},{value:'pm',label:'PM'},{value:'both',label:'Both'},{value:'none',label:'None'}], correct: 'am' },
    { id:17, type: 'pattern', question: t('assessment.q_17'), options: [{value:'X',label:'X'},{value:'Y',label:'Y'},{value:'Z',label:'Z'},{value:'W',label:'W'}], correct: 'Z' },
    { id:18, type: 'memory_display', question: t('assessment.q_18'), isDisplay: true, memorize: ['Sun','Book','Key'] },
    { id:19, type: 'memory_recall', question: t('assessment.q_19'), options: [{value:'correct',label:t('assessment.ans_recall4')},{value:'wrong1',label:'1'},{value:'wrong2',label:'2'},{value:'wrong3',label:'3'}], correct: 'correct' },
    { id:20, type: 'attention', question: t('assessment.q_20'), options: [{value:'A',label:'A'},{value:'B',label:'B'},{value:'C',label:'C'},{value:'D',label:'D'}], correct: 'D' },
  ];

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [durations, setDurations] = useState({});
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionStart, setQuestionStart] = useState(Date.now());

  const handleSelectOption = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const recordDuration = (questionId) => {
    const now = Date.now();
    const dur = Math.max(0, now - questionStart);
    setDurations((prev) => ({ ...prev, [questionId]: dur }));
    setQuestionStart(now);
  };

  const handleNext = async () => {
    // record time spent on the current question
    recordDuration(currentQ.id);

    if (step < MOCK_QUESTIONS.length - 1) {
      setStep(step + 1);
      return;
    }

    setLoading(true);

    try {
      // Category-based scoring
      const categoryCounts = {};
      const categoryCorrect = {};

      MOCK_QUESTIONS.forEach((q) => {
        const cat = q.type.includes('memory') ? 'memory' : q.type;
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        const ans = answers[q.id];
        const isCorrect = q.correct ? ans === q.correct : false;
        if (isCorrect) categoryCorrect[cat] = (categoryCorrect[cat] || 0) + 1;
      });

      const categoryScores = {};
      ['memory', 'attention', 'orientation', 'pattern'].forEach((cat) => {
        const cnt = categoryCounts[cat] || 0;
        const cor = categoryCorrect[cat] || 0;
        categoryScores[cat] = cnt ? Math.round((cor / cnt) * 100) : null;
      });

      const memory_score = categoryScores.memory ?? 70;
      const attention_score = categoryScores.attention ?? 70;
      const orientation_score = categoryScores.orientation ?? 70;

      const payload = {
        memory_score,
        attention_score,
        orientation_score,
        meta: {
          durations,
          categoryScores,
        },
      };

      const data = await submitAssessment(payload);
      setResult({ ...data, categoryScores });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setIsComplete(true);
    }
  };

  const currentQ = MOCK_QUESTIONS[step];

  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center items-center min-h-[85vh]">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-12 max-w-3xl w-full text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Brain size={250} className="text-[#00F0FF]" />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <CheckCircle2 className="w-24 h-24 text-[#00F0FF] mx-auto mb-8 shadow-[0_0_30px_rgba(0,240,255,0.3)]" />

            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
              {t('assessment.complete_title')}
            </h2>

            <p className="text-white/70 mb-10 text-xl font-medium max-w-xl mx-auto leading-relaxed">
              {t('assessment.complete_desc')}
            </p>
          </motion.div>

          <div className="bg-white/5 border border-white/20 rounded-2xl p-8 mb-10 text-left backdrop-blur-md shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <span className="text-white/60 text-lg font-bold uppercase tracking-wider">
                {t('assessment.risk_indicator')}
              </span>

              <span
                className={`text-2xl font-bold pulse-glow ${
                  result?.risk_level === 'HIGH'
                    ? 'text-red-400'
                    : result?.risk_level === 'MODERATE'
                    ? 'text-orange-400'
                    : 'text-[#00F0FF]'
                }`}
              >
                {result
                  ? t(`dashboard.${result.risk_level.toLowerCase()}`)
                  : t('dashboard.low')}
              </span>
            </div>

            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width:
                    result?.risk_level === 'HIGH'
                      ? '90%'
                      : result?.risk_level === 'MODERATE'
                      ? '55%'
                      : '20%',
                }}
                transition={{ duration: 2, ease: 'easeOut' }}
                className={`h-full ${
                  result?.risk_level === 'HIGH'
                    ? 'bg-red-500'
                    : result?.risk_level === 'MODERATE'
                    ? 'bg-orange-500'
                    : 'bg-gradient-to-r from-[#00F0FF] to-[#7000FF]'
                }`}
              />
            </div>

            {result && (
              <div className="flex flex-col gap-3 text-sm font-bold text-white/40">
                <div>Score: {result.overall_score ? result.overall_score.toFixed(1) : '—'}/100</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>Memory: {result.categoryScores?.memory ?? '—'}%</div>
                  <div>Attention: {result.categoryScores?.attention ?? '—'}%</div>
                  <div>Orientation: {result.categoryScores?.orientation ?? '—'}%</div>
                </div>
                <div>
                  Neural ID: #AZ-{Math.floor(Math.random() * 10000)}
                </div>
              </div>
            )}
          </div>

          <button className="px-10 py-5 bg-white text-black font-bold text-xl rounded-2xl shadow-xl hover:shadow-[#00F0FF]/25 hover:bg-[#00F0FF] transition-all w-full flex items-center justify-center gap-2">
            {t('assessment.view_dash')}
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center">

      {/* Progress Tracker */}
      <div className="w-full max-w-4xl mb-16">
        <div className="flex justify-between text-lg text-white/70 mb-4 font-bold tracking-tight">
          <span className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-[#00F0FF]" />

            {t('assessment.step', {
              current: step + 1,
              total: MOCK_QUESTIONS.length,
            })}
          </span>

          <span className="text-[#00F0FF]">
            {Math.round(
              ((step + 1) / MOCK_QUESTIONS.length) * 100
            )}
            % {t('assessment.completed')}
          </span>
        </div>

        <div className="w-full h-2.5 bg-white/5 rounded-full p-0.5 border border-white/10 overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#00F0FF] to-[#7000FF] rounded-full shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            initial={{
              width: `${(step / MOCK_QUESTIONS.length) * 100}%`,
            }}
            animate={{
              width: `${
                ((step + 1) / MOCK_QUESTIONS.length) * 100
              }%`,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>
      </div>

      <div className="flex w-full max-w-6xl gap-12 relative items-start">

        {/* Main Question Card */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${i18n.language}`}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -30, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="glass-card p-12 min-h-[500px] flex flex-col relative shadow-2xl border-white/20"
            >
              <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                <Brain size={180} />
              </div>

              <div className="mb-12 flex items-start gap-4">
                <HelpCircle className="w-10 h-10 text-[#00F0FF] shrink-0 mt-1" />

                <h2
                  className={`font-heading font-bold text-white leading-tight ${
                    isMarathi ? 'text-4xl' : 'text-3xl'
                  }`}
                >
                  {currentQ.question}
                </h2>
              </div>

              {!currentQ.isDisplay && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected =
                      answers[currentQ.id] === opt.value;

                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          handleSelectOption(
                            currentQ.id,
                            opt.value
                          )
                        }
                        className={`p-6 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                          isSelected
                            ? 'border-[#00F0FF] bg-[#00F0FF]/15 text-white shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                            : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'
                        }`}
                      >
                        <span className="relative z-10 text-xl font-bold">
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {currentQ.isDisplay && (
                <div className="mt-6 h-48 flex items-center justify-center border-2 border-dashed border-[#00F0FF]/30 rounded-3xl bg-[#00F0FF]/5 relative overflow-hidden">
                  <span className="text-white/50 text-2xl font-bold italic">
                    {t('assessment.memorize_task')}
                  </span>
                </div>
              )}

              <div className="mt-auto flex justify-end pt-10 border-t border-white/10">
                <button
                  onClick={handleNext}
                  disabled={
                    (!currentQ.isDisplay &&
                      !answers[currentQ.id]) ||
                    loading
                  }
                  className="px-12 py-5 bg-[#0B0F19] border-2 border-[#00F0FF] text-[#00F0FF] font-bold text-xl rounded-2xl flex items-center gap-3 hover:bg-[#00F0FF] hover:text-black transition-all disabled:opacity-30"
                >
                  {loading && (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  )}

                  <span>
                    {step === MOCK_QUESTIONS.length - 1
                      ? loading
                        ? t('assessment.analyzing')
                        : t('assessment.analyze')
                      : t('assessment.next')}
                  </span>

                  {!loading && (
                    <ChevronRight className="w-6 h-6" />
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}