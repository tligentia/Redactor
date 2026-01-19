import React from 'react';

// Nuevo icono corporativo (Pluma estilográfica estilizada)
export const AppLogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none" className={className}>
    <rect width="512" height="512" rx="105" fill="#b91c1c"/>
    <path d="M256 96L392 400L256 340L120 400L256 96Z" fill="white"/>
    <path d="M256 340V210" stroke="#b91c1c" strokeWidth="24" strokeLinecap="round"/>
  </svg>
);

export const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M9.401 2.657a.75.75 0 01.198.53l-.328 2.047a.75.75 0 00.328.763l2.072 1.381a.75.75 0 01.328.97l-1.423 2.846a.75.75 0 00.013.84L12.5 14.25l.412 2.063a.75.75 0 01-1.375.687L10 14.341l-1.537 2.656A.75.75 0 017.09 16.5l.412-2.063L9.5 12.18l-1.63-2.172a.75.75 0 00-1.155-.328L4.357 11a.75.75 0 01-.84-.013L2.09 9.563a.75.75 0 01.328-.97L4.49 7.212a.75.75 0 00.328-.763L4.49 4.402a.75.75 0 01.53-.198l2.047.328a.75.75 0 00.763-.328L9.212 2.49A.75.75 0 019.401 2.657z" />
    <path fillRule="evenodd" d="M4.5 12a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-.75-.75zM15.5 12a.75.75 0 00-.75.75v2.5a.75.75 0 001.5 0v-2.5a.75.75 0 00-.75-.75zM7.5 15.75a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.905 3.129V2.75z" />
    <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.393c-.842.07-1.168 1.063-.547 1.634l3.638 3.282-1.116 4.641c-.17.712.602 1.267 1.23.931l4.134-2.456 4.134-2.456c.629.335 1.4-.219 1.23-.931l-1.116-4.641 3.638-3.282c.62-.571.295-1.564-.547-1.634l-4.753-.393L10.868 2.884z" clipRule="evenodd" />
  </svg>
);

export const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.665l3-3z" />
    <path d="M8.603 17.002a.75.75 0 00-.977 1.138 4 4 0 005.656-5.656l-1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a2.5 2.5 0 01-3.536-3.536l3-3a2.5 2.5 0 013.536 3.536L10.07 11.07a.75.75 0 001.06 1.06l1.225-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 005.656 5.656l.001.001z" />
  </svg>
);

export const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

export const LightBulbIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M10 3.5A5.508 5.508 0 004.5 9c0 2.236 1.34 4.145 3.25 4.968V16.5a.5.5 0 00.5.5h3.5a.5.5 0 00.5-.5v-2.532A5.495 5.495 0 0015.5 9a5.508 5.508 0 00-5.5-5.5zM10 13a4 4 0 110-8 4 4 0 010 8z" />
    <path d="M6.5 18a.5.5 0 00.5.5h6a.5.5 0 000-1H7a.5.5 0 00-.5.5z" />
    <path d="M10 2a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

export const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M7 3.5A1.5 1.5 0 018.5 2h5A1.5 1.5 0 0115 3.5v10a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 017 13.5V12H5.5A1.5 1.5 0 014 10.5v-5A1.5 1.5 0 015.5 4H7V3.5zM5.5 5.5a.5.5 0 00-.5.5v5a.5.5 0 00.5.5H7V5.5H5.5zM8.5 3.5a.5.5 0 00-.5.5V12h5V3.5a.5.5 0 00-.5.5h-4z"/>
  </svg>
);

export const LinkedInIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.62 1.62 0 0013 14.19V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
  </svg>
);

export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M22.46 6c-.77.35-1.6.58-2.46.67.9-.53 1.59-1.37 1.92-2.38-.84.5-1.78.86-2.79 1.07A4.47 4.47 0 0015.65 4c-2.64 0-4.52 2.37-3.99 5.26A12.73 12.73 0 013.9 5.46a4.53 4.53 0 001.39 6.09c-.71-.02-1.37-.22-1.95-.54v.03c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.79 2.26 3.09 4.25 3.13A9.01 9.01 0 012.5 18.15 12.57 12.57 0 009.64 20c7.95 0 12.3-6.57 12.3-12.3 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.13-2.22z"></path>
  </svg>
);

