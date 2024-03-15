import React, { useState } from 'react';
import axios from 'axios';
import './ForgotPassword.css'; // Import CSS file for styling

function ForgotPassword() {
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resetStep, setResetStep] = useState(1); // Track the reset step: 1 for email, 2 for OTP verification, 3 for password reset

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'otp') setOTP(value);
    if (name === 'newPassword') setNewPassword(value);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:8081/forgot-password', { email });
      setMessage(response.data.message);
      setLoading(false)
      // setResetStep(2); // Move to OTP verification step
    } catch (error) {
      console.error(error);
      setMessage('Failed to send OTP. Please try again later.');
    }
  };

  // const handleOTPSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:8081/forgotpassword/verifyOTP', { email, otp });
  //     setMessage(response.data.message);
  //     if (response.data.success) {
  //       setResetStep(3); // Move to password reset step
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setMessage('Failed to verify OTP. Please try again.');
  //   }
  // };

  // const handlePasswordSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await axios.post('http://localhost:8081/forgotpassword/resetPassword', { email, newPassword });
  //     setMessage(response.data.message);
  //   } catch (error) {
  //     console.error(error);
  //     setMessage('Failed to reset password. Please try again later.');
  //   }
  // };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <h2>Forgot Password</h2>
        {/* {resetStep === 1 && ( */}
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
        {/* )} */}
        {/* {resetStep === 2 && (
          <form onSubmit={handleOTPSubmit}>
            <div className="form-group">
              <label>OTP:</label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Verify OTP</button>
          </form>
        )}
        {resetStep === 3 && (
          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Reset Password</button>
          </form>
        )} */}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default ForgotPassword;
