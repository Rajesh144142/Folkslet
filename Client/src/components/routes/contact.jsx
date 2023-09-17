import React from 'react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('EMAIL') !== null;

  if (!isLoggedIn) {
    navigate('/users/login');
    return null;
  }

  return (
    <div className="contact-page">
      {/* Contact page content */}
      <h1>Contact Page</h1>
    </div>
  );
};

export default Contact;
