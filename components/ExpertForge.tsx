
import React, { useState, useEffect } from 'react';
import { Expert } from '../types';
import { DOMAINS, STYLES, PRINCIPLES, ASSEMBLY_PRESETS } from '../constants';

interface Props {
  experts: Expert[];
  onUpdate: (updated: Expert[]) => void;
  onClose: () => void;
}

const ExpertForge: React.FC<Props> = ({ experts, onUpdate, onClose }) => {
  const [customPresets, setCustomPresets] = useState<Record<string, Expert[]>>({});
  const [newPresetName, setNewPresetName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bando_custom_presets');
    if (saved) setCustomPresets(JSON.parse(saved));
  }, []);

  const handleChange = (id: string, key: keyof Expert, value: string) => {
    const next = experts.map(e => e.id === id ? { ...e, [key]: value } : e);
    onUpdate(next);
  };

  const applyPreset = (preset: Expert[]) => {
    onUpdate(preset);
  };

  const saveCustomPreset = () => {
    if (!newPresetName.trim()) return;
    const next = { ...customPresets, [newPresetName]: experts };
    setCustomPresets(next);
    localStorage.setItem('bando_custom_presets', JSON.stringify(next));
    setNewPresetName('');
  };

  const deleteCustomPreset = (name: string) => {
    const next = { ...customPresets };
    delete next[name];
    setCustomPresets(next);
    localStorage.setItem('bando_custom_presets', JSON.stringify(next));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="glass-panel w-full max-w-6xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto border-sky-500/20 shadow-2xl scrollbar-hide">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-bold gradient-text">The Forge</h2>
            <p className="text-slate-400 text-sm">Design your team's DNA. Customize attributes or load blueprints.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Preset Management */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3 space-y-6">
            <section>
              <h3 className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Assembly Blueprints</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ASSEMBLY_PRESETS).map(([name, preset]) => (
                  <button key={name} onClick={() => applyPreset(preset)} className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-sky-500/50 rounded-lg text-xs font-medium transition-all text-slate-300">
                    {name}
                  </button>
                ))}
              </div>
            </section>

            {Object.keys(customPresets).length > 0 && (
              <section>
                <h3 className="text-[10px] uppercase tracking-widest text-amber-500 font-bold mb-3">Custom Saved Assemblies</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(customPresets).map(([name, preset]) => (
                    <div key={name} className="group flex items-center bg-amber-500/10 border border-amber-500/20 rounded-lg overflow-hidden">
                      <button onClick={() => applyPreset(preset)} className="px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/10 transition-colors">
                        {name}
                      </button>
                      <button onClick={() => deleteCustomPreset(name)} className="px-2 py-1.5 border-l border-amber-500/20 text-amber-500 hover:text-red-400 transition-colors">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 h-fit">
            <h3 className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3 text-center">Save Current State</h3>
            <input 
              type="text" 
              placeholder="Assembly Name..." 
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs mb-3 outline-none focus:border-amber-500"
            />
            <button 
              onClick={saveCustomPreset}
              disabled={!newPresetName.trim()}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-30 text-white text-xs font-bold py-2 rounded-lg transition-all"
            >
              Commit to Memory
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {experts.map((expert) => (
            <div key={expert.id} className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl space-y-4 hover:border-slate-700 transition-colors">
              <div className="flex flex-col items-center text-center gap-2">
                <img src={expert.avatar} className="w-16 h-16 rounded-full border-2 p-1" style={{ borderColor: expert.color }} />
                <div>
                  <h3 className="font-bold text-sm" style={{ color: expert.color }}>{expert.role}</h3>
                  <p className="text-[10px] text-slate-500 italic">{expert.name}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-slate-600 font-bold block">Domain</span>
                  <select value={expert.domain} onChange={(e) => handleChange(expert.id, 'domain', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-300 outline-none">
                    {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-slate-600 font-bold block">Style</span>
                  <select value={expert.style} onChange={(e) => handleChange(expert.id, 'style', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-300 outline-none">
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase text-slate-600 font-bold block">Principle</span>
                  <select value={expert.principle} onChange={(e) => handleChange(expert.id, 'principle', e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-slate-300 outline-none">
                    {PRINCIPLES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={onClose} className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-12 py-3 rounded-2xl transition-all shadow-xl shadow-sky-500/20 active:scale-95">
            Initialize Assembly
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertForge;
