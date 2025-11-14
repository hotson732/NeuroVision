import React from "react";

const Card = ({ children }) => {
  return (
   <div>
  <div style={{
    width: '100%', 
    maxWidth: '503px', 
    height: '601px',
    padding: '40px', 
    background: '#d6d6d6', 
    borderRadius: '25px', 
    border: '1px solid #ccc',
    contentAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  }}>
    {children}
  </div>
</div>
  );
};

export default Card;
