 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Admin_login = ({handleAdminLogin}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });
      const navigate = useNavigate();
     
      
    
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const backendUrl = 'http://localhost:3001';
        console.log(formData);
        try {
          const response = await fetch(`${backendUrl}/admin_signin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
    
          if (response.status === 201) {
            const data = await response.json();
           
            localStorage.setItem('admintoken', data.token);
            handleAdminLogin();
            console.log('login successful');
            alert('Login successful!');
            navigate('/admin');
          }else if (response.status === 400) {
            const data = await response.json();
            console.error('admin Failed to sign in:', data.message);
            alert('Invalid credentials: ' + data.message);
          } else {
           
            console.error('Unexpected error occurred');
            alert('An unexpected error occurred. Please try again later.');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An unexpected error occurred. Please try again later.');
        }
    };
  return (
   
     <div className="form-container">
      <h2>Admin Sign In</h2>
     
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

export default Admin_login;
