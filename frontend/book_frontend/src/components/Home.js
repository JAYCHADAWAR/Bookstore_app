import React from 'react';
import  { useState,useEffect } from 'react';
import io from 'socket.io-client';
import '../CSS/Home.css';



const Home = () => {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    console.log('in fetch books');
    try {

      const token = localStorage.getItem('token');
      const backendUrl = 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/getbooks`,{method: 'GET', headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }});

      if (!response.ok) {
        console.log('could not fetch');
        alert('could not fetch');
      }
  
      const data = await response.json();
      setBooks(data.books);
      console.log(data); 
    

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
     fetchBooks(); 
  }, []);

  useEffect(() => {
    
    const socket = io('http://localhost:3001');     
    socket.on('bookLiked', () => {
      console.log(`Book was liked by other users,refetching books`);
      fetchBooks();
    });

        return () => {
      socket.disconnect();
    };
  }, []);


  const handleLikeClick = async (bookId,liked) => {
    try {
     
      // console.log('in handle fucntion',bookId);
      // console.log('in handle fucntion',liked);
      const backendUrl = 'http://localhost:3001';
      const socket = io(backendUrl);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendUrl}/setlike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body:JSON.stringify({bookId:bookId,liked:liked})
      });
      console.log(response);
      if(response.ok)
      {
        console.log('updated');
      }

      const response2 = await fetch(`${backendUrl}/updateuserbklikes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''

        },
        body:JSON.stringify({bookId:bookId,liked:liked})
      });
      if(response2.ok)
      {
        console.log('updated');
      }
      
      fetchBooks();
      socket.emit('likeBook');
      //socket.close();
      
    } catch (error) {
      console.error('Error updating like status:', error);
    }
  };
  

  


  
 
  
  return (
    <div>
     <h1 style={{ display: 'flex',justifyContent: 'center' }}>Books</h1>

      <div className="products-container">
      {books.map((book) => (
      <div className="container">
        <div className="product-card">
          <div className="product-image">
            
          <img src={`http://localhost:3001/public/${book.imagepath}`} alt="Product Image" />
          </div>
          <div className="product-details">
            <h2 className="product-title">{book.bookname}</h2>
            <p className="product-price">liked by {book.likes} users</p>
            <button className="add-to-cart-btn" onClick={() => handleLikeClick(book.id,book.liked)}>{book.liked ? 'Liked' : 'Like'}</button>
            <a href={`http://localhost:3001/public/${book.filepath}`} download>Download</a>
            
          </div>
        </div>
       </div>
      ))}
      </div>
    </div>
  );
};

export default Home;