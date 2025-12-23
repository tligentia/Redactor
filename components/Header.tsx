import React from 'react';
import { HelpCircle } from 'lucide-react';
import { WritingIcon } from './icons';
import { AppMenu } from './AppMenu';

interface HeaderProps {
  onShowManual: () => void;
}

const Header: React.FC<HeaderProps> = ({ onShowManual }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100 px-4 py-2 mb-6 flex items-center justify-between transition-all duration-300">
      {/* LADO IZQUIERDO: Título y Logo */}
      <div className="flex items-center gap-x-3">
        <div className="bg-red-700 p-1.5 rounded-lg shadow-sm flex items-center justify-center">
          <WritingIcon className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-black text-black leading-none tracking-tight">
            Redactor
          </h1>
          <span className="text-[9px] text-red-600 font-extrabold uppercase tracking-[0.2em] mt-0.5">
            AI Content Studio
          </span>
        </div>
      </div>

      {/* LADO DERECHO: Lema y AppMenu */}
      <div className="flex items-center gap-x-4">
        <button 
            onClick={onShowManual}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 px-4 py-2 rounded-xl transition-all active:scale-95 group shadow-sm"
          >
            <HelpCircle size={18} className="text-red-700 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Manual</span>
          </button>
        <AppMenu />
      </div>
    </header>
  );
};

export default Header;