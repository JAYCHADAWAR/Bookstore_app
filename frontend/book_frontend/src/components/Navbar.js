// Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../CSS/Navbar.css'; 
const Navbar = ({ isLoggedIn,isAdmin,handleAdminSignOut, handleSignOut }) => {
  return (
    <nav>
       
     
      <div className="nav-links">
      <div className="log">
              Bookstore
          </div>
      <div style={{ display: 'flex',justifyContent: 'flex-end'  }}>
        {isAdmin ? (
          <>
          <Link to ='/Admin' className="nav-link home">Admin</Link>
          <Link to='/Admin_logout' onClick={handleAdminSignOut} className='nav-link logout'>logout</Link>
          </>
        ):null}

        {isLoggedIn ? (
          <>
            <Link to="/home" className="nav-link home">Home</Link>
            <Link to="/profile"className="nav-link home">Profile</Link>
            <button onClick={handleSignOut} className="nav-link logout">Logout</button>
          </>
        ) : (
          <>
              {!isAdmin && (
                <>
                  <Link to='/Admin_signin' className="nav-link home">Admin login</Link>
                  <Link to="/signin" className="nav-link tabs">Sign In</Link>
                  <Link to="/signup" className="nav-link tabs">Sign Up</Link>
                </>
              )}
            </>
        )}
      </div>
      </div>
    </nav>
  );
};

export default Navbar;
