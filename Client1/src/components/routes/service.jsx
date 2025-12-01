import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Service = () => {
  const navigate = useNavigate();

  // Check if the user is logged in
  const email = localStorage.getItem('EMAIL');
  const isLoggedIn = email !== null;

  useEffect(() => {
    if (!isLoggedIn) {
        console.log('Not logged in')
      navigate('/users/login');
    }
    else{
        console.log('welcome to service')  
    }
  }, [isLoggedIn, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('EMAIL');
    console.log('Logged out successfully');
    navigate('/users/login');
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Welcome to Service</h1>
          <button className="bg-black text-white p-2 rounded-3xl float-right" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Service;
