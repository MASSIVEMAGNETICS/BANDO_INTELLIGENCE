
import React from 'react';
import { Message, Expert } from '../types';

interface Props {
  message: Message;
  experts: Expert[];
}

const DebateBubble: React.FC<Props> = ({ message, experts }) => {
  const isDirector = message.expertId === 'director';
  const expert = !isDirector ? experts.find(e => e.id === message.expertId)! : null;
  const targetExpert = message.targetExpertId ? experts.find(e => e.id === message.targetExpertId) : null;

  if (isDirector) {
    return (
      <div className="debate-bubble mb-8 flex flex-col items-center animate-in zoom-in duration-500">
        <div className="bg-amber-500/10 border border-amber-500/30 px-6 py-4 rounded-2xl max-w-2xl text-center shadow-xl shadow-amber-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="flex items-center justify-center gap-2 mb-2 text-amber-400 font-mono text-[10px] uppercase tracking-widest font-bold">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
            Director Intervention
            {targetExpert && (
              <span className="ml-2 text-amber-500/70 border-l border-amber-500/30 pl-2">
                Targeting: {targetExpert.name}
              </span>
            )}
          </div>
          <p className="text-amber-100 italic leading-relaxed text-sm md:text-base">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="debate-bubble mb-8 flex gap-4 animate-in slide-in-from-bottom-4 duration-500">
      <img 
        src={expert!.avatar} 
        alt={expert!.name} 
        className="w-10 h-10 rounded-full border-2 flex-shrink-0 shadow-lg object-cover"
        style={{ borderColor: expert!.color }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-bold" style={{ color: expert!.color }}>{expert!.name}</span>
          <span className="text-[10px] text-slate-500 uppercase font-mono">{message.timestamp.toLocaleTimeString()}</span>
          {message.isSearchUsed && (
            <span className="bg-sky-500/10 text-sky-400 text-[10px] px-2 py-0.5 rounded border border-sky-500/20 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Research Active
            </span>
          )}
        </div>
        <div className="glass-panel p-5 rounded-2xl rounded-tl-none leading-relaxed text-slate-200 shadow-xl border-l-4 transition-all hover:bg-slate-800/80" style={{ borderLeftColor: expert!.color }}>
          <p className="whitespace-pre-wrap">{message.content}</p>
          
          {message.sources && message.sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-700/50">
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Grounding Sources:</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((url, i) => (
                  <a 
                    key={i} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[10px] bg-slate-800/50 hover:bg-slate-700 px-2 py-1 rounded text-sky-400 border border-slate-700 transition-colors truncate max-w-[180px]"
                  >
                    {new URL(url).hostname}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DebateBubble;
