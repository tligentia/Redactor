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

      let userIp: string | null = null;
      const allowedIps = getAllowedIps();

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(endpoint, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            userIp = data.ip || data.query || data.ip_address;
            if (userIp) break;
          }
        } catch (error) {
          // If fetch fails, we just try the next one quietly to avoid cluttering console 
          // unless it's the last attempt.
        }
      }

      if (userIp && allowedIps.includes(userIp)) {
        console.log("Whitelisted IP detected. Granting automatic access.");
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
      console.warn("Could not set auth state in session storage.");
    }
    setIsAuthenticated(true);
  };

  if (isCheckingIp) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" message="Verificando acceso de seguridad..." />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <Security onLogin={handleAuthSuccess} />;
};

export default SecureAccessGate;