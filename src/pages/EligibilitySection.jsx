import React, { useState, useContext, useEffect } from 'react';
import { HelpCircle, CheckCircle, Info } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS, CONTENT } from '../content';

export default function EligibilitySection() {
  const { language, unlockBadge } = useContext(AppContext);
  const data = CONTENT[language].eligibilitySteps;
  const t = TRANSLATIONS[language];
  const r = CONTENT[language].eligibilityResults;

  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    unlockBadge('First Voter');
  }, [unlockBadge]);

  const handleAnswer = (answerIndex) => {
    if (step === 0) {
      if (answerIndex === 1) setResult({ type: 'error', text: r.under18 });
      else setStep(1);
    } else if (step === 1) {
      if (answerIndex === 1) setResult({ type: 'error', text: r.notCitizen });
      else setStep(2);
    } else if (step === 2) {
      if (answerIndex === 0) setResult({ type: 'success', text: r.success });
      else if (answerIndex === 1) setResult({ type: 'warning', text: r.warning });
      else setResult({ type: 'info', text: r.info });
      setStep(3);
    }
  };

  const reset = () => {
    setStep(0);
    setResult(null);
  };

  if (result) {
    const config = {
      error: { bg: 'bg-[#FCEBEB] dark:bg-red-900/20', text: 'text-[#791F1F] dark:text-red-300', border: 'border-red-100 dark:border-red-900/30', icon: <HelpCircle className="w-6 h-6 text-[#791F1F] dark:text-red-400" /> },
      success: { bg: 'bg-[#EAF3DE] dark:bg-green-900/20', text: 'text-[#27500A] dark:text-green-300', border: 'border-green-100 dark:border-green-900/30', icon: <CheckCircle className="w-6 h-6 text-[#27500A] dark:text-green-400" /> },
      warning: { bg: 'bg-[#FAEEDA] dark:bg-amber-900/20', text: 'text-[#633806] dark:text-amber-300', border: 'border-amber-100 dark:border-amber-900/30', icon: <Info className="w-6 h-6 text-[#633806] dark:text-amber-400" /> },
      info: { bg: 'bg-[#E6F1FB] dark:bg-blue-900/20', text: 'text-[#185FA5] dark:text-blue-300', border: 'border-blue-100 dark:border-blue-900/30', icon: <Info className="w-6 h-6 text-[#185FA5] dark:text-blue-400" /> }
    };
    const c = config[result.type];

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-6 flex flex-col items-center text-center max-w-lg mx-auto">
        <div className={`w-12 h-12 rounded-full ${c.bg} flex items-center justify-center mb-4`}>
          {c.icon}
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{t.eligibilityResult}</h3>
        <div className={`${c.bg} ${c.text} ${c.border} border p-4 rounded-lg text-sm leading-relaxed mb-6 w-full`}>
          {result.text}
        </div>
        <button onClick={reset} className="text-[#185FA5] dark:text-indigo-400 font-medium hover:underline text-sm focus:outline-none">
          {t.startOver}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100/80 dark:border-slate-700 p-6 md:p-8 max-w-lg mx-auto shadow-lg shadow-gray-200/40 dark:shadow-none transition-opacity duration-300">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase">{t.step} {step + 1} {t.of} 3</span>
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-[#185FA5] dark:bg-indigo-500' : 'bg-gray-100 dark:bg-slate-700'}`} />
          ))}
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">{data[step].q}</h3>
      <div className="space-y-3">
        {data[step].options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => handleAnswer(idx)}
            className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-slate-600 hover:border-[#185FA5] dark:hover:border-indigo-500 hover:bg-[#E6F1FB] dark:hover:bg-indigo-500/10 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-colors font-medium text-gray-700 dark:text-gray-300 text-sm focus:outline-none"
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