export const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z"></path>
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89H8.351V12h2.087V9.782c0-2.071 1.235-3.221 3.137-3.221.887 0 1.792.067 1.792.067v2.153H14.1c-1.002 0-1.196.482-1.196 1.18v1.541h2.39l-.31 2.89h-2.08V21.878A10.003 10.003 0 0022 12z"></path>
  </svg>
);

export const BlogIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M2 4.25A2.25 2.25 0 014.25 2h11.5A2.25 2.25 0 0118 4.25v8.5A2.25 2.25 0 0115.75 15H9.31l-3.414 3.414A.75.75 0 015 17.828V15H4.25A2.25 2.25 0 012 12.75v-8.5zM4.25 3.5c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75H5.5V16.086L7.914 13.5H15.75c.414 0 .75-.336.75-.75v-8.5c0 .414-.336.75-.75-.75H4.25z" clipRule="evenodd" />
    <path d="M6.5 6a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7zm0 2.5a.75.75 0 000 1.5h7a.75.75 0 000-1.5h-7zm0 2.5a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z" />
  </svg>
);

export const WritingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.154-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
  </svg>
);

export const ClearIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
  </svg>
);

export const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
  </svg>
);

// New Icons for Editor Toolbar
export const BoldIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M3.75 4.5a.75.75 0 000 1.5h4.285A2.25 2.25 0 0110.25 8v4A2.25 2.25 0 018.035 14.25H3.75a.75.75 0 000 1.5h4.285A3.75 3.75 0 0011.75 12V8A3.75 3.75 0 008.035 4.25H3.75a.75.75 0 00-.75.75H3.75zm0 1.5v4.5h4.285A.75.75 0 0010.25 10V8A.75.75 0 008.035 6H3.75z" />
  </svg>
);

export const ItalicIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M8.75 4.75a.75.75 0 00-1.5 0v1.508L4.665 14.75a.75.75 0 001.5 0L8.75 6.241V4.75zm3.5 0a.75.75 0 00-1.5 0v8.509l-2.618-8.492a.75.75 0 00-1.464.45l3.25 10.562a.75.75 0 001.465-.45L12.25 6.258V4.75z" />
  </svg>
);

export const ListBulletIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M2 5.75A.75.75 0 012.75 5h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 5.75zM2 10.75A.75.75 0 012.75 10h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10.75zM2 15.75A.75.75 0 012.75 15h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 15.75z" clipRule="evenodd" />
    <path d="M4 5.75a1 1 0 100-2 1 1 0 000 2zM4 10.75a1 1 0 100-2 1 1 0 000 2zM4 15.75a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

export const ListOrderedIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M7.75 5a.75.75 0 01.75.75v.005h8.75a.75.75 0 010 1.5H8.5V7.25A.75.75 0 017.75 5zM7.75 10a.75.75 0 01.75.75v.005h8.75a.75.75 0 010 1.5H8.5v-.005A.75.75 0 017.75 10zm0 5a.75.75 0 01.75.75v.005h8.75a.75.75 0 010 1.5H8.5V15.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    <path d="M2.56 5.53a.75.75 0 01.16-1.049l.607-.565a.75.75 0 01.996.113l.004.005.006.007c.026.03.045.066.059.106V4.75a.75.75 0 011.5 0v2.333a.75.75 0 01-.219.53l-.975.976a.75.75 0 01-1.06 0l-.976-.975A.75.75 0 012.56 5.53zm-.002 4.938a.75.75 0 01.742-.665H4.5a.75.75 0 010 1.5H3.34l.002.002a1.002 1.002 0 01.03.04l.002.003.01.015.003.004.004.005.005.005a.752.752 0 01.01.012l.102.102a.75.75 0 11-1.06 1.06l-.102-.102-.004-.003a2.25 2.25 0 00-.036-.036l-.004-.003-.004-.003-.005-.003h-.002a.75.75 0 01-.741-.837v-.53zm0 4.999a.75.75 0 01.742-.665H4.5a.75.75 0 010 1.5H3.5a.75.75 0 01-.744-.662l-.002-.007v-.003l.004.002.25.084a.75.75 0 01.492 1.006l-.524.785a.75.75 0 11-1.298-.865l.23-.346-.118-.039a.75.75 0 01-.397-.736V15.5z" />
  </svg>
);

