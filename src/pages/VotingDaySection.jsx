import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { CONTENT } from '../content';

export default function VotingDaySection() {
  const { language } = useContext(AppContext);
  const data = CONTENT[language].votingDay;
  
  return (
    <div className="space-y-4 max-w-xl mx-auto relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-slate-700 before:to-transparent">
      {data.map((step, idx) => (
        <motion.div 
          key={idx} 
          initial={{ opacity: 0, x: idx % 2 === 0 ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-[#E6F1FB] dark:bg-indigo-500/20 text-[#185FA5] dark:text-indigo-400 font-medium text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {idx + 1}
          </div>
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100/80 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="font-medium text-gray-900 dark:text-white text-base mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
