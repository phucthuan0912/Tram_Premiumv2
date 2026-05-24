import React from 'react';

const RotatingBadge = ({ 
  text = "TRẠM PREMIUM - TRẠM PREMIUM - ", 
  className = "",
  icon = "✦" 
}) => {
  const chars = text.split("");
  const degPerChar = 360 / chars.length;

  return (
    <div className={`relative flex items-center justify-center w-32 h-32 rounded-full ${className}`}>
      <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
        {chars.map((char, i) => (
          <span
            key={i}
            className="absolute top-0 left-0 right-0 text-center font-bold text-xs tracking-widest text-slate-800 origin-[50%_64px]"
            style={{ transform: `rotate(${i * degPerChar}deg)` }}
          >
            {char}
          </span>
        ))}
      </div>
      <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center z-10 shadow-lg text-lg animate-[spin_6s_linear_infinite_reverse]">
        {icon}
      </div>
    </div>
  );
};

export default RotatingBadge;
