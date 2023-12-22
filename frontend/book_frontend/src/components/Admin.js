import React, { useEffect, useState } from 'react';
import '../CSS/Admin.css';
import Modal from './ModalEdit.js';
import ModalUpload from './ModalUpload.js';
const Admin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState({id:'',name:''});
  const [books, setBooks] = useState([]);

  const handleEditClick = (bookId,name) => {
    setSelectedBook({ id: bookId, name: name });
    setIsModalOpen(true);
  };

  const handledelete=async(bookId)=>{
    try {

        const token = localStorage.getItem('admintoken');
        const backendUrl = 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/deletebook`,{
            method: 'DELETE',
             headers: {
            'Content-Type': 'application/json',
             'Authorization': token ? `Bearer ${token}` : ''
          },
        body:JSON.stringify({id:bookId})
    });
  
        if (response.ok) {
          console.log('deleted successfuly');
          alert('book deleted');
          window.location.reload();
        }
        else{
            alert('could not delete');
            console.log(response.message);
        }
      } catch (error) {
        console.error('Error delete book:', error);
      }
  }


  const handleCloseModal = () => {
    setIsModalOpen(false);
    window.location.reload();
    //setSelectedBook(null);
  };
  const [isModalOpenU, setIsModalOpenU] = useState(false);
  
 
  const handleUploadClick = () => {
    setIsModalOpenU(true);
  };

  const handleCloseModalU = () => {
    setIsModalOpenU(false);
    window.location.reload();
    // Additional logic if needed upon closing the upload modal
  };
  
  const fetchBooks = async () => {
    console.log('in fetch books');
    try {

      const token = localStorage.getItem('admintoken');
      const backendUrl = 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/getallbooks`,{method: 'GET', headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }});

      if (!response.ok) {
        console.log('could not fetch');
        alert('could not fetch');
      }
  
      const data = await response.json();
      setBooks(data.books);
      

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchBooks(); 
 }, []);
  return (
    <div>
      <h1 style={{  display: 'flex',justifyContent: 'center',color:'rgb(47, 50, 242)'}}>Admin Panel</h1>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button className="uploadbtn" onClick={handleUploadClick}>
        Upload Book
      </button>
    </div>

      <div className="container mt-3">
        <div className="wrapper">
        <div className="table-container" style={{ maxHeight: '300px',borderRadius:'5px', overflowY: 'auto',boxShadow:' 0 2px 4px rgba(0, 0, 0, 0.1)'}}>
          <div className="table">
            <div className="row header">
              <div className="cell">Name</div>
              <div className="cell">Likes</div>
              <div className="cell" data-title="Action">
                Action
              </div>
            </div>
            
            {books.map((book) => (
                <div className="row">
              <div className="cell" data-title="Name">
                {book.name}
              </div>
              <div className="cell" data-title="Likes">
               {book.likes}
              </div>
              <div className="cell" data-title="Action">
                <button className="editbtn" onClick={() => handleEditClick(book.id,book.name)}>Edit</button> 
              
                <button className="deletebtn" onClick={() => handledelete(book.id)}>Delete</button> 
              </div>
            
            </div>

            ))}
            
          </div>
          </div>
        </div>
      </div>
      <ModalUpload isOpenU={isModalOpenU} onCloseU={handleCloseModalU} />
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} bookdetails={selectedBook}/>
    </div>
  );
};

export default Admin;
