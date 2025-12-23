import React from 'react';
import { X, ShieldCheck, Database, ServerOff, Lock } from 'lucide-react';

interface CookiesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Cookies: React.FC<CookiesProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-100 animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg text-red-700">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-black text-gray-900 uppercase tracking-tighter text-xl leading-tight">Cookies y Privacidad</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Compromiso de Transparencia</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-700 transition-all active:scale-90">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-gray-900">
              <Database size={18} className="text-red-700" />
              <h4 className="font-black uppercase text-sm tracking-tight">Almacenamiento Local (LocalStorage)</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">Esta aplicación no utiliza cookies de rastreo. Toda la información sensible se almacena exclusivamente en tu dispositivo.</p>
          </section>
          <section className="space-y-3 border-t border-gray-50 pt-6">
            <div className="flex items-center gap-2 text-gray-900">
              <ServerOff size={18} className="text-red-700" />
              <h4 className="font-black uppercase text-sm tracking-tight">Arquitectura Sin Servidor Propio</h4>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">No disponemos de bases de datos centralizadas. El intercambio ocurre directamente con la API oficial de Google Gemini.</p>
          </section>
        </div>

        <div className="p-6 border-t border-gray-100 bg-white">
          <button onClick={onClose} className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-[0.98] shadow-lg shadow-gray-200">Entendido y Aceptar</button>
        </div>
      </div>
    </div>
  );
};

export default Cookies;