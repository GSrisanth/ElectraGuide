import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageCircle, X, Maximize2, Minimize2, Mic, Send, HelpCircle, Volume2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { TRANSLATIONS, CONTENT } from '../content';

export default function FloatingChat() {
  const { language } = useContext(AppContext);
  const t = TRANSLATIONS[language];
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('electraGuide_chat');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const lastSpokenRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('electraGuide_chat', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? " " : "") + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        setError("Speech recognition not supported in this browser.");
      }
    }
  };

  const speakText = (text) => {
    if (!voiceEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
    if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const starters = CONTENT[language].starters;

  useEffect(() => {
    if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
      if (messages[0]?.content !== t.howMayIHelp) {
        setMessages([{ role: 'assistant', content: t.howMayIHelp }]);
      }
    }
  }, [language, t.howMayIHelp]);

  useEffect(() => {
    if (isOpen && voiceEnabled && messages.length === 1 && messages[0].role === 'assistant') {
      if (lastSpokenRef.current !== messages[0].content) {
        speakText(messages[0].content);
        lastSpokenRef.current = messages[0].content;
      }
    }
  }, [isOpen, voiceEnabled, messages]);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const newMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const sysMsg = { role: 'system', content: `You are an election assistant. Please respond to the user in ${language === 'hi' ? 'Hindi' : language === 'te' ? 'Telugu' : 'English'}.` };
      const apiMessages = [sysMsg, ...messages, newMsg].map(m => ({ role: m.role, content: m.content }));
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      const aiResponse = data.content[0].text;
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      speakText(aiResponse);
    } catch (err) {
      console.error(err);
      setError("Failed to reach the AI backend. Please ensure the server is running and VITE_API_URL is correct.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setError("Please type a question first.");
      return;
    }
    sendMessage(input);
  };

  const formatText = (text) => {
    return text.split('\n').map((line, i) => {
      if (!line) return <br key={i} />;
      const boldFormatted = line.split(/(\*\*.*?\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
      return <span key={i} className="block mb-2">{boldFormatted}</span>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-100/80 dark:border-slate-700 flex flex-col shadow-2xl overflow-hidden mb-4 transition-all duration-300 ${
              isMaximized 
                ? 'fixed inset-4 sm:inset-10 z-50 bottom-24' 
                : 'h-[500px] w-[350px] sm:w-[400px]'
            }`}
          >
            <div className="p-4 border-b border-gray-100/80 dark:border-slate-700 flex justify-between items-center bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#185FA5] dark:text-indigo-400" />
                Ask AI
              </h3>
              <div className="flex items-center gap-3">
                <button onClick={() => setVoiceEnabled(!voiceEnabled)} className={`text-xs ${voiceEnabled ? 'text-[#185FA5] dark:text-indigo-400' : 'text-gray-400'} flex items-center transition-colors`} title={voiceEnabled ? "Voice Output ON" : "Voice Output OFF"}>
                  <Volume2 className="w-4 h-4" />
                </button>
                {messages.length > 0 && (
                  <button onClick={() => setMessages([])} className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center transition-colors" title="Clear chat">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button onClick={() => setIsMaximized(!isMaximized)} className="text-gray-400 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-colors" title={isMaximized ? "Minimize" : "Maximize"}>
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-1" title="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? null : (
                <>
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl p-3 text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#185FA5] dark:bg-indigo-600 text-white rounded-tr-sm' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
                      }`}>
                        {msg.role === 'assistant' ? formatText(msg.content) : msg.content}
                      </div>
                    </div>
                  ))}
                  
                  {messages.length === 1 && messages[0].role === 'assistant' && (
                    <div className="flex flex-col gap-2 w-full max-w-[250px] mt-2 ml-2 animate-fade-in">
                      {starters.map((starter, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => sendMessage(starter)}
                          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-xl hover:bg-[#E6F1FB] dark:hover:bg-slate-700 hover:border-[#185FA5] dark:hover:border-indigo-500 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-colors text-left shadow-sm"
                        >
                          {starter}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl rounded-tl-sm p-3 flex gap-1 items-center h-8 w-14">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 border-t border-gray-100 dark:border-slate-700">
              {error && <div className="text-xs text-red-500 dark:text-red-400 mb-2 ml-1">{error}</div>}
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setError(null); }}
                  placeholder={isListening ? "Listening..." : "Type your question..."}
                  disabled={loading}
                  className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-full py-2.5 pl-4 pr-[4.5rem] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#185FA5] dark:focus:border-indigo-500 focus:ring-1 focus:ring-[#185FA5] dark:focus:ring-indigo-500 disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-500"
                />
                <div className="absolute right-1.5 top-1.5 bottom-1.5 flex gap-1">
                  <button 
                    type="button"
                    onClick={toggleListen}
                    title="Speak"
                    className={`w-7 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200/50 dark:bg-slate-600/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`}
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading || !input.trim()}
                    className="w-7 rounded-full bg-[#185FA5] dark:bg-indigo-600 text-white flex items-center justify-center hover:bg-blue-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-[#185FA5] dark:disabled:hover:bg-indigo-600 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-[#185FA5] to-indigo-500 dark:from-indigo-600 dark:to-purple-600 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#185FA5] dark:focus:ring-offset-slate-900"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
