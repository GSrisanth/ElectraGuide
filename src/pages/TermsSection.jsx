import React, { useState, useContext, useEffect } from 'react';
import { Search, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS, CONTENT } from '../content';

export default function TermsSection() {
  const { language, unlockBadge } = useContext(AppContext);
  const data = CONTENT[language].glossary;
  const t = TRANSLATIONS[language];
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTerm, setExpandedTerm] = useState(null);

  useEffect(() => {
    // Unlock badge when they visit the terms page (handled here instead of App component now)
    unlockBadge('Constitutional Scholar');
  }, [unlockBadge]);

  const filteredTerms = data.filter(item => 
    item.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          placeholder={t.searchTerms}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#185FA5] focus:border-transparent transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTerms.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {t.noTermsFound}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
          {filteredTerms.map((item, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 2) * 0.1 }}
              className={`relative bg-white dark:bg-slate-800 rounded-2xl border ${expandedTerm === idx ? 'border-[#185FA5]/50 shadow-md ring-1 ring-[#185FA5]/10 z-50' : 'border-gray-100/80 dark:border-slate-700 shadow-sm hover:shadow-md z-10'} ${expandedTerm !== null && expandedTerm !== idx ? 'blur-[1px] opacity-40 grayscale-[0.5] scale-[0.98]' : ''} transition-all duration-300`}
            >
              <button 
                className="w-full text-left p-4 flex items-center justify-between focus:outline-none group"
                onClick={() => setExpandedTerm(expandedTerm === idx ? null : idx)}
              >
                <span className="font-medium text-gray-900 dark:text-white group-hover:text-[#185FA5] dark:group-hover:text-indigo-400 transition-colors pr-2">{item.term}</span>
                {expandedTerm === idx ? <Minus className="w-4 h-4 text-[#185FA5] dark:text-indigo-400 shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#185FA5] dark:group-hover:text-indigo-400 transition-colors shrink-0" />}
              </button>
              
              <AnimatePresence>
                {expandedTerm === idx && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 p-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed z-50"
                  >
                    <div className="absolute -top-2 left-6 w-4 h-4 bg-white dark:bg-slate-800 border-t border-l border-gray-100 dark:border-slate-700 rotate-45"></div>
                    <div className="relative z-10 text-[105%]">
                      {item.definition}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
