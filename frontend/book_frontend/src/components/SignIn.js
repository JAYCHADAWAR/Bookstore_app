import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignIn = ({handleSignUp}) => {
    const [formData, setFormData] = useState({
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
          const response = await fetch(`${backendUrl}/signin`, {
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
            console.log('login successful');
            navigate('/home');
          } else if (response.status === 400) {
            const errorData = await response.json();
            console.error('Failed to sign up:', errorData.error);
            alert('login failed: ' + errorData.error); 
          } 
          else {
            console.error('Unexpected error occurred');
            alert('An unexpected error occurred. Please try again later.'); 
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };
  return (
   
     <div className="form-container">
      <h2>Sign In</h2>
     
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
        </div>
        <button type="submit">Sign In</button>
      </form>
     
   
     
    </div>
  );
};

export default SignIn;
