import React, { useState } from 'react';

const SignIn = ({handleSignUp}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

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
    
          if (response.ok) {
            const data = await response.json();
            console.log(data.token);
            localStorage.setItem('token', data.token);
            handleSignUp();
            console.log('login successful');
          } else {
            const errorData = await response.json(); 
            console.error('Failed to sign in:', errorData.error);
            alert( errorData.error);
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