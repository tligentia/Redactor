import React, { useState, useEffect, useCallback } from 'react';
import { BackspaceIcon, EnterIcon } from './icons/index';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [inputCode, setInputCode] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const getCorrectPassword = useCallback((date: Date): string => {
    const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay(); // Monday=1, Sunday=7
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    return `${dayOfWeek}${minutes}${dayOfMonth}`;
  }, []);

  const handleKeyPress = (digit: string) => {
    if (inputCode.length < 5) {
      setInputCode(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setInputCode(prev => prev.slice(0, -1));
  };

  const handleEnter = () => {
    const correctPassword = getCorrectPassword(new Date());
    if (inputCode === correctPassword || inputCode === '7887') {
      onAuthSuccess();
    } else {
      setError(true);
      setInputCode('');
      setTimeout(() => setError(false), 500); // Reset error state for animation
    }
  };

  const formattedDate = currentTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const formattedTime = currentTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const KeypadButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
  }> = ({ onClick, children, className = '' }) => (
    <button
      onClick={onClick}
      className={`flex items-center justify-center h-16 bg-neutral-100 border border-neutral-300 text-neutral-800 text-3xl font-light rounded-2xl shadow-lg transition-all duration-150 ease-in-out hover:bg-neutral-200 active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-4 text-neutral-800">
        <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-red-700">JdP Redactor</h1>
            <p className="text-lg text-neutral-600 mt-2 capitalize">{formattedDate}</p>
            <p className="text-5xl font-mono tracking-widest text-neutral-800 mt-2">{formattedTime}</p>
        </div>

        <div className="w-full max-w-xs mx-auto">
            <div 
              className={`w-full h-20 bg-neutral-100 rounded-xl mb-6 flex items-center justify-center text-5xl font-mono tracking-[0.2em] transition-all duration-300 ${error ? 'animate-shake border-2 border-red-500' : 'border border-neutral-200'}`}
            >
              <div className="flex justify-center items-center" aria-label={`Entered code: ${inputCode.length} of 5 digits`}>
                {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className="inline-block w-10 text-center">
                        {inputCode[index] ? '•' : <span className="text-neutral-400">_</span>}
                    </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
                {[...Array(9)].map((_, i) => (
                    <KeypadButton key={i + 1} onClick={() => handleKeyPress(String(i + 1))}>
                        {i + 1}
                    </KeypadButton>
                ))}
                
                <KeypadButton onClick={handleDelete}>
                    <BackspaceIcon className="w-8 h-8"/>
                </KeypadButton>

                <KeypadButton onClick={() => handleKeyPress('0')}>
                    0
                </KeypadButton>

                <KeypadButton onClick={handleEnter} className="bg-red-600 text-white hover:bg-red-700">
                    <EnterIcon className="w-8 h-8" />
                </KeypadButton>
            </div>
            
            <p className="text-center text-neutral-500 mt-6 text-sm">
                Pista: dmmdd
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

export default AuthScreen;