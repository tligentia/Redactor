import React, { useState, useEffect, ReactNode } from 'react';
import PinScreen from './PinScreen';
import LoadingSpinner from '../LoadingSpinner';
import { WHITELISTED_IPS } from '../../constants';

interface SecureAccessGateProps {
  children: ReactNode;
}

const SESSION_AUTH_KEY = 'secureAccessGateAuthenticated';

const SecureAccessGate: React.FC<SecureAccessGateProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Check session storage first for faster reloads
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
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('Failed to fetch IP');
        const data = await response.json();
        const userIp = data.ip;
        
        if (WHITELISTED_IPS.includes(userIp)) {
          console.log("IP whitelisted. Granting access.");
          handleAuthSuccess();
        }
      } catch (error) {
        console.error("IP check failed:", error);
      } finally {
        setIsCheckingIp(false);
      }
    };

    checkIp();
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    try {
      sessionStorage.setItem(SESSION_AUTH_KEY, 'true');
    } catch (e) {
      console.warn("Could not set sessionStorage for authentication.");
    }
    setIsAuthenticated(true);
  };

  if (isCheckingIp) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" message="Verificando acceso..." />
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <>{children}</>;
  }

  return <PinScreen onAuthSuccess={handleAuthSuccess} />;
};

export default SecureAccessGate;