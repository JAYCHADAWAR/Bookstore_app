const express = require('express');
const socketio = require('socket.io');
const session = require('express-session');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const jwt = require('jsonwebtoken');

const {pool}=require('./connection.js')
const path = require('path');
app.use(session({
    secret: 'random',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 
      }
  }));
  
app.use(express.json()); 
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.send('Server is running'); 
  });
console.log(__dirname);

const secretKey = 'your_secret_key';


//middleware for verification of user
const verifyToken = (req, res, next) => {
  // console.log('authentication');
  const token = req.headers.authorization.split(" ")[1]; 
  // console.log(req.headers);
  // console.log(token);
  console.log(req.body);
  if (!token) return res.status(401).send('Unauthorized'); 

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token'); 
    req.user = decoded; 
    // console.log('userid:',req.user.id);
    next(); 
  });
};



app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        res.status(500).json({ error: 'Failed to logout' });
      } else {
        res.clearCookie('sessionID'); 
        res.status(200).json({ message: 'Logout successful' });
      }
    });
  });


app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('reqest',req.body);
    const userId=uuidv4();
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
     
      await pool.query('INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4)', [userId, name, email, password]);
      console.log('inserted into table');
      // req.session.isLoggedIn = true;
      // req.session.userid = userId;
      const user = { id: userId};
      const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
      res.status(201).json({ message: 'User signed up successfully',token: token  });
      
});

app.post('/signin', async (req, res) => {
  try{
    const {email, password } = req.body;
    console.log('reqest',req.body);
   
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1 AND password = $2', [email, password]);
    // console.log(userExists);

    if (userExists.rows.length === 1) {
      console.log(userExists.rows[0]);

      req.session.isLoggedIn = true;
     
      console.log('id:',userExists.rows[0].id);
      const user = { id: userExists.rows[0].id};
      const token = jwt.sign(user, secretKey, { expiresIn: '1h' });
      console.log('signin token:',token);
      res.status(201).json({ message: 'User signed in successfully',token: token });
    }
    else{
        return res.status(400).json({ error: 'Invalid credentials' });
    }
  }catch(error){
    res.status(500).json({ error: error});
  }
      
});

app.get('/getbooks',verifyToken, async (req,res) => {
    try {
        // console.log('in backend getbooks');
       // console.log(req.session);
        if(req.user.id){
          //  console.log(typeof req.user.id);
    const booksList = await pool.query(
        `SELECT 
        b.id AS id,
        b.name AS bookname,
        b.path AS filepath,
        b.image_path AS imagepath,
        b.likes AS likes,
        CASE WHEN ul.bookid IS NOT NULL THEN TRUE ELSE FALSE END AS liked 
    FROM 
        books AS b
    LEFT JOIN 
        user_likes AS ul ON b.id = ul.bookid AND ul.userid = $1`,[req.user.id]
      );
      //console.log(booksList);
      res.status(200).json({ books: booksList.rows});
    }
    else {
        console.log('unauthorized');
        res.status(401).json({ message: 'User not authenticated' }); // Handle unauthenticated user
      }
    }catch(error){
        res.status(500).json({ error: error });
    }

});

app.get('/getProfile',verifyToken, async (req,res) => {
    try {
        console.log('in backend');
       
        if(req.user.id){
            console.log(req.user.id);
    const profile = await pool.query(
        `Select email,name from users where id = $1`, [req.user.id]
      );
      //console.log(profile);
      res.status(200).json({ profile: profile.rows });
    }
    else {
        console.log('unauthorized');
        res.status(401).json({ message: 'User not authenticated' }); 
      }
    }catch(error){
        res.status(500).json({ error: error});
    }

});


app.post('/setlike', async (req, res) => {
    try {
      console.log('in like bookid setlike api');
      const { bookId,liked } = req.body;
      // console.log(bookId);
      // console.log(liked);
      const { rows } = await pool.query(
        'SELECT likes FROM books WHERE id = $1',
        [bookId]
      );
      // console.log(rows);
      if(liked){
        await pool.query(`UPDATE books
        SET likes =$1
        WHERE id = $2`,[String(parseInt(rows[0].likes) - 1,10),bookId]);
        res.status(200).json({ message: `Book with ID ${bookId} unliked successfully` });
      }
      else{
        await pool.query(`UPDATE books
        SET likes =$1
        WHERE id = $2`,[String(parseInt(rows[0].likes) + 1,10),bookId]);
        res.status(200).json({ message: `Book with ID ${bookId} liked successfully` });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  });

  app.post('/updateuserbklikes',verifyToken, async (req, res) => {
    try {
      console.log('in like bookid');
      const { bookId,liked } = req.body;
      // console.log(bookId);
      // console.log(liked);
      if(liked){
        await pool.query(
          'DELETE FROM user_likes WHERE bookid = $1 AND userid = $2',
          [bookId, req.user.id]
        );
        res.status(200).json({ message: `Book with ID ${bookId} unliked successfully` });
      }
      else{
        await pool.query(
          'INSERT INTO user_likes (bookid, userid) VALUES ($1, $2)',
          [bookId,  req.user.id]
        );
        res.status(200).json({ message: `Book with ID ${bookId} liked successfully` });
      }
    } catch (error) {
      
      res.status(500).json({ error: error});
    }
  });


app.post('/updateprofile',async(req,res) => {
  try {
  const {email,name}=req.body;
  // console.log('in update rpofile',req.body);
  // console.log(email);
  // console.log(name);

  await pool.query('UPDATE users SET email = $1, name = $2 WHERE email = $3', [email, name, email]);
  res.status(200).json({ message: `updated rpofile` });
  }
  catch (error) {
      
    res.status(500).json({ error: error.message });
  }

});
// app.get('/checkSession',async (req,res)=>{
//     res.status(200).json({message:req.user});
// })

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const io = socketio(server,{
  cors: {
    origin: ['http://localhost:3000', 'null'], // Allow specific origins including 'null' for Incognito
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  }
});
io.on('connection', (socket) => {
    console.log('New connection',socket.id);
    socket.on('disconnect', (socket) => {
        console.log('A user disconnected',socket.id);
      });
    socket.on('likeBook', ({bookId,final_value}) => {
        console.log('likebook event recieved',socket.id);
        console.log(bookId);
        console.log(final_value);
        io.emit('bookLiked',({bookId,final_value})); 
    });
});


