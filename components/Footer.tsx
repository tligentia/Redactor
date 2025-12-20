import React from 'react';

interface FooterProps {
    appVersion: string;
    userIp: string | null;
    currentEngine: string;
    tokenCount: number | null;
}

const Footer: React.FC<FooterProps> = ({ appVersion, userIp, currentEngine, tokenCount }) => {
    return (
        <footer className="w-full mt-12 py-4 border-t border-slate-200 text-slate-600 text-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-red-700">{appVersion}</span>
                    {userIp && (
                         <>
                            <div className="border-l border-slate-300 h-5"></div>
                            <span className="font-mono text-xs">IP: {userIp}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4">
                     <div>
                        <span className="text-slate-600">Motor: </span>
                        <span className="font-mono text-base text-slate-800">{currentEngine || 'N/A'}</span>
                    </div>
                    <div className="border-l border-slate-300 h-5"></div>
                    <div>
                        <span className="text-slate-600">Tokens: </span>
                        <span className="font-mono text-base text-slate-800">{tokenCount !== null ? tokenCount.toLocaleString() : '0'}</span>
                    </div>
                </div>
                <div className="text-right">
                    <a href="https://jesus.depablos.es/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">Jesus de Pablos</a>
                    <span className="mx-1">by</span>
                    <a href="https://www.tligent.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 transition">Tligent</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;