export const BackspaceIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.12c.36.53.9.88 1.59.88h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM18.41 15.59L17 14.17l-1.41 1.42L14.17 14l-1.42 1.41L11.34 14l1.41-1.41-1.41-1.41 1.41-1.42 1.42 1.42-1.41-1.42 1.42 1.42-1.42 1.41 1.42 1.41zM17 13.17l1.41 1.42L19.83 13l-1.42-1.41L17 13.17z"/>
    </svg>
);

export const EnterIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z"/>
    </svg>
);


export const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export const TextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M5 4.75A.75.75 0 015.75 4h8.5a.75.75 0 010 1.5H11v8.5a.75.75 0 01-1.5 0V5.5H5.75A.75.75 0 015 4.75z" />
  </svg>
);

export const TextSlashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M5 4.75A.75.75 0 015.75 4h8.5a.75.75 0 010 1.5H11v8.5a.75.75 0 01-1.5 0V5.5H5.75A.75.75 0 015 4.75z" />
    <path fillRule="evenodd" d="M4.53 4.53a.75.75 0 011.06 0l10 10a.75.75 0 01-1.06 1.06l-10-10a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const NewspaperIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h13A1.5 1.5 0 0118 3.5v10.75a3.25 3.25 0 01-3.25 3.25H3.5A1.5 1.5 0 012 16V3.5zM3.5 4v11.458A1.75 1.75 0 005.25 17h9.5A1.75 1.75 0 0016.5 15.25V4H3.5z" clipRule="evenodd" />
    <path d="M5.25 7a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 015.25 7zm0 3a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 015.25 10zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 015.25 13z" />
  </svg>
);

export const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path d="M5 2.5a.5.5 0 01.5-.5h8.293l2.853 2.854a.5.5 0 01.146.353V17.5a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-14zM10 12.5a.5.5 0 00-1 0v2a.5.5 0 001 0v-2z" />
        <path d="M6 3a1 1 0 00-1 1v1a1 1 0 001 1h8a1 1 0 001-1V4a1 1 0 00-1-1H6zM8.5 15a.5.5 0 00.5.5h2a.5.5 0 000-1h-2a.5.5 0 00-.5.5z" />
    </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
  </svg>
);

export const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.255a8.5 8.5 0 014.288 1.638l.43-.43a.75.75 0 111.06 1.06l-.43.43A8.502 8.502 0 0118 10a.75.75 0 01-1.5 0a7 7 0 10-7.387 6.94l-1.021.216a.75.75 0 01-.832-.832l.216-1.022A6.996 6.996 0 0010 17a7 7 0 007-7 .75.75 0 011.5 0 8.5 8.5 0 11-4.862-7.854l.43-.43a.75.75 0 01-1.06-1.06l-.43.43A8.5 8.5 0 0110.75 3.005V2.75A.75.75 0 0110 2zM9.25 5.5a.75.75 0 00-1.5 0v5.5c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V5.5z" clipRule="evenodd" />
    </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25V4c.827-.05 1.66-.075 2.5-.075zM7.443 17.25a.25.25 0 00.25.25h4.614a.25.25 0 00.25-.25L12.057 6h-4.113L7.443 17.25z" clipRule="evenodd" />
    </svg>
);

export const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
    <path fillRule="evenodd" d="M6.21 6.77a.75.75 0 011.06.02l3.97 4.125 3.97-4.125a.75.75 0 111.08 1.04l-4.5 4.675a.75.75 0 01-1.08 0l-4.5-4.675a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" clipRule="evenodd" />
    <path d="M10 3.75a.75.75 0 01.75.75v10.75a.75.75 0 01-1.5 0V4.5a.75.75 0 01.75-.75z" />
    <path d="M14.25 5.25h1.5a2.25 2.25 0 012.25 2.25v5a2.25 2.25 0 01-2.25 2.25h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 00.75-.75v-5a.75.75 0 00-.75-.75h-1.5a.75.75 0 010-1.5zM5.75 5.25h-1.5A2.25 2.25 0 002 7.5v5A2.25 2.25 0 004.25 14.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 01-.75-.75v-5a.75.75 0 01.75-.75h1.5a.75.75 0 000-1.5z" />
  </svg>
);
