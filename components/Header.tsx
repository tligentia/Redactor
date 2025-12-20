import React from 'react';
import { WritingIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-100/95 backdrop-blur shadow-md border-b border-neutral-200 px-4 py-3 mb-6 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-x-2.5">
        <WritingIcon className="w-8 h-8 text-red-700" />
        <h1 className="text-2xl font-bold text-red-700 leading-none tracking-tight">
          Redactor
        </h1>
      </div>
      <p className="text-sm text-neutral-500 font-medium hidden sm:block text-right">
        Tu Asistente de Contenido Visual y Escrito
      </p>
    </header>
  );
};

export default Header;