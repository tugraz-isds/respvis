import React, {useState} from 'react';

export const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <p
      style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic', fontSize: '1.2em' }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            backgroundColor: 'black',
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
            top: '100%',
            left: '50%',
            width: 'max-content',
            maxWidth: '100%',
            transform: 'translateX(-50%)',
            zIndex: '999',
          }}
        >
          {text}
        </div>
      )}
    </p>
  );
};
