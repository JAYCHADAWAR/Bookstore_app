import React from 'react';
import  { useState,useEffect,useRef } from 'react';
import io from 'socket.io-client';
import '../CSS/Home.css';



const Home = () => {
  const [books, setBooks] = useState([]);
 const booksRef = useRef(books); 
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
      booksRef.current=data.books;
      console.log(data); 
    

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
     fetchBooks(); 
  }, []);

  useEffect(() => {
    console.log(books);
    const socket = io('http://localhost:3001');     
    socket.on('bookLiked', ({bookId,final_value}) => {
      console.log(bookId);
      console.log(final_value);
      console.log(`Book was liked by other users,refetching books`);
      console.log(booksRef.current);
      const bookIndex = booksRef.current.findIndex(book => book.id === bookId);

      if (bookIndex !== -1) {
          
           const updatedBooks = [...booksRef.current];
           updatedBooks[bookIndex].likes=String(final_value);
           console.log('updated books',updatedBooks);
           setBooks(updatedBooks);     
      }
    });
   
        return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    booksRef.current=books;
    console.log('state change',books);
    console.log('ref',booksRef.current); // This will log the updated books whenever the 'books' state changes
  }, [books]);

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
      const bookIndex = books.findIndex(book => book.id === bookId);

     if (bookIndex !== -1) {
         
          const updatedBooks = [...books];
          updatedBooks[bookIndex].liked = !liked;
          let final_value=parseInt(updatedBooks[bookIndex].likes,10);
          final_value += !liked ? 1 : -1;
          updatedBooks[bookIndex].likes=String(final_value);
          console.log('updated books',updatedBooks);
          setBooks(updatedBooks);

          socket.emit('likeBook',({bookId,final_value}));
           
     }
      
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