import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS, CONTENT } from '../content';

export default function EVMSimulator() {
  const { language } = useContext(AppContext);
  const data = CONTENT[language].leaders;
  const t = TRANSLATIONS[language];
  const [votedFor, setVotedFor] = useState(null);
  
  const handleVote = (leaderName) => {
    if (votedFor) return;
    setVotedFor(leaderName);
    
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); 
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1.5);
    } catch(e) {
      console.log('Audio not supported or blocked');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-200 dark:bg-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-gray-300 dark:border-slate-700">
      <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-slate-700 shadow-inner">
        <div className="bg-gray-100 dark:bg-slate-800 p-4 border-b-2 border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <div className="font-bold text-gray-800 dark:text-gray-200 tracking-widest text-lg">{t.evmHeader}</div>
          <div className="text-xs font-mono bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">{t.evmReady}</div>
        </div>
        
        <div className="p-4 space-y-3">
          {data.map((leader, idx) => (
            <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-500 bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 shrink-0">
                {idx + 1}
              </div>
              <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-md p-1 border border-gray-200 dark:border-slate-600 shrink-0 overflow-hidden flex items-center justify-center">
                <img src={leader.logo} alt={leader.party} className="w-full h-full object-contain" />
              </div>
              <div className="flex-1 font-bold text-gray-800 dark:text-gray-100 text-lg uppercase tracking-wide truncate">
                {leader.name}
              </div>
              <div className="flex items-center gap-4 shrink-0 pl-2">
                <div className={`w-4 h-4 rounded-full border border-red-900 ${votedFor === leader.name ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-red-900/30'} transition-all duration-300`}></div>
                <button 
                  onClick={() => handleVote(leader.name)}
                  disabled={votedFor !== null}
                  className="w-16 h-10 bg-blue-600 rounded-md shadow-[0_4px_0_#1e3a8a] active:shadow-[0_0_0_#1e3a8a] active:translate-y-1 hover:bg-blue-500 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-80 disabled:active:shadow-[0_4px_0_#1e3a8a] disabled:active:translate-y-0"
                ></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {votedFor && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-200 dark:border-green-800/30"
        >
          {t.voteSuccess}
        </motion.div>
      )}
    </div>
  );
}
