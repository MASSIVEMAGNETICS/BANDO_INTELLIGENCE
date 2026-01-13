
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DEFAULT_EXPERTS } from './constants';
import { Expert, Message, PersonaType } from './types';
import ExpertBadge from './components/ExpertBadge';
import DebateBubble from './components/DebateBubble';
import ExpertForge from './components/ExpertForge';
import { getExpertResponse } from './services/geminiService';

const App: React.FC = () => {
  const [experts, setExperts] = useState<Expert[]>(DEFAULT_EXPERTS);
  const [topic, setTopic] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeExpert, setActiveExpert] = useState<PersonaType | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showForge, setShowForge] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [intervention, setIntervention] = useState('');
  const [targetedExpert, setTargetedExpert] = useState<PersonaType | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const expertsOrder: PersonaType[] = ['scientist', 'ethicist', 'engineer', 'historian', 'futurist'];

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsStarted(true);
    setMessages([]);
  };

  const handleIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    if (!intervention.trim()) return;
    
    const newMessage: Message = {
      id: `director-${Date.now()}`,
      expertId: 'director',
      content: intervention,
      timestamp: new Date(),
      targetExpertId: targetedExpert || undefined
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIntervention('');
    setTargetedExpert(null);
  };

  const performExport = (format: 'txt' | 'json', includeSources: boolean) => {
    let content = '';
    let mimeType = 'text/plain';
    let extension = 'txt';

    if (format === 'json') {
      const exportData = {
        topic,
        timestamp: new Date().toISOString(),
        experts: experts.map(({ id, role, domain, style }) => ({ id, role, domain, style })),
        transcript: messages.map(m => ({
          time: m.timestamp,
          sender: m.expertId === 'director' ? 'DIRECTOR' : experts.find(e => e.id === m.expertId)?.name,
          content: m.content,
          sources: includeSources ? m.sources : undefined
        }))
      };
      content = JSON.stringify(exportData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else {
      content = `BANDO DEBATE LOG\nTopic: ${topic}\nDate: ${new Date().toLocaleDateString()}\n\n`;
      messages.forEach(m => {
        const sender = m.expertId === 'director' ? 'DIRECTOR' : experts.find(e => e.id === m.expertId)?.name;
        content += `[${m.timestamp.toLocaleTimeString()}] ${sender}:\n${m.content}\n`;
        if (includeSources && m.sources?.length) {
          content += `Sources: ${m.sources.join(', ')}\n`;
        }
        content += `\n---\n\n`;
      });
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bando-${topic.replace(/\s+/g, '-').toLowerCase()}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  const nextTurn = useCallback(async () => {
    if (!isStarted || isThinking) return;

    const lastMessage = messages[messages.length - 1];
    let currentPersonaId: PersonaType;

    if (lastMessage?.expertId === 'director' && lastMessage.targetExpertId) {
      currentPersonaId = lastMessage.targetExpertId;
    } else {
      const aiMessageCount = messages.filter(m => m.expertId !== 'director').length;
      currentPersonaId = expertsOrder[aiMessageCount % expertsOrder.length];
    }
    
    const currentExpert = experts.find(e => e.id === currentPersonaId)!;
    setActiveExpert(currentPersonaId);
    setIsThinking(true);

    try {
      const response = await getExpertResponse(currentExpert, topic, messages);
      const newMessage: Message = {
        id: `ai-${Date.now()}`,
        expertId: currentPersonaId,
        content: response.text,
        timestamp: new Date(),
        isSearchUsed: !!response.sources?.length,
        sources: response.sources
      };
      setMessages(prev => [...prev, newMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsThinking(false);
    }
  }, [isStarted, messages, topic, experts, isThinking]);

  useEffect(() => {
    if (isStarted && !isThinking && messages.length < 50) {
      const timer = setTimeout(() => {
        nextTurn();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isStarted, messages.length, isThinking, nextTurn]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-sky-500 selection:text-white">
      {showForge && (
        <ExpertForge 
          experts={experts} 
          onUpdate={setExperts} 
          onClose={() => setShowForge(false)} 
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowExportModal(false)}></div>
          <div className="relative glass-panel w-full max-w-sm p-6 rounded-2xl border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4">Export Analysis</h3>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <button onClick={() => performExport('txt', true)} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left flex items-center justify-between group">
                  <span>Standard Log (.txt)</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-sky-400">Detailed</span>
                </button>
                <button onClick={() => performExport('txt', false)} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left flex items-center justify-between group">
                  <span>Lite Log (.txt)</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-sky-400">Clean</span>
                </button>
                <button onClick={() => performExport('json', true)} className="w-full bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left flex items-center justify-between group">
                  <span>Research Data (.json)</span>
                  <span className="text-[10px] text-slate-500 group-hover:text-sky-400">System Ready</span>
                </button>
              </div>
            </div>
            <button onClick={() => setShowExportModal(false)} className="w-full mt-6 py-2 text-slate-500 text-sm hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-50 glass-panel border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">B</div>
              <h1 className="text-xl font-bold tracking-tight gradient-text">BANDO</h1>
            </div>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={() => setShowForge(true)}
                className="text-[10px] bg-slate-900/50 hover:bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800 transition-all flex items-center gap-2 uppercase tracking-widest font-bold"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                The Forge
              </button>
              {isStarted && (
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="text-[10px] bg-slate-900/50 hover:bg-slate-800 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-800 uppercase tracking-widest font-bold transition-all"
                >
                  Export
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            {experts.map(expert => (
              <div 
                key={expert.id} 
                onClick={() => isStarted && setTargetedExpert(expert.id)}
                className={`cursor-pointer transition-all ${targetedExpert === expert.id ? 'ring-2 ring-amber-500 scale-105 rounded-xl shadow-lg shadow-amber-500/10' : 'hover:scale-102'}`}
              >
                <ExpertBadge 
                  expert={expert} 
                  isActive={activeExpert === expert.id} 
                  isThinking={activeExpert === expert.id && isThinking}
                />
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-12">
        {!isStarted ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6">
              <h2 className="text-6xl font-black tracking-tighter leading-tight lg:text-7xl">
                Intelligence <br /> <span className="gradient-text">Orchestrated</span>.
              </h2>
              <p className="text-slate-400 text-xl max-w-2xl font-light">
                Deploy specialized AI assemblies to solve high-stakes challenges. <br className="hidden md:block"/> Configure your team in The Forge and initiate analysis.
              </p>
            </div>

            <form onSubmit={handleStart} className="w-full max-w-2xl group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
              <div className="relative flex bg-slate-900 border border-slate-800 rounded-3xl p-3 shadow-2xl">
                <input 
                  type="text" 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="What shall we solve today?"
                  className="bg-transparent flex-1 px-6 py-4 outline-none text-slate-100 text-lg"
                />
                <button 
                  type="submit"
                  disabled={!topic.trim()}
                  className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg shadow-sky-500/20 active:scale-95"
                >
                  Initiate
                </button>
              </div>
            </form>
            
            <div className="flex gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              <span>Expert Multi-Agentic Logic</span>
              <span>•</span>
              <span>Real-Time Grounding</span>
              <span>•</span>
              <span>Director Controlled</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-48">
            <div className="flex items-center justify-between mb-12 pb-6 border-b border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-sky-500 uppercase tracking-[0.3em]">Analysis Operation</p>
                <h2 className="text-3xl font-bold text-slate-100">{topic}</h2>
              </div>
              <button onClick={() => { if(confirm('Reset current session?')) setIsStarted(false); }} className="text-slate-600 hover:text-red-400 transition-colors">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>

            <div className="space-y-2">
              {messages.map((msg) => (
                <DebateBubble key={msg.id} message={msg} experts={experts} />
              ))}
            </div>

            {isThinking && (
              <div className="flex gap-6 animate-pulse px-4 py-8 bg-white/5 rounded-3xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-slate-800 shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-32" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-full" />
                    <div className="h-4 bg-slate-800 rounded w-5/6" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={scrollRef} className="h-8" />
          </div>
        )}
      </main>

      {/* Director Console */}
      {isStarted && (
        <div className="fixed bottom-0 left-0 right-0 p-8 z-40 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent pointer-events-none">
          <div className="max-w-4xl mx-auto space-y-4 pointer-events-auto">
            <div className="flex gap-2 justify-center flex-wrap">
              {['Ask for evidence', 'Provide context', 'Summarize consensus', 'Challenge bias'].map(hint => (
                <button 
                  key={hint}
                  onClick={() => setIntervention(prev => prev ? prev + ' ' + hint : hint)}
                  className="text-[10px] uppercase font-bold text-slate-400 hover:text-amber-500 bg-slate-900 border border-white/5 hover:border-amber-500/30 px-4 py-1.5 rounded-full transition-all"
                >
                  {hint}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleIntervention} className="relative group">
              <div className="absolute -inset-1 bg-amber-500 rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-300"></div>
              <div className="relative glass-panel p-2 rounded-2xl border-amber-500/20 flex shadow-2xl overflow-hidden focus-within:border-amber-500/40 transition-all">
                <div className="flex flex-col items-center justify-center px-5 bg-amber-500/5 text-amber-500 border-r border-amber-500/10 mr-3 shrink-0">
                  <span className="font-black text-[9px] uppercase tracking-tighter">Director</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse mt-0.5" />
                </div>
                <input 
                  type="text" 
                  value={intervention}
                  onChange={(e) => setIntervention(e.target.value)}
                  placeholder={targetedExpert ? `Targeting ${experts.find(e => e.id === targetedExpert)?.name}...` : "Command the assembly..."}
                  className="bg-transparent flex-1 px-4 py-4 outline-none text-slate-100 placeholder:text-slate-600 font-medium"
                />
                <button 
                  type="submit"
                  disabled={!intervention.trim()}
                  className="bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-white font-bold px-8 py-2 rounded-xl transition-all shadow-xl shadow-amber-900/20"
                >
                  Transmit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
