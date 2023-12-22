 
--uuid extension 

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--users create table query

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255) UNIQUE
);

--books create table query

CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    path VARCHAR(255) NOT NULL,
    likes VARCHAR(50) NOT NULL,
    image_path VARCHAR(255) NOT NULL
);

--insert query for books

INSERT INTO books (name, path, likes, image_path)
VALUES
    ('to kill a monkey bird', 'book1.pdf', '0', 'books2.webp'),
    ('fredrik backman', 'book4.pdf', '0', 'books4.jpg'),
    ('normal people', 'book5.pdf', '0', 'books5.jpeg'),
    ('Then hidden hindu', 'book3.pdf', '0', 'books1.webp'),
    ('the psychology of money', 'book1.pdf', '0', 'books6.avif'),
    ('soul', 'book1.pdf', '0', 'books3.jpeg');

--create query for user_likes table

CREATE TABLE user_likes (
    bookid UUID NOT NULL,
    userid UUID NOT NULL
);


--create admin table

CREATE TABLE admin (
    id UUID PRIMARY KEY,
    admin_name VARCHAR(100) NOT NULL,
    admin_email VARCHAR(100) UNIQUE NOT NULL,
    admin_password VARCHAR(100) NOT NULL
);

--insert query for admin
INSERT INTO admin (id, admin_name, admin_email, admin_password)
VALUES (uuid_generate_v4(), 'Admin', 'admin@gmail.com', 'a');


