import React, { useState, useEffect } from 'react';
import { WHITELISTED_IPS } from '../constants';

const PrivacyBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkVisibility = async () => {
      // 1. Verificar si ya fue aceptado por el usuario
      const accepted = localStorage.getItem('redactor_privacy_accepted');
      if (accepted) {
        return; // No hacer nada, isVisible se mantiene en false
      }

      // 2. Verificar si es una IP de desarrollo (Whitelist)
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (response.ok) {
          const data = await response.json();
          if (WHITELISTED_IPS.includes(data.ip)) {
             // Es una IP de desarrollo, no mostramos el banner
             return; 
          }
        }
      } catch (error) {
        console.warn("No se pudo verificar la IP para el banner de privacidad, se mostrará por defecto.");
      }

      // 3. Si no está aceptado y no es IP de desarrollo, mostrar
      setIsVisible(true);
    };

    checkVisibility();
  }, []);

  const handleAccept = () => {
    localStorage.setItem('redactor_privacy_accepted', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900/95 backdrop-blur-sm text-white p-4 z-50 shadow-2xl border-t border-neutral-700 animate-slide-up">
      <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-300">
          <strong className="text-white block mb-1 text-base">Aviso de Privacidad y Cookies</strong>
          Este sitio web es una herramienta de uso privado. 
          <span className="text-red-400 font-medium"> No almacenamos ningún dato en servidores externos.</span> 
          Todas las configuraciones y el historial se guardan localmente en tu navegador (LocalStorage). 
          Las interacciones con la IA se realizan directamente con la API de Google Gemini.
        </div>
        <button
          onClick={handleAccept}
          className="whitespace-nowrap px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
        >
          Entendido y Aceptar
        </button>
      </div>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PrivacyBanner;