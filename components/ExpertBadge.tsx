
import React from 'react';
import { Expert } from '../types';

interface Props {
  expert: Expert;
  isActive: boolean;
  isThinking: boolean;
}

const ExpertBadge: React.FC<Props> = ({ expert, isActive, isThinking }) => {
  return (
    <div className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-500 ${isActive ? 'bg-slate-800/80 shadow-lg' : 'opacity-60 grayscale'}`}>
      <div className="relative">
        <img 
          src={expert.avatar} 
          alt={expert.name} 
          className={`w-12 h-12 rounded-full border-2 object-cover ${isActive ? 'expert-active' : ''}`}
          style={{ borderColor: expert.color }}
        />
        {isThinking && (
          <div className="absolute -top-1 -right-1 bg-sky-500 w-4 h-4 rounded-full animate-pulse border-2 border-slate-900" />
        )}
      </div>
      <div className="hidden md:block">
        <p className="text-xs font-bold uppercase tracking-wider" style={{ color: expert.color }}>{expert.role}</p>
        <p className="text-sm font-medium">{expert.name}</p>
      </div>
    </div>
  );
};

export default ExpertBadge;
