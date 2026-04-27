import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, Minus, CheckCircle, Info, HelpCircle, Send, Trash2, ArrowRight, MessageCircle, Home, Clock, BookOpen, CheckSquare, Calendar, Brain, Sun, Moon } from 'lucide-react';

const ELECTION_TIMELINE = [
  {
    title: 'Election Announced',
    subtitle: 'Months before election day',
    tags: ['Election Commission', 'Model Code of Conduct'],
    detail: 'The Election Commission officially announces the election date. The Model Code of Conduct comes into force immediately, restricting what the ruling government can promise or spend. A formal notification calls candidates to file nominations.'
  },
  {
    title: 'Candidate Nominations',
    subtitle: '~2–4 weeks before election',
    tags: ['Filing papers', 'Scrutiny', 'Withdrawal'],
    detail: 'Candidates file nomination papers with a security deposit at the returning officer\'s office. Papers are checked for eligibility (age, citizenship, criminal history). Ineligible candidates are disqualified. Others may voluntarily withdraw before the deadline.'
  },
  {
    title: 'Campaign Period',
    subtitle: 'Weeks of rallies, ads, and debates',
    tags: ['Rallies', 'Manifestos', 'Spending limits'],
    detail: 'Parties and candidates campaign — holding rallies, releasing manifestos, running advertisements. All spending must stay within Election Commission limits. Campaigning stops 48 hours before polling day (the "silence period").'
  },
  {
    title: 'Voting Day (Polling)',
    subtitle: 'Election day — you cast your vote',
    tags: ['Voter ID', 'EVM', 'VVPAT'],
    detail: 'Registered voters go to their assigned polling booth, verify identity, and press a button on the EVM (Electronic Voting Machine) to cast their vote. A VVPAT slip confirms their choice visually for 7 seconds.'
  },
  {
    title: 'Vote Counting and Results',
    subtitle: 'Usually 1–2 days after polling',
    tags: ['Counting centers', 'Majority', 'Declaration'],
    detail: 'EVMs are transported under guard to counting centers. Votes are counted in rounds with party agents observing. The candidate with the most votes wins (first-past-the-post). Results are officially declared by the returning officer.'
  },
  {
    title: 'Government Formation',
    subtitle: 'After results — new government sworn in',
    tags: ['Majority', 'Coalition', 'Oath of office'],
    detail: 'The party or coalition with a majority of seats is invited to form the government. The leader is sworn in as Prime Minister or Chief Minister. If no single party wins majority, coalition negotiations take place before government is formed.'
  }
];

const GLOSSARY_TERMS = [
  { term: 'Constituency', definition: 'A geographic area whose residents elect one representative to parliament or assembly. India has 543 Lok Sabha constituencies.' },
  { term: 'Electoral Roll', definition: 'The official list of all registered voters in a constituency. You must be on this list to vote. Also called the voter list.' },
  { term: 'EVM', definition: 'Electronic Voting Machine — the tamper-resistant, battery-operated device used to cast votes in Indian elections.' },
  { term: 'VVPAT', definition: 'Voter Verifiable Paper Audit Trail — prints a paper slip showing your vote for 7 seconds so you can verify it before it\'s stored.' },
  { term: 'Manifesto', definition: 'A document published by a political party outlining their plans and promises if they are elected to power.' },
  { term: 'Model Code of Conduct', definition: 'Rules governing behaviour of political parties and candidates from election announcement until results are declared.' },
  { term: 'Returning Officer', definition: 'A government official responsible for overseeing the election in a constituency — accepting nominations, supervising polling, declaring results.' },
  { term: 'First-past-the-post', definition: 'The voting system where the candidate who gets the most votes in a constituency wins — even without a majority.' },
  { term: 'Polling Booth', definition: 'The physical location where voters in a specific area go to cast their vote on election day.' },
  { term: 'Security Deposit', definition: 'Money a candidate must pay when filing nomination. Forfeited if they receive less than 1/6th of total votes cast.' },
  { term: 'Affidavit', definition: 'A sworn legal declaration candidates must submit disclosing criminal records, assets, and liabilities.' },
  { term: 'Delimitation', definition: 'The process of redrawing constituency boundaries, usually after a census.' }
];

