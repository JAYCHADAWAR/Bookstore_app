import React, { useState } from 'react';
import '../CSS/signup.css';
import { useNavigate } from 'react-router-dom';


const SignUp = ({handleSignUp}) => {
    const [formData, setFormData] = useState({
        name:'',
        email: '',
        password: ''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
      const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = 'http://localhost:3001';
    console.log(formData);
    try {
      const response = await fetch(`${backendUrl}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.status === 201) {
        const data = await response.json();
        console.log(data.token);
        localStorage.setItem('token', data.token);
        handleSignUp();
        console.log('login successfully');
        navigate('/home');
      } else if (response.status === 400) {
        const errorData = await response.json();
        console.error('Failed to sign up:', errorData.error);
        alert('Sign up failed: ' + errorData.error);
      } 
      else {
        const errorData = await response.json(); 
        console.error('Failed to sign up:', errorData.error);
        alert( errorData.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
   
  };

  return (
    <div className="form-container">
    <h2>Sign Up</h2>
    
    <form onSubmit={handleSubmit}>
      <div>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
      </div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    
 
   
  </div>
  );
};

export default SignUp;
