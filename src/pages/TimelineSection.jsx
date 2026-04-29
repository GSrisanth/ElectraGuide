import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { CONTENT } from '../content';

export default function TimelineSection() {
  const { language } = useContext(AppContext);
  const data = CONTENT[language].timeline;
  const [expanded, setExpanded] = useState(-1);

  return (
    <div className="space-y-3">
      {data.map((step, idx) => (
        <motion.div 
          key={idx} 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: idx * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100/80 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <button 
            className="w-full text-left p-4 flex items-center justify-between focus:outline-none focus:bg-gray-50 dark:focus:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
            onClick={() => setExpanded(expanded === idx ? -1 : idx)}
            aria-expanded={expanded === idx}
          >
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${expanded === idx ? 'bg-[#185FA5] text-white dark:bg-indigo-500' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400'}`}>
                  {idx + 1}
                </div>
                <h3 className="font-medium text-base text-gray-900 dark:text-white">{step.title}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-9">{step.subtitle}</p>
            </div>
            <ChevronDown className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${expanded === idx ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`transition-all duration-200 ease-in-out ${expanded === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
            <div className="p-4 pt-0 ml-9 pb-5 border-t border-gray-50 dark:border-slate-700/50 mt-2">
              <div className="flex flex-wrap gap-2 mb-3 mt-2">
                {step.tags.map(tag => (
                  <span key={tag} className="bg-[#E6F1FB] dark:bg-indigo-500/10 text-[#185FA5] dark:text-indigo-300 rounded-full text-xs px-3 py-1 font-medium">{tag}</span>
                ))}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{step.detail}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
