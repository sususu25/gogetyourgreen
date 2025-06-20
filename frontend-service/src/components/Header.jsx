import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
    return (
        <header className="header solid">
            <div className="logo">
                <Link to="/">GoGetYourGreen</Link>
            </div>
            <nav>
                <ul className="nav-links">
                    <li><Link to="/my-page">My Page</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header; 