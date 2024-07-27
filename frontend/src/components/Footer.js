import React from 'react';

const buttonStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.3s, transform 0.3s',
  marginLeft: 'auto',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
  transform: 'scale(1.05)',
};

export default function Footer() {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div>
      <div className="container">
        <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
          <div className="col-md-4 d-flex align-items-center">
            <a href="/" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
            </a>
            <span className="text-muted">© 2022 <i>GoFood</i>, Inc</span>
          </div>
          <button
            style={{ ...buttonStyle, ...(hovered ? buttonHoverStyle : {}) }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => window.location.href = '/login'} // Adjust this URL to match your admin login page
          >
            Login as Admin
          </button>
        </footer>
      </div>
    </div>
  );
}

