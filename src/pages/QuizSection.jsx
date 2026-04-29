import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Award, ArrowRight } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS, CONTENT } from '../content';

export default function QuizSection() {
  const { language, unlockBadge } = useContext(AppContext);
  const data = CONTENT[language].quiz;
  const t = TRANSLATIONS[language];
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (finished && score === data.length) {
      unlockBadge('Quiz Master');
    }
  }, [finished, score, unlockBadge, data.length]);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === data[currentQ].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < data.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 p-8 text-center shadow-lg shadow-gray-200/40 dark:shadow-none"
      >
        <div className="w-20 h-20 bg-[#E6F1FB] dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Award className="w-10 h-10 text-[#185FA5] dark:text-indigo-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t.quizComplete}</h3>
        <div className="text-4xl font-bold text-[#185FA5] dark:text-indigo-400 mb-6">
          {score} <span className="text-xl text-gray-400 dark:text-gray-500">/ {data.length}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          {score === data.length ? t.perfectScore : 
           score >= data.length / 2 ? t.greatJob : 
           t.keepLearning}
        </p>
        <button 
          onClick={resetQuiz}
          className="px-8 py-3 bg-[#185FA5] hover:bg-[#124b85] dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-indigo-900"
        >
          {t.retakeQuiz}
        </button>
      </motion.div>
    );
  }

  const q = data[currentQ];
  const progress = ((currentQ) / data.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100/80 dark:border-slate-700 p-6 md:p-8 max-w-lg mx-auto shadow-lg shadow-gray-200/40 dark:shadow-none">
      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">
          <span>{t.questionOf?.replace('{current}', currentQ + 1).replace('{total}', data.length) || `Question ${currentQ + 1} of ${data.length}`}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full bg-[#185FA5] dark:bg-indigo-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-5 leading-snug">{q.q}</h3>
      
      <div className="space-y-3 mb-6">
        {q.options.map((opt, idx) => {
          let btnClass = "border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700";
          let icon = null;
          
          if (selected !== null) {
            if (idx === q.answer) {
              btnClass = "border-[#27500A] dark:border-green-800 bg-[#EAF3DE] dark:bg-green-900/20 text-[#27500A] dark:text-green-400";
              icon = <CheckCircle className="w-5 h-5 text-[#27500A] dark:text-green-400" />;
            } else if (idx === selected) {
              btnClass = "border-[#791F1F] dark:border-red-800 bg-[#FCEBEB] dark:bg-red-900/20 text-[#791F1F] dark:text-red-400";
            } else {
              btnClass = "border-gray-100 dark:border-slate-700 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 opacity-50";
            }
          }

          return (
            <button
              key={idx}
              disabled={selected !== null}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border flex justify-between items-center transition-all text-sm focus:outline-none ${btnClass}`}
            >
              <span className="font-medium">{opt}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="animate-fade-in">
          <div className="bg-[#E6F1FB] dark:bg-indigo-900/20 text-[#185FA5] dark:text-indigo-300 p-4 rounded-lg text-sm leading-relaxed mb-4 border border-blue-100 dark:border-indigo-900/30">
            <span className="font-medium block mb-1">Explanation:</span>
            {q.explanation}
          </div>
          <button 
            onClick={handleNext} 
            className="w-full bg-[#185FA5] dark:bg-indigo-600 text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 dark:hover:bg-indigo-500 transition-colors focus:outline-none flex justify-center items-center gap-2"
          >
            {currentQ < data.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
