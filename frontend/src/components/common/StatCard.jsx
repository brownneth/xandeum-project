import React from 'react';

export const StatCard = ({ label, value, subLabel, icon: Icon, isDark, status }) => {

  const carbonColors = {
    green: '#24A148', 
    blue: '#0F62FE'  
  };

  const activeColor = status === 'healthy' ? carbonColors.green : carbonColors.blue;

  return (
    <div 
      className={`
        p-5 border-l-4 h-40 flex flex-col justify-between 
        transition-all duration-200 cursor-pointer group
        ${isDark 
          ? 'bg-[#262626] border-[#393939] hover:bg-[#2f2f2f]' 
          : 'bg-white border-gray-200 hover:shadow-md'}
      `}
      style={{ borderLeftColor: activeColor }}
    >
      <div className="flex justify-between">
        <span className="text-sm font-medium opacity-70 group-hover:opacity-100 transition-colors" style={{ color: isDark ? '#fff' : '#161616' }}>
            {label}
        </span>
        {Icon && (
          <Icon 
            size={20} 
            className="opacity-50 group-hover:opacity-100 transition-all" 
            style={{ color: activeColor }}
          />
        )}
      </div>
      
      <div>
        <div className="text-4xl font-light" style={{ color: isDark ? '#f4f4f4' : '#161616' }}>
            {value}
        </div>
        {subLabel && (
            <div className="text-xs mt-1 opacity-70 flex items-center gap-1">
                {subLabel}
            </div>
        )}
      </div>
    </div>
  );
};