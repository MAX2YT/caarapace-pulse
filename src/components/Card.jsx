import React from 'react';

const Card = ({ children, className = '', title, action, ...props }) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || action) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {action && <div className="card-action">{action}</div>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

export default Card;