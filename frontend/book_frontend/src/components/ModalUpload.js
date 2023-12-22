import React, { useState } from 'react';
import '../CSS/Modal.css'; // Import your CSS file



const ModalUpload = ({ isOpenU, onCloseU }) => {
  const modalClassName = isOpenU ? 'modal show' : 'modal'; // Conditionally apply class based on isOpen

  const [books,setBooks]=useState({name:'',thumbnail:null,pdf_file:null});

  const handlupload = async (e)=>{
     e.preventDefault();
      const token=localStorage.getItem('admintoken');
      const backendUrl = 'http://localhost:3001';
      console.log('books',books);
      const formData = new FormData();
        formData.append('name', books.name);
        formData.append('thumbnail', books.thumbnail);
        formData.append('pdf_file', books.pdf_file);

      try {
        const response = await fetch(`${backendUrl}/uploadbook`, {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: formData
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data.token);
          
          onCloseU();

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
        <span className="close" onClick={onCloseU}>&times;</span>
        <h2>Upload Book</h2>
        <form className='formdata' onSubmit={handlupload}>
            <label>Name:</label>
            <input type="text" name="name" value={books.name} onChange={handleinputchnage} required/>
            <label>Upload thumbnail:<br></br></label>
            <input type="file" name="thumbnail" onChange={handleinputchnage} required/>
            <label>Upload Book file:<br></br></label>
            <input type="file" name="pdf_file"  onChange={handleinputchnage} required/>
            <button type="submit">Submit</button>
        </form>
        {/* Add your modal content here */}
      </div>
    </div>
  );
};

export default ModalUpload;
