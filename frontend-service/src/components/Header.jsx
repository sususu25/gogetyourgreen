import React from 'react';
import './Header.css';

function Header() {
    return (
        <header className="header solid">
            <div className="logo">GoGetYourGreen</div>
            <nav>
                <ul className="nav-links">
                    <li><a href="#">My Page</a></li>
                    <li><a href="#">Cart</a></li>
                    <li><a href="#">Login</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header; 