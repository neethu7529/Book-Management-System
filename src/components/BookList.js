

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function BookList() {
  const [books, setBooks] = useState([]);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/books', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(res.data);
    } catch (error) {
      console.error('Failed to fetch books:', error.response?.data?.msg || error.message);
    }
  };

  const deleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/books/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBooks(); // reload books after delete
    } catch (error) {
      console.error('Failed to delete book:', error.response?.data?.msg || error.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Books</h2>
      <Link to="/add-book" className="btn btn-success mb-3">Add New Book</Link>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>
                  <Link to={`/edit-book/${book._id}`} className="btn btn-primary btn-sm me-2">Edit</Link>
                  <button
                    onClick={() => deleteBook(book._id)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BookList;
