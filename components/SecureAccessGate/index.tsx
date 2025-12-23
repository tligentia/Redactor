import React, { useState, useEffect, ReactNode } from 'react';
import Security from './Security';
import LoadingSpinner from '../LoadingSpinner';
import { getAllowedIps } from '../../constants';

interface SecureAccessGateProps {
  children: ReactNode;
}

const SESSION_AUTH_KEY = 'secureAccessGateAuthenticated';

const SecureAccessGate: React.FC<SecureAccessGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_AUTH_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isCheckingIp, setIsCheckingIp] = useState<boolean>(!isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      setIsCheckingIp(false);
      return;
    }

    const checkIp = async () => {
      const endpoints = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://api.seeip.org/jsonip'
      ];

      let detectedUserIp: string | null = null;
      const allowedIps = getAllowedIps();

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const response = await fetch(endpoint, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            // Verificamos de forma segura las posibles propiedades que devuelven los distintos servicios
            const foundIp = data.ip || data.query || data.ip_address || data.address;
            if (foundIp && typeof foundIp === 'string') {
              detectedUserIp = foundIp.trim();
              break;
            }
          }
        } catch (error) {
          // Fallo silencioso: intentar el siguiente endpoint
          continue;
        }
      }

      if (detectedUserIp && allowedIps.includes(detectedUserIp)) {
        console.log("Acceso automático: IP autorizada detectada.");
        handleAuthSuccess();
      }
      
      setIsCheckingIp(false);
    };

    checkIp();
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    try {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    } catch (e) {
      // Ignorar fallos en sessionStorage (ej. modo incógnito restrictivo)
    }
    setIsAuthenticated(true);
  };

  if (isCheckingIp) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" message="Validando credenciales de red..." />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Security onLogin={handleAuthSuccess} />;
};

export default SecureAccessGate;