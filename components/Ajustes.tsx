import React, { useState, useEffect } from 'react';
import { X, Key, ShieldCheck, Globe, Plus, RefreshCcw, AlertCircle, Eye, EyeOff, Info, ExternalLink, Zap } from 'lucide-react';
import { getShortcutKey, getAllowedIps, saveAllowedIps } from '../constants';

interface AjustesProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onApiKeySave: (key: string) => void;
  userIp: string | null;
}

export const Ajustes: React.FC<AjustesProps> = ({ isOpen, onClose, apiKey, onApiKeySave, userIp }) => {
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [showApiHelp, setShowApiHelp] = useState(false);
  const [ips, setIps] = useState<string[]>(getAllowedIps());
  const [newIp, setNewIp] = useState('');

  useEffect(() => {
    setTempKey(apiKey);
    if (userIp) setNewIp(userIp);
  }, [apiKey, userIp, isOpen]);

  if (!isOpen) return null;

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shortcut = getShortcutKey(tempKey);
    const finalKey = shortcut || tempKey;
    onApiKeySave(finalKey);
    setTempKey(finalKey);
  };

  const handleAddIp = (ipToAdd: string) => {
    const cleanIp = ipToAdd.trim();
    if (cleanIp && !ips.includes(cleanIp)) {
      const updated = [...ips, cleanIp];
      setIps(updated);
      saveAllowedIps(updated);
      setNewIp('');
    }
  };

  const clearMemory = () => {
    const confirmMessage = `⚠️ ACCIÓN CRÍTICA: RESET TOTAL DEL SISTEMA\n\n¿Estás seguro de que deseas limpiar toda la memoria local y reiniciar la aplicación?`;
    if (confirm(confirmMessage)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-900 rounded-lg text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-xl leading-tight">Panel de Ajustes</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Configuración del Sistema</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-700 transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-900">
                <Key size={18} className="text-red-700" />
                <h4 className="font-black uppercase text-xs tracking-widest">Gemini API Key</h4>
                <button onClick={() => setShowApiHelp(!showApiHelp)} className={`p-1 rounded-full transition-colors ${showApiHelp ? 'bg-red-700 text-white' : 'bg-gray-100 text-gray-400 hover:text-red-700'}`}>
                  <Info size={14} />
                </button>
              </div>
            </div>

            {showApiHelp && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 animate-in slide-in-from-top-2 duration-300">
                <ul className="space-y-3">
                  {[
                    { text: 'Accede a Google AI Studio', link: 'https://aistudio.google.com/' },
                    { text: 'Crea una clave API y pégala abajo.' }
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-[11px] text-gray-600 leading-tight">
                      <span className="flex-shrink-0 w-4 h-4 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-[8px] text-red-700">{i+1}</span>
                      <span className="flex-1">{step.text} {step.link && <a href={step.link} target="_blank" className="text-red-700 underline font-bold">Web</a>}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleKeySubmit} className="space-y-3">
              <div className="relative group">
                <input type={showKey ? "text" : "password"} value={tempKey} onChange={(e) => setTempKey(e.target.value)} placeholder="AIzaSy... o atajo (ok/cv)" className="w-full bg-gray-50 border border-gray-200 p-4 pr-12 rounded-xl text-sm font-mono outline-none" />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-700 transition-colors">
                  {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-md shadow-gray-100">Guardar API Key</button>
            </form>
          </section>

          <section className="space-y-4 border-t border-gray-50 pt-8">
            <div className="flex items-center gap-2 text-gray-900">
              <Globe size={18} className="text-red-700" />
              <h4 className="font-black uppercase text-xs tracking-widest">Memorizar esta IP</h4>
            </div>
            <div className="flex gap-2">
              <input type="text" value={newIp} onChange={(e) => setNewIp(e.target.value)} placeholder="IP a memorizar..." className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-xl text-xs font-mono outline-none" />
              <button onClick={() => handleAddIp(newIp)} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all flex items-center gap-2">
                <Plus size={20} />
                <span className="text-[10px] font-black uppercase hidden sm:inline">Añadir</span>
              </button>
            </div>
            {userIp && (
              <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Detección Actual</p>
                  <p className="font-mono text-xs text-gray-900 font-bold">{userIp}</p>
                </div>
                {ips.includes(userIp) ? (
                   <span className="text-[9px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1"><Zap size={10} fill="currentColor"/> Memorizada</span>
                ) : (
                  <button onClick={() => setNewIp(userIp)} className="text-[9px] font-black uppercase text-red-700 hover:underline">Usar esta IP</button>
                )}
              </div>
            )}
          </section>

          <section className="space-y-4 border-t border-gray-50 pt-8 pb-4">
             <button onClick={clearMemory} className="w-full bg-red-700 hover:bg-red-800 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-200">
                <RefreshCcw size={18} /> Borrar todos los datos y reiniciar
              </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Ajustes;