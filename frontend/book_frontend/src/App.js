
import './App.css';
import React, { useState,useEffect } from 'react';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Home from './components/Home'; 
import Profile from './components/Profile'; 
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Navbar from './components/Navbar';
import Admin from './components/Admin';
import Admin_login from './components/Admin_login'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [isAdmin, setIsAdmin] = useState(false);

  
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    if (storedLoginStatus === 'true') {
      setIsLoggedIn(true);
    }

    const storedAdminStatus = localStorage.getItem('isAdmin');
    if (storedAdminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);



  const handleAdminSignOut = async () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
    alert('Admin logged out');
  };

  const handleAdminLogin = async () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const handleSignUp = async (e) => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true'); 
  };

  const handleSignOut = async() => {
    
    const backendUrl = 'http://localhost:3001';
    
    try {
      const response = await fetch(`${backendUrl}/logout`, {
        method: 'POST',
      });

      if (response.ok) {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
       alert('you are logged out');
     
      } else {
       
        alert('failed to logged out');
      }
    } catch (error) {
      console.error('Error:', error);
    }
    
  };
  return (
    <div>
    <BrowserRouter>
       <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} handleAdminSignOut={handleAdminSignOut} handleSignOut={handleSignOut} />
       
    <Routes>
      <Route path='/Admin' element={isAdmin ? <Admin/> : <h1>admin is not logged in</h1>}/>
      <Route path='/Admin_signin'  element ={!isAdmin ? <Admin_login handleAdminLogin={handleAdminLogin}/> : null}/>
        <Route exact path="/home" element={isLoggedIn ? <Home /> : <h1>You are not loggedin</h1>}/>
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <h1>You are not loggedin</h1>}  />
        <Route path="/signup"  element={!isLoggedIn ? <SignUp handleSignUp={handleSignUp}/> : null} />
        <Route path="/signin"  element={!isLoggedIn ? <SignIn handleSignUp={handleSignUp}/> : null}  />
    </Routes>
    </BrowserRouter>
    </div>
  
  );
}

export default App;
