// Table.js
import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const tableCardStyle = {
  backgroundColor: '#fff',
  border: '1px solid #ddd',
  margin: '10px 0',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s, box-shadow 0.3s',
};

const tableCardHoverStyle = {
  transform: 'scale(1.02)',
  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
};

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s, transform 0.3s',
};

const buttonHoverStyle = {
  backgroundColor: '#218838',
  transform: 'scale(1.05)',
};

const Table = ({ table, onMarkPaid }) => {
  console.log(table)
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <div
      style={{
        ...tableCardStyle,
        ...(hoveredCard === table.Table ? tableCardHoverStyle : {}),
      }}
      onMouseEnter={() => setHoveredCard(table.Table)}
      onMouseLeave={() => setHoveredCard(null)}
    >
      <h3 style={{ display: 'flex', alignItems: 'center' }}>
        <AiOutlineShoppingCart style={{ marginRight: '10px' }} />
        Table {table.Table}
      </h3>
      <p><strong>Order Data:</strong></p>
      {table.order_data.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {table.order_data.map((order, index) => (
            <li key={index} style={{ marginBottom: '10px' }}>
    
              <strong>{order.name}</strong> (Qty: {order.qty}, Size: {order.size}) - ₹{order.price}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders</p>
      )}
      {table.order_data.length > 0 && (
        <button
          style={{
            ...buttonStyle,
            ...(hoveredButton === table.Table ? buttonHoverStyle : {}),
          }}
          onMouseEnter={() => setHoveredButton(table.Table)}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => onMarkPaid(table.Table)}
        >
          <FaCheckCircle style={{ marginRight: '8px' }} /> Mark as Paid
        </button>
      )}
    </div>
  );
};

export default Table;
