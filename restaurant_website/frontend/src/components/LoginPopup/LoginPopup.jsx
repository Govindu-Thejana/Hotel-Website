// LoginPopup.jsx
import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Add your form submission logic here
    setTimeout(() => setIsLoading(false), 1000); // Simulated loading
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img 
            onClick={() => setShowLogin(false)} 
            src={assets.cross_icon} 
            alt="Close popup" 
            title="Close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input 
              type="text" 
              placeholder="Your Name" 
              required 
              autoComplete="name"
            />
          )}
          <input 
            type="email" 
            placeholder="Your Email" 
            required 
            autoComplete="email"
          />
          <input 
            type="password" 
            placeholder="Your Password" 
            required 
            autoComplete={currState === "Sign Up" ? "new-password" : "current-password"}
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading 
            ? "Loading..." 
            : currState === "Sign Up" 
              ? "Create Account" 
              : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the Terms and Conditions
          </label>
        </div>

        <p>
          {currState === "Login" ? (
            <>
              Create a new account?{' '}
              <span onClick={() => setCurrState("Sign Up")}>Click Here</span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span onClick={() => setCurrState("Login")}>Login Here</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;