import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import BookForm from './components/BookForm';
import BookList from './components/BookList';
import EditBook from './components/EditBook';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-book"
          element={isAuthenticated ? <BookForm /> : <Navigate to="/login" />}
        />
        <Route
          path="/books"
          element={isAuthenticated ? <BookList /> : <Navigate to="/login" />}
        />
         <Route path="/edit-book/:id" element={<EditBook />} />
      </Routes>
    </Router>
  );
}

export default App;
