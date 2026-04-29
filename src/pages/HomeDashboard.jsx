import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, CheckSquare, Calendar, Brain, Users, Vote, BarChart2, CheckCircle, Languages, ChevronDown, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS } from '../content';

export default function HomeDashboard() {
  const { language, setLanguage, isDarkMode, toggleDarkMode } = useContext(AppContext);
  const t = TRANSLATIONS[language];
  const navigate = useNavigate();

  const cards = [
    { id: 'timeline', title: t.timeline, desc: 'Step-by-step election process', icon: <Clock className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { id: 'terms', title: t.terms, desc: 'Glossary of election jargon', icon: <BookOpen className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { id: 'eligibility', title: t.eligibility, desc: 'Check if you can vote', icon: <CheckSquare className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { id: 'votingday', title: t.votingday, desc: 'What happens at the booth', icon: <Calendar className="w-6 h-6" />, color: 'from-purple-500 to-fuchsia-600', shadow: 'shadow-purple-500/20' },
    { id: 'quiz', title: t.quiz, desc: 'Test your election knowledge', icon: <Brain className="w-6 h-6" />, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
    { id: 'leaders', title: t.leaders, desc: 'Profiles of prominent candidates', icon: <Users className="w-6 h-6" />, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' },
    { id: 'evm', title: t.evm, desc: 'Practice using a voting machine', icon: <Vote className="w-6 h-6" />, color: 'from-sky-500 to-blue-600', shadow: 'shadow-sky-500/20' },
    { id: 'polls', title: t.polls, desc: 'Live mock election data', icon: <BarChart2 className="w-6 h-6" />, color: 'from-fuchsia-500 to-pink-600', shadow: 'shadow-fuchsia-500/20' }
  ];

  return (
    <div className="w-full relative">
      <div className="absolute top-0 right-0 flex gap-2">
        <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all">
          <Languages className="w-4 h-4 ml-3 text-gray-500 dark:text-gray-400" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="appearance-none bg-transparent border-none py-1.5 pl-2 pr-8 text-sm font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-0 cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-all hover:shadow-md"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center space-y-4 pt-10 sm:pt-0"
      >
        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-blue-900/5 dark:shadow-none mb-2 ring-1 ring-black/5 dark:ring-white/5">
          <div className="bg-gradient-to-tr from-[#185FA5] to-indigo-400 dark:from-indigo-500 dark:to-purple-500 text-white p-3 rounded-xl">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Electra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#185FA5] to-indigo-500 dark:from-indigo-400 dark:to-purple-400">Guide</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">Your ultimate companion to understanding Indian elections, clear and simple.</p>
      </motion.div>

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto"
      >
        {cards.map(card => (
          <motion.button
            key={card.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, translateY: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/${card.id}`)}
            className={`group text-left bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 transition-all duration-300 hover:shadow-xl ${card.shadow} dark:hover:shadow-indigo-500/10 relative overflow-hidden backdrop-blur-sm`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 text-gray-900 dark:text-white">
              {React.cloneElement(card.icon, { className: 'w-24 h-24' })}
            </div>
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#185FA5] dark:group-hover:text-indigo-400 transition-colors">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
