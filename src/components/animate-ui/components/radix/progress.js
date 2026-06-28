import React from 'react';

export const Progress = ({ value, className, style }) => {
  return (
    <div 
      className={className} 
      style={{
        position: 'relative',
        height: '8px',
        width: '100%',
        overflow: 'hidden',
        borderRadius: '9999px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        ...style
      }}
    >
      <div 
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: '#5227FF',
          boxShadow: '0 0 12px rgba(82, 39, 255, 0.8)',
          transition: 'transform 600ms cubic-bezier(0.65, 0, 0.35, 1)',
          transform: `translateX(-${100 - (value || 0)}%)`
        }} 
      />
    </div>
  );
};
