import React, { useState } from 'react';
import { EnterIcon } from '../icons/index';

interface PinScreenProps {
  onAuthSuccess: () => void;
}

const PinScreen: React.FC<PinScreenProps> = ({ onAuthSuccess }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (code.toUpperCase() === 'STAR') {
      onAuthSuccess();
    } else {
      setError(true);
      setCode('');
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-4 text-neutral-800 z-50">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-red-700 mb-2">JdP Redactor</h1>
            <p className="text-neutral-500">Acceso restringido</p>
        </div>

        <div className="w-full max-w-sm mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                    <input
                        type="text"
                        maxLength={4}
                        value={code}
                        onChange={(e) => {
                            setError(false);
                            setCode(e.target.value);
                        }}
                        placeholder="CÓDIGO"
                        className={`w-full h-16 text-center text-3xl font-mono tracking-[0.5em] bg-neutral-100 border rounded-xl focus:outline-none focus:ring-2 uppercase transition-all duration-300
                            ${error 
                                ? 'border-red-500 ring-red-200 animate-shake placeholder-red-300 text-red-700' 
                                : 'border-neutral-200 focus:border-red-500 focus:ring-red-200 text-neutral-800'
                            }`}
                        autoFocus
                    />
                </div>

                <button 
                    type="submit"
                    disabled={code.length === 0}
                    className="flex items-center justify-center w-full h-14 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="mr-2">Acceder</span>
                    <EnterIcon className="w-5 h-5" />
                </button>
            </form>
            
            <p className="text-center text-neutral-400 mt-6 text-sm">
                Introduce el código de 4 letras para continuar.
            </p>
        </div>
        <style>
          {`
            @keyframes shake {
              10%, 90% { transform: translate3d(-1px, 0, 0); }
              20%, 80% { transform: translate3d(2px, 0, 0); }
              30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
              40%, 60% { transform: translate3d(4px, 0, 0); }
            }
            .animate-shake {
              animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
            }
          `}
        </style>
    </div>
  );
};

export default PinScreen;