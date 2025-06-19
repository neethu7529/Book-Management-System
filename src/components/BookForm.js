import React, { useState } from 'react';
import axios from 'axios';

function BookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

 const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  console.log('Token:', token);

  if (!token) {
    alert('You must be logged in to add a book.');
    return;
  }

  try {
    const response = await axios.post(
      'http://localhost:5000/books',
      { title, author },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Book added:', response.data);
    window.location.href = '/books';

  } catch (error) {
    if (error.response) {
      console.error('Backend error:', error.response.status, error.response.data);
      alert(`Failed to add book: ${error.response.data.msg || 'Unknown error'}`);
    } else {
      console.error('Unknown error:', error);
      alert('Failed to add book. Please try again.');
    }
  }
};



  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Book Title"
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Add Book</button>
      </form>
    </div>
  );
}

export default BookForm;
