import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Brand */}
        <div className="footer-section">
          <h3>🍽 Recipe Book</h3>
          <p>Your daily dose of delicious recipes.</p>
        </div>

        {/* Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li>Home</li>
            <li>Search Recipes</li>
            <li>Popular</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Social */}
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <span>🌐</span>
            <span>📸</span>
            <span>🐦</span>
            <span>📘</span>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Recipe Book | Made with ❤️
      </div>
    </footer>
  );
};

export default Footer;
