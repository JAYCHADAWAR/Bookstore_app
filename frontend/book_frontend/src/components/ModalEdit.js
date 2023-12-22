import { useState } from 'react';
import React from 'react';
import '../CSS/Modal.css'; // Import your CSS file

const Modal = ({ isOpen, onClose, bookdetails }) => {
  const modalClassName = isOpen ? 'modal show' : 'modal'; // Conditionally apply class based on isOpen


  const [books,setBooks]=useState({name:'',thumbnail:null,pdf_file:null});

  const handleedit = async (e)=>{
     e.preventDefault();
     console.log('in handleedit func');
      const token=localStorage.getItem('admintoken');
      const backendUrl = 'http://localhost:3001';
      console.log('books',books);
      const formData = new FormData();
        formData.append('name', books.name);
        formData.append('id', bookdetails?.id);
        if (books.thumbnail) {
          formData.append('thumbnail', books.thumbnail);
        }
        if (books.pdf_file) {
          formData.append('pdf_file', books.pdf_file);
        }
      try {
        const response = await fetch(`${backendUrl}/editbook`, {
          method: 'PATCH',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: formData
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          
          onClose();
          console.log('Data sent successfully');
        } else {
          const errorData = await response.json(); 
          console.error('Failed to sign up:', errorData.error);
          alert( errorData.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
  }
  const handleinputchnage=(e)=>{
    const { name, value ,files} = e.target;
    if (files) {
        setBooks({ ...books, [name]: files[0] });
      } else {
        setBooks({ ...books, [name]: value });
      }
  }
  return (
    <div className={modalClassName}>
    <div className="modal-content">
      <span className="close" onClick={onClose}>&times;</span>
      <h2>Edit Book id:{bookdetails?.id || null}</h2>
      <form className='formdata' onSubmit={handleedit}>
          <label>Name:</label>
          <input type="text" name="name" value={books.name || bookdetails?.name ||  null} onChange={handleinputchnage} />
          <label>Upload thumbnail:<br></br></label>
          <input type="file" name="thumbnail" onChange={handleinputchnage} />
          <label>Upload Book file:<br></br></label>
          <input type="file" name="pdf_file"  onChange={handleinputchnage} />
          <button type="submit">Submit</button>
      </form>
      {/* Add your modal content here */}
    </div>
  </div>
  );
};

export default Modal;
