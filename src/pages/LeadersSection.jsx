import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { CONTENT } from '../content';

export default function LeadersSection() {
  const { language } = useContext(AppContext);
  const data = CONTENT[language].leaders;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {data.map((leader, idx) => (
        <motion.div 
          key={idx} 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
          <div className={`h-24 ${leader.imgColor} w-full relative`}>
            <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md">
              <div className="w-full h-full bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={leader.logo} 
                  alt={`${leader.party} logo`} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `<div class="text-xs font-bold text-gray-400">${leader.party.substring(0, 3)}</div>`;
                  }}
                />
              </div>
            </div>
          </div>
          <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{leader.name}</h3>
            <div className="text-sm font-medium text-[#185FA5] dark:text-indigo-400 mb-1">{leader.party}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">{leader.role}</div>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mt-auto">{leader.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
