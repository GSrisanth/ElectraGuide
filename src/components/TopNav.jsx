import React, { useContext } from 'react';
import { Home, Languages, ChevronDown, Sun, Moon, Award } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS } from '../content';
import { useNavigate, useLocation } from 'react-router-dom';

export default function TopNav() {
  const { language, setLanguage, unlockedBadges, isDarkMode, toggleDarkMode } = useContext(AppContext);
  const t = TRANSLATIONS[language];
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.substring(1) || 'home';

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-gray-200/60 dark:border-slate-700/60 gap-4">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-indigo-500/50"
      >
        <Home className="w-4 h-4" /> {t.home}
      </button>
      <div className="flex flex-col items-center">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white bg-white dark:bg-slate-800 px-5 py-1.5 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm">{t[currentView]}</h2>
        {unlockedBadges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {[...new Set(unlockedBadges)].map(badge => (
              <span key={badge} className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full" title="Unlocked Badge!">
                <Award className="w-3 h-3" /> {badge}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
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
    </div>
  );
}
