import React, { useState, useEffect } from 'react';
import { Activity, Sun, Moon, HelpCircle, X, BookOpen } from 'lucide-react';

export const MainLayout = ({ children, isDark, toggleTheme, onViewChange }) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [systemStatus, setSystemStatus] = useState({ 
    label: 'Connecting...', 
    color: 'bg-yellow-500' 
  });

  const theme = isDark ? {
    bg: 'bg-[#161616]', text: 'text-[#f4f4f4]', border: 'border-[#393939]',
    headerBg: 'bg-[#161616]', headerText: 'text-white',
    footerBg: 'bg-[#161616]', footerText: 'text-[#525252]'
  } : {
    bg: 'bg-[#f4f4f4]', text: 'text-[#161616]', border: 'border-gray-200',
    headerBg: 'bg-white', headerText: 'text-[#161616]',
    footerBg: 'bg-[#e0e0e0]', footerText: 'text-[#525252]'
  };

  const handleOpenGuide = () => {
    setIsAboutOpen(false);
    if (onViewChange) onViewChange('guide');
  };

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('https://xandeum-api.onrender.com/');
        const data = await response.json();
        
        if (data.status === 'online') {
          setSystemStatus({ label: 'API Online', color: 'bg-green-500' });
        } else {
          setSystemStatus({ label: 'API Degraded', color: 'bg-orange-500' });
        }
      } catch (error) {
        setSystemStatus({ label: 'Connection Failed', color: 'bg-red-500' });
      }
    };

    checkHealth();
    
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col h-screen w-full font-sans overflow-hidden ${theme.bg} ${theme.text} ${isDark ? 'dark' : ''}`}>
      
      <header className={`h-14 flex items-center px-6 shrink-0 z-50 border-b ${theme.border} ${theme.headerBg} ${theme.headerText} transition-colors duration-300`}>
        <div className="font-semibold tracking-wide flex items-center gap-2 cursor-pointer" onClick={() => onViewChange && onViewChange('overview')}>
          <Activity size={20} className="text-blue-600" />
          <span className="text-lg">XPLORER <span className="font-normal opacity-50 text-sm ml-2 hidden md:inline">Xandeum pNode Explorer</span></span>
        </div>
        

        <div className="ml-auto flex items-center gap-2">

          <button 
            onClick={() => setIsAboutOpen(true)}
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#353535] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-black'}`}
            title="About XPLORER"
          >
            <HelpCircle size={18} />
          </button>


          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-[#353535]' : 'hover:bg-gray-100'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>


      <main className={`flex-1 overflow-y-auto p-4 md:p-8 ${theme.bg}`}>
        <div className="max-w-[1600px] mx-auto min-h-full pb-10">{children}</div>
      </main>


      <footer className={`h-8 border-t flex items-center justify-between px-6 text-xs font-mono select-none shrink-0 ${theme.border} ${theme.footerBg} ${theme.footerText}`}>
        <div className="flex gap-4">
           <span>v1.1.0-beta</span>
           <span className="opacity-50">Build 2025.12.24</span>
        </div>
        
        <div className="flex items-center gap-2 transition-colors duration-500">
           <span className={`w-2 h-2 rounded-full shadow-sm ${systemStatus.color} ${systemStatus.color === 'bg-green-500' ? '' : 'animate-pulse'}`}></span>
           <span>{systemStatus.label}</span>
        </div>
      </footer>


      {isAboutOpen && (
        <div 

            onClick={() => setIsAboutOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 cursor-pointer"
        >
            <div 

                onClick={(e) => e.stopPropagation()}
                className={`relative w-full max-w-md rounded-lg shadow-2xl p-6 border cursor-default ${isDark ? 'bg-[#262626] border-[#393939]' : 'bg-white border-gray-200'}`}
            >

                <button 
                  onClick={() => setIsAboutOpen(false)}
                  className="absolute top-4 right-4 opacity-50 hover:opacity-100 transition-opacity"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-light mb-4 flex items-center gap-2">
                    <Activity className="text-blue-600" />
                    About XPLORER
                </h2>

                <p 
                className={`text-sm mb-4 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    XPLORER is a network monitor for the Xandeum Provider Node (pNode) storage layer. It visualizes real-time telemetry, global distribution, and capacity growth of the decentralized network.
                </p>

                <div className={`p-4 rounded mb-6 text-xs font-mono ${isDark ? 'bg-[#161616] text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
                    <div className="flex justify-between mb-1">
                        <span>Version:</span>
                        <span>1.1.0 (Beta)</span>
                    </div>
                    <div className="flex justify-between mb-1">
                        <span>Backend:</span>
                        <span className={systemStatus.color === 'bg-green-500' ? 'text-green-500' : 'text-red-500'}>
                            {systemStatus.label === 'API Online' ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>License:</span>
                        <span>MIT Open Source</span>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button 
                      className={`flex items-center gap-2 px-4 py-2 text-sm rounded border transition-colors ${isDark ? 'border-[#393939] hover:bg-[#353535]' : 'border-gray-200 hover:bg-gray-50'}`}
                      onClick={() => setIsAboutOpen(false)}
                    >
                        Close
                    </button>
                    <button 
                      onClick={handleOpenGuide}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    >
                        <BookOpen size={14} />
                        Operator Manual
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};