const VOTING_DAY_STEPS = [
  { title: 'Check your polling booth', desc: 'Find your assigned booth before election day using your Voter ID number on voters.eci.gov.in. Booths open at 7:00 AM.' },
  { title: 'Bring valid ID', desc: 'Carry your Voter ID card (EPIC). If unavailable, you can use Aadhaar, passport, driving licence, PAN card, MNREGA job card, bank passbook with photo, or pension document.' },
  { title: 'Join the queue', desc: 'At the booth, join the line. There are separate queues for men and women in most booths. Senior citizens and differently-abled voters get priority assistance.' },
  { title: 'Identity verification', desc: 'A polling officer checks your name against the electoral roll and verifies your ID. Your finger is marked with indelible ink on the left index finger to prevent double voting.' },
  { title: 'Enter the voting compartment', desc: 'You go behind a privacy screen. The EVM is in front of you, showing candidate names, party symbols, and serial numbers.' },
  { title: 'Cast your vote', desc: 'Press the blue button next to your chosen candidate. A beep confirms the vote. The VVPAT machine prints a paper slip showing your choice for 7 seconds, then drops it into a sealed box.' },
  { title: 'Exit and keep your ink mark', desc: 'The ink mark stays for several days. It\'s your proof of participation and prevents fraud. You\'re done — you\'ve voted!' }
];

const QUIZ_QUESTIONS = [
  { q: 'What does EVM stand for?', options: ['Election Verification Monitor', 'Electronic Voting Machine', 'Electoral Vote Manager', 'Emergency Voting Mechanism'], answer: 1, explanation: 'EVM stands for Electronic Voting Machine, which is a secure, standalone device used for voting.' },
  { q: 'How many Lok Sabha constituencies does India have?', options: ['250', '400', '543', '650'], answer: 2, explanation: 'India has 543 elected constituencies in the Lok Sabha (Lower House of Parliament).' },
  { q: 'What is the "silence period" before elections?', options: ['A day of national mourning', '48 hours before polling when campaigning must stop', 'The period when election results are kept secret', 'The time EVMs are sealed and stored'], answer: 1, explanation: 'The silence period is a 48-hour ban on political campaigning before polling day to allow voters to think calmly.' },
  { q: 'Which system does India use to determine election winners?', options: ['Proportional representation', 'Ranked-choice voting', 'First-past-the-post', 'Two-round runoff'], answer: 2, explanation: 'India uses the "first-past-the-post" system, where the candidate with the highest number of votes wins.' },
  { q: 'What document must candidates submit disclosing criminal records and assets?', options: ['Manifesto', 'Security deposit form', 'Affidavit', 'Nomination certificate'], answer: 2, explanation: 'An affidavit is a sworn legal document where candidates disclose their assets, liabilities, and any criminal history.' },
  { q: 'When does the Model Code of Conduct come into force?', options: ['On voting day', 'When results are announced', 'When elections are announced', 'When nominations close'], answer: 2, explanation: 'The MCC comes into force immediately upon the announcement of the election schedule by the Election Commission.' },
  { q: 'What does VVPAT do?', options: ['Counts all votes automatically', 'Prints a paper slip showing your vote for 7 seconds', 'Verifies your voter ID before you vote', 'Transmits results to the Election Commission'], answer: 1, explanation: 'VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing your vote for 7 seconds for verification.' },
  { q: 'Which finger is marked with indelible ink after voting?', options: ['Right index finger', 'Left thumb', 'Left index finger', 'Right thumb'], answer: 2, explanation: 'The left index finger is marked with indelible ink to prevent duplicate voting.' }
];

function TimelineSection() {
  const [expanded, setExpanded] = useState(0);

  return (
    <div className="space-y-3">
      {ELECTION_TIMELINE.map((step, idx) => (
        <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100/80 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
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
        </div>
      ))}
    </div>
  );
}

