import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css';

function ForgotPassword() {
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:8081/forgot-password', { email });
      setMessage(response.data.message);
      setLoading(false)
      
    } catch (error) {
      console.error(error);
      setMessage('Failed to send OTP. Please try again later.');
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <h2>Forgot Password</h2>
        
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {
                loading ?
                "Loading"
                :
                "Send Email"
              }
              
              </button>
          </form>
        
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