function TermsSection() {
  const [expandedTerm, setExpandedTerm] = useState(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {GLOSSARY_TERMS.map((item, idx) => (
        <div key={idx} className={`bg-white dark:bg-slate-800 rounded-2xl border ${expandedTerm === idx ? 'border-[#185FA5]/50 shadow-md ring-1 ring-[#185FA5]/10' : 'border-gray-100/80 dark:border-slate-700 shadow-sm hover:shadow-md'} overflow-hidden transition-all duration-300`}>
          <button 
            className="w-full text-left p-4 flex items-start justify-between focus:outline-none"
            onClick={() => setExpandedTerm(expandedTerm === idx ? null : idx)}
            aria-expanded={expandedTerm === idx}
          >
            <span className="font-medium text-gray-900 dark:text-white pr-2">{item.term}</span>
            {expandedTerm === idx ? <Minus className="w-4 h-4 text-[#185FA5] dark:text-indigo-400 mt-1 shrink-0" /> : <Plus className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-1 shrink-0" />}
          </button>
          <div className={`transition-all duration-200 overflow-hidden ${expandedTerm === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-4 pt-0 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-50 dark:border-slate-700/50 mt-2">
              {item.definition}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EligibilitySection() {
  const [step, setStep] = useState(0);
  const [result, setResult] = useState(null);

  const handleAnswer = (answerIndex) => {
    if (step === 0) {
      if (answerIndex === 1) setResult({ type: 'error', text: 'You must be at least 18 years old on the qualifying date to register and vote.' });
      else setStep(1);
    } else if (step === 1) {
      if (answerIndex === 1) setResult({ type: 'error', text: 'Only Indian citizens are eligible to vote in Indian elections.' });
      else setStep(2);
    } else if (step === 2) {
      if (answerIndex === 0) setResult({ type: 'success', text: 'You are eligible to vote! Find your polling booth on the Election Commission website (voters.eci.gov.in) using your Voter ID or name.' });
      else if (answerIndex === 1) setResult({ type: 'warning', text: 'You need to register before you can vote. Apply online at voters.eci.gov.in using Form 6. You\'ll need: proof of age, proof of address, and a passport photo.' });
      else setResult({ type: 'info', text: 'Check if you\'re registered at voters.eci.gov.in by searching your name. If not found, you can register online using Form 6.' });
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
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Eligibility Result</h3>
        <div className={`${c.bg} ${c.text} ${c.border} border p-4 rounded-lg text-sm leading-relaxed mb-6 w-full`}>
          {result.text}
        </div>
        <button onClick={reset} className="text-[#185FA5] dark:text-indigo-400 font-medium hover:underline text-sm focus:outline-none">
          Start over
        </button>
      </div>
    );
  }

  const steps = [
    { q: 'How old are you?', options: ['18 or older', 'Under 18'] },
    { q: 'Are you a citizen of India?', options: ['Yes, Indian citizen', 'No'] },
    { q: 'Are you currently registered on the electoral roll?', options: ['Yes, I\'m registered', 'No, not yet', 'I\'m not sure'] }
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100/80 dark:border-slate-700 p-6 md:p-8 max-w-lg mx-auto shadow-lg shadow-gray-200/40 dark:shadow-none transition-opacity duration-300">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-medium text-gray-400 dark:text-gray-500 tracking-wider uppercase">Step {step + 1} of 3</span>
        <div className="flex gap-1">
          {[0,1,2].map(i => (
            <div key={i} className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-[#185FA5] dark:bg-indigo-500' : 'bg-gray-100 dark:bg-slate-700'}`} />
          ))}
        </div>
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-6">{steps[step].q}</h3>
      <div className="space-y-3">
        {steps[step].options.map((opt, idx) => (
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

function VotingDaySection() {
  return (
    <div className="space-y-4 max-w-xl mx-auto relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 dark:before:via-slate-700 before:to-transparent">
      {VOTING_DAY_STEPS.map((step, idx) => (
        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-slate-900 bg-[#E6F1FB] dark:bg-indigo-500/20 text-[#185FA5] dark:text-indigo-400 font-medium text-sm shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            {idx + 1}
          </div>
          <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100/80 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
            <h3 className="font-medium text-gray-900 dark:text-white text-base mb-2">{step.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function QuizSection() {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    if (idx === QUIZ_QUESTIONS[currentQ].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(q => q + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  };

  const retake = () => {
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    let msg = "Keep learning! Start with the Timeline section.";
    if (score === 8) msg = "Perfect score! You're an election expert.";
    else if (score >= 6) msg = "Great job! You know your elections well.";
    else if (score >= 4) msg = "Good effort! Review the timeline and terms sections.";

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-8 text-center max-w-md mx-auto shadow-sm">
        <div className="w-20 h-20 rounded-full bg-[#E6F1FB] dark:bg-indigo-500/20 text-[#185FA5] dark:text-indigo-400 flex flex-col items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold">{score}</span>
          <span className="text-xs font-medium opacity-80">OUT OF 8</span>
        </div>
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Quiz Complete</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">{msg}</p>
        <button onClick={retake} className="bg-[#185FA5] dark:bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 dark:hover:bg-indigo-500 transition-colors focus:outline-none">
          Retake Quiz
        </button>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQ];
  const progress = ((currentQ) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100/80 dark:border-slate-700 p-6 md:p-8 max-w-lg mx-auto shadow-lg shadow-gray-200/40 dark:shadow-none">
      <div className="mb-6">
        <div className="flex justify-between text-xs font-medium text-gray-400 dark:text-gray-500 mb-2">
          <span>Question {currentQ + 1} of 8</span>
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
            {currentQ < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function AskSection() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  const starters = [
    "How do I register to vote?",
    "What happens if my name isn't on the voter list?",
    "Can I vote without a Voter ID card?"
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    const newMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const apiMessages = [...messages, newMsg].map(m => ({ role: m.role, content: m.content }));
      
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text }]);
    } catch (err) {
      console.error(err);
      setError("Failed to reach the AI backend. Please make sure the local server is running on port 3001 and your API key is configured in the .env file.");
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
    <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100/80 dark:border-slate-700 flex flex-col h-[600px] max-w-2xl mx-auto shadow-xl shadow-gray-200/50 dark:shadow-none overflow-hidden">
      <div className="p-5 border-b border-gray-100/80 dark:border-slate-700 flex justify-between items-center bg-gray-50/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#185FA5] dark:text-indigo-400" />
          Election Assistant AI
        </h3>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-colors">
            <Trash2 className="w-3.5 h-3.5" /> Clear chat
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-[#E6F1FB] dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
              <HelpCircle className="w-8 h-8 text-[#185FA5] dark:text-indigo-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Ask me anything about elections</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm">I can help with voter registration, EVMs, election rules, and how the process works.</p>
            
            <div className="flex flex-col gap-2 w-full max-w-sm">
              {starters.map((starter, idx) => (
                <button 
                  key={idx} 
                  onClick={() => sendMessage(starter)}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm text-gray-700 dark:text-gray-300 py-2.5 px-4 rounded-full hover:bg-[#E6F1FB] dark:hover:bg-slate-700 hover:border-[#185FA5] dark:hover:border-indigo-500 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-colors text-left"
                >
                  {starter}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-[#185FA5] dark:bg-indigo-600 text-white rounded-tr-sm' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded-tl-sm'
              }`}>
                {msg.role === 'assistant' ? formatText(msg.content) : msg.content}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center h-10 w-16">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-slate-700">
        {error && <div className="text-xs text-red-500 dark:text-red-400 mb-2 ml-1">{error}</div>}
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(null); }}
            placeholder="Type your question..."
            disabled={loading}
            className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-full py-3 pl-4 pr-12 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-[#185FA5] dark:focus:border-indigo-500 focus:ring-1 focus:ring-[#185FA5] dark:focus:ring-indigo-500 disabled:opacity-50 placeholder-gray-400 dark:placeholder-gray-500"
          />
          <button 
            type="submit" 
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1.5 bottom-1.5 w-9 rounded-full bg-[#185FA5] dark:bg-indigo-600 text-white flex items-center justify-center hover:bg-blue-700 dark:hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-[#185FA5] dark:disabled:hover:bg-indigo-600 transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function HomeDashboard({ onNavigate, isDarkMode, toggleDarkMode }) {
  const cards = [
    { id: 'timeline', title: 'Timeline', desc: 'Step-by-step election process', icon: <Clock className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/20' },
    { id: 'terms', title: 'Key Terms', desc: 'Glossary of election jargon', icon: <BookOpen className="w-6 h-6" />, color: 'from-emerald-500 to-teal-600', shadow: 'shadow-emerald-500/20' },
    { id: 'eligibility', title: 'Eligibility', desc: 'Check if you can vote', icon: <CheckSquare className="w-6 h-6" />, color: 'from-amber-500 to-orange-600', shadow: 'shadow-amber-500/20' },
    { id: 'votingday', title: 'Voting Day', desc: 'What happens at the booth', icon: <Calendar className="w-6 h-6" />, color: 'from-purple-500 to-fuchsia-600', shadow: 'shadow-purple-500/20' },
    { id: 'quiz', title: 'Quiz', desc: 'Test your election knowledge', icon: <Brain className="w-6 h-6" />, color: 'from-rose-500 to-pink-600', shadow: 'shadow-rose-500/20' },
    { id: 'ask', title: 'Ask AI', desc: 'Get answers instantly', icon: <MessageCircle className="w-6 h-6" />, color: 'from-cyan-500 to-blue-600', shadow: 'shadow-cyan-500/20' }
  ];

  return (
    <div className="w-full relative">
      <div className="absolute top-0 right-0">
        <button 
          onClick={toggleDarkMode} 
          className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-all hover:shadow-md"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
      <div className="mb-10 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-lg shadow-blue-900/5 dark:shadow-none mb-2 ring-1 ring-black/5 dark:ring-white/5">
          <div className="bg-gradient-to-tr from-[#185FA5] to-indigo-400 dark:from-indigo-500 dark:to-purple-500 text-white p-3 rounded-xl">
            <CheckCircle className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Electra<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#185FA5] to-indigo-500 dark:from-indigo-400 dark:to-purple-400">Guide</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-lg mx-auto">Your ultimate companion to understanding Indian elections, clear and simple.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group text-left bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 hover:border-transparent transition-all duration-300 hover:shadow-xl ${card.shadow} dark:hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden backdrop-blur-sm`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 text-gray-900 dark:text-white">
              {React.cloneElement(card.icon, { className: 'w-24 h-24' })}
            </div>
            
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-[#185FA5] dark:group-hover:text-indigo-400 transition-colors">{card.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function TopNav({ currentView, onNavigate, isDarkMode, toggleDarkMode }) {
  const viewTitles = {
    timeline: 'Election Timeline',
    terms: 'Key Terms',
    eligibility: 'Eligibility Checker',
    votingday: 'Voting Day Guide',
    quiz: 'Knowledge Quiz',
    ask: 'Ask ElectraGuide AI'
  };

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200/60 dark:border-slate-700/60">
      <button 
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-indigo-500/50"
      >
        <Home className="w-4 h-4" /> Home
      </button>
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white bg-white dark:bg-slate-800 px-5 py-1.5 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm">{viewTitles[currentView]}</h2>
      <button 
        onClick={toggleDarkMode} 
        className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 text-gray-500 dark:text-gray-400 hover:text-[#185FA5] dark:hover:text-indigo-400 transition-all hover:shadow-md"
      >
        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function ElectionAssistant() {
  const [currentView, setCurrentView] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 py-8 px-4 sm:px-6 font-sans text-gray-900 dark:text-gray-100 w-full flex items-center justify-center transition-colors duration-500">
      <div className="w-full max-w-4xl">
        <main className="animate-fade-in w-full">
          {currentView === 'home' ? (
            <HomeDashboard onNavigate={setCurrentView} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          ) : (
            <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-3xl p-4 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-white/60 dark:border-slate-700/50">
              <TopNav currentView={currentView} onNavigate={setCurrentView} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
              <div className="animate-slide-up">
                {currentView === 'timeline' && <TimelineSection />}
                {currentView === 'terms' && <TermsSection />}
                {currentView === 'eligibility' && <EligibilitySection />}
                {currentView === 'votingday' && <VotingDaySection />}
                {currentView === 'quiz' && <QuizSection />}
                {currentView === 'ask' && <AskSection />}
              </div>
            </div>
          )}
        </main>